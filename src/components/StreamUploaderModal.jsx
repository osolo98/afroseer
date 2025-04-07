import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import axios from 'axios';

export default function StreamUploaderModal({ isOpen, onClose }) {
  const [user] = useAuthState(auth);
  const [caption, setCaption] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!videoFile || !user) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', videoFile);
      formData.append('upload_preset', 'afroseerup_streams');
      const res = await axios.post(`https://api.cloudinary.com/v1_1/dp3zo88se/video/upload`, formData);
      const videoUrl = res.data.secure_url;

      await addDoc(collection(db, 'streams'), {
        videoUrl,
        caption,
        userId: user.uid,
        username: user.email.split('@')[0],
        createdAt: serverTimestamp(),
        likes: [],
        commentsCount: 0,
      });

      setCaption('');
      setVideoFile(null);
      onClose();
    } catch (err) {
      alert('Upload failed');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="z-50 relative">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full">
          <Dialog.Title className="text-lg font-semibold mb-4">Upload Stream</Dialog.Title>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setVideoFile(e.target.files[0])}
            className="mb-4"
          />
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Add a caption"
            className="w-full border p-2 rounded mb-4"
          />
          <button
            onClick={handleUpload}
            disabled={uploading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            {uploading ? 'Uploading...' : 'Post Video'}
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
