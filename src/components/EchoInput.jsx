import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function EchoInput() {
  const [text, setText] = useState('');

  const handlePost = async () => {
    if (!text.trim()) return;

    await addDoc(collection(db, 'echoes'), {
      text,
      userId: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      likes: []
    });

    setText('');
  };

  return (
    <div className="p-4 border-b border-gray-300 bg-white">
      <div className="flex space-x-4">
        {/* Avatar Placeholder */}
        <div className="h-12 w-12 rounded-full bg-gray-300"></div>

        <textarea
          className="flex-1 focus:outline-none focus:ring-0 resize-none text-lg text-gray-800"
          placeholder="What's happening?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex justify-end mt-3">
        <button
          onClick={handlePost}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-full"
        >
          Echo
        </button>
      </div>
    </div>
  );
}
