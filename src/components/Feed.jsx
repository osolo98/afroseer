// src/components/Feed.js
import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function Feed() {
  const [echoes, setEchoes] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'echoes'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const echoesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEchoes(echoesData);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Feed</h2>
      {echoes.length === 0 && <p>No echoes yet...</p>}
      {echoes.map(echo => (
        <div key={echo.id} style={{
          border: '1px solid #ddd',
          padding: '10px',
          marginBottom: '10px',
          width: '300px'
        }}>
          <p><strong>{echo.user}</strong></p>
          <p>{echo.text}</p>
        </div>
      ))}
    </div>
  );
}
