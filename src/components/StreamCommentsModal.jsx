import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { collection, addDoc, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { serverTimestamp } from 'firebase/firestore';

export default function StreamCommentsModal({ streamId, onClose }) {
  const [comments, setComments] = useState([]);
  const [user] = useAuthState(auth);
  const [text, setText] = useState('');

  useEffect(() => {
    const q = query(
      collection(db, 'streams', streamId, 'comments'),
      orderBy('createdAt', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setComments(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [streamId]);

  const handlePost = async () => {
    if (!text || !user) return;

    await addDoc(collection(db, 'streams', streamId, 'comments'), {
      text,
      userId: user.uid,
      username: user.email.split('@')[0],
      createdAt: serverTimestamp(),
    });

    const streamRef = doc(db, 'streams', streamId);
    await updateDoc(streamRef, {
      commentsCount: comments.length + 1,
    });

    setText('');
  };

  return (
    <Dialog open={true} onClose={onClose} className="z-50 relative">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-lg p-6 max-w-md w-full h-[80vh] flex flex-col">
          <Dialog.Title className="text-lg font-semibold mb-4">Comments</Dialog.Title>

          <div className="flex-1 overflow-y-scroll space-y-3 mb-4">
            {comments.map((c) => (
              <div key={c.id} className="bg-gray-100 rounded p-2">
                <p className="text-sm font-semibold">@{c.username}</p>
                <p className="text-sm">{c.text}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write a comment"
              className="flex-1 border p-2 rounded"
            />
            <button
              onClick={handlePost}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Post
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
