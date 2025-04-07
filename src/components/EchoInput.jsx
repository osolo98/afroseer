// 📄 src/components/EchoInput.jsx
import React, { useState } from 'react';
import { auth, db } from '../firebase';
import {
  collection,
  addDoc,
  serverTimestamp,
  getDoc,
  doc
} from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import AuthGuard from './AuthGuard';

export default function EchoInput() {
  const [text, setText] = useState('');
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(false);

  const handlePost = async () => {
    if (!user || !text.trim()) return;

    setLoading(true);

    try {
      // 🔍 Get the user's displayName and username
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        console.error('User profile not found!');
        setLoading(false);
        return;
      }

      const { displayName, username } = userSnap.data();

      await addDoc(collection(db, 'echoes'), {
        text,
        createdAt: serverTimestamp(),
        userId: user.uid,
        displayName,
        username,
        type: 'echo', // important if you're also planning "voice" types later
        likes: [],
        views: 0,
        commentsCount: 0
      });

      setText('');
    } catch (err) {
      console.error('Error posting echo:', err.message);
    }

    setLoading(false);
  };

  return (
    <AuthGuard>
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm mb-4">
        <textarea
          className="w-full resize-none border-none outline-none text-sm"
          placeholder="What's happening?"
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="flex justify-end mt-2">
          <button
            onClick={handlePost}
            disabled={!text.trim() || loading}
            className="bg-blue-600 text-white px-4 py-1.5 text-sm rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}
