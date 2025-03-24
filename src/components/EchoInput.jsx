import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';

export default function EchoInput() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePostEcho = async () => {
    const user = auth.currentUser;

    if (!user) {
      alert('You must be logged in to post an echo!');
      return;
    }

    if (!text.trim()) {
      alert('Echo cannot be empty.');
      return;
    }

    setLoading(true);

    try {
      // ✅ Get user profile from Firestore
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      let displayName = 'Unnamed User';
      let username = 'unknown';

      if (userDocSnap.exists()) {
        const data = userDocSnap.data();
        displayName = data.displayName || user.displayName || 'Unnamed User';
        username = data.username || 'unknown';
      }

      // ✅ Add echo with full user info
      await addDoc(collection(db, 'echoes'), {
        text: text,
        userId: user.uid,
        displayName: displayName,
        username: username,
        createdAt: serverTimestamp(),
        likes: [],
        views: 0,
        commentsCount: 0
      });

      console.log('Echo posted!');
      setText('');
    } catch (error) {
      console.error('Error posting echo:', error);
      alert('Failed to post echo. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="p-4 bg-white border-b border-gray-300">
      <textarea
        className="w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        rows="3"
        placeholder="What's on your mind?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />

      <div className="flex justify-end mt-2">
        <button
          onClick={handlePostEcho}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition disabled:bg-blue-300"
        >
          {loading ? 'Posting...' : 'Post Echo'}
        </button>
      </div>
    </div>
  );
}
