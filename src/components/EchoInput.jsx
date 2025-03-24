// src/components/EchoInput.js
import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function EchoInput() {
  const [text, setText] = useState('');

  const handleEcho = async () => {
    if (!text) return alert('Echo cannot be empty!');

    try {
      await addDoc(collection(db, 'echoes'), {
        text,
        user: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        likes: [] //initializing likes array
      });
      setText('');
    } catch (err) {
      console.error('Error adding echo:', err);
    }
  };

  return (
    <div style={{ margin: '20px 0' }}>
      <textarea
        rows="3"
        placeholder="What's happening?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        style={{ width: '300px' }}
      />
      <br />
      <button onClick={handleEcho}>Echo</button>
    </div>
  );
}
