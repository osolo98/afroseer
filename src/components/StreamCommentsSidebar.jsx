// 📄 src/components/StreamCommentsSidebar.jsx

import React, { useEffect, useState } from 'react';
import { collection, addDoc, onSnapshot, orderBy, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function StreamCommentsSidebar({ streamId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');
  const [user] = useAuthState(auth);

  useEffect(() => {
    if (!streamId) return;
    const q = collection(db, 'streams', streamId, 'comments');
    const unsubscribe = onSnapshot(q, (snap) => {
      const sorted = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
      setComments(sorted);
    });
    return () => unsubscribe();
  }, [streamId]);

  const postComment = async () => {
    if (!user || !text.trim()) return;

    await addDoc(collection(db, 'streams', streamId, 'comments'), {
      text,
      userId: user.uid,
      username: user.email.split('@')[0],
      createdAt: serverTimestamp(),
    });

    setText('');
  };

  if (!streamId) return null;

  return (
    <div className="hidden lg:flex flex-col w-[320px] border-l bg-white p-4 space-y-2 h-screen fixed right-0 top-0">
      <h2 className="text-lg font-semibold mb-2">Comments</h2>

      <div className="flex-1 overflow-y-auto space-y-3">
        {comments.length === 0 && <p className="text-gray-500">No comments yet.</p>}
        {comments.map((c) => (
          <div key={c.id} className="bg-gray-100 p-2 rounded">
            <p className="text-sm font-semibold">@{c.username}</p>
            <p className="text-sm">{c.text}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 pt-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment"
          className="flex-1 border p-2 rounded text-sm"
        />
        <button
          onClick={postComment}
          className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
        >
          Post
        </button>
      </div>
    </div>
  );
}
