// 📄 src/components/CreatePostModal.jsx

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { addDoc, collection, serverTimestamp, getDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { uploadToCloudinary } from '../utils/uploadToCloudinary';

export default function CreatePostModal({ isOpen, onClose }) {
  const [text, setText] = useState('');
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [mediaUrl, setMediaUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [posting, setPosting] = useState(false);

  const MAX_IMAGE_SIZE_MB = 5;
  const MAX_VIDEO_SIZE_MB = 20;

  const handleMediaSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const isVideo = file.type.startsWith("video");
    const sizeMB = file.size / (1024 * 1024);

    if (isVideo && sizeMB > MAX_VIDEO_SIZE_MB) {
      alert("Video is too large. Max 20MB allowed.");
      return;
    }

    if (!isVideo && sizeMB > MAX_IMAGE_SIZE_MB) {
      alert("Image is too large. Max 5MB allowed.");
      return;
    }

    const type = isVideo ? "video" : "image";
    setMediaType(type);
    setUploading(true);

    try {
      const url = await uploadToCloudinary(file, type);
      setMediaUrl(url);
    } catch (err) {
      alert("Media upload failed.");
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handlePost = async () => {
    if (!text.trim()) return;

    const user = auth.currentUser;
    if (!user) {
      alert("Please log in to post.");
      return;
    }

    setPosting(true);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);
      if (!userSnap.exists()) throw new Error('User profile not found.');

      const { displayName, username, avatar } = userSnap.data();

      await addDoc(collection(db, 'echoes'), {
        text: text.trim(),
        userId: user.uid,
        displayName: displayName || 'Unnamed User',
        username: username || 'unknown',
        avatar: avatar || '',
        createdAt: serverTimestamp(),
        likes: [],
        views: 0,
        commentsCount: 0,
        type: 'echo',
        ...(mediaUrl && { mediaUrl }),
        ...(mediaType && { mediaType }),
      });

      setText('');
      setMediaUrl('');
      setMediaType(null);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post.');
    } finally {
      setPosting(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-5 shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-3">Create Echo</Dialog.Title>

          <textarea
            rows={4}
            className="w-full border rounded p-2 mb-3"
            placeholder="What's happening?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <input
            type="file"
            accept="image/*,video/*"
            onChange={handleMediaSelect}
            className="mb-2"
          />

          {uploading && <p className="text-sm text-gray-500 mb-2">Uploading media...</p>}

          {mediaUrl && mediaType === "image" && (
            <div className="w-full max-h-[300px] overflow-hidden rounded mb-2 flex justify-center items-center">
              <img
                src={mediaUrl}
                alt="Preview"
                className="object-contain max-h-[300px] rounded"
              />
            </div>
          )}

          {mediaUrl && mediaType === "video" && (
            <video
              src={mediaUrl}
              controls
              className="w-full rounded mb-2 max-h-[300px] object-contain"
            />
          )}

          <div className="flex justify-between">
            <button
              onClick={onClose}
              className="text-sm text-gray-500 hover:underline"
              disabled={posting}
            >
              Cancel
            </button>

            <button
              onClick={handlePost}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              disabled={posting || uploading}
            >
              {posting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
