import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  getDocs,
  doc,
  updateDoc
} from 'firebase/firestore';
import CommentSection from './CommentSection.jsx';

export default function Feed() {
  const [echoes, setEchoes] = useState([]);
  const [userProfiles, setUserProfiles] = useState({});

  // ✅ Fetch all user profiles once on component mount
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'users'));
        const profiles = {};
        querySnapshot.forEach(doc => {
          profiles[doc.id] = doc.data();
        });
        setUserProfiles(profiles);
      } catch (error) {
        console.error('Error fetching user profiles:', error);
      }
    };

    fetchProfiles();
  }, []);

  // ✅ Fetch echoes in real-time
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

  // ✅ Like handler
  const handleLike = async (echoId, currentLikes = []) => {
    const userId = auth.currentUser.uid; // ✅ Switch to UID, consistent with userId everywhere

    const hasLiked = currentLikes.includes(userId);
    const updatedLikes = hasLiked
      ? currentLikes.filter(id => id !== userId)
      : [...currentLikes, userId];

    const echoRef = doc(db, 'echoes', echoId);
    await updateDoc(echoRef, {
      likes: updatedLikes
    });
  };

  return (
    <div>
      <h2>Feed</h2>
      {echoes.length === 0 && <p>No echoes yet...</p>}

      {echoes.map(echo => {
        // Get the user's profile by echo.userId
        const authorProfile = userProfiles[echo.userId];

        return (
          <div key={echo.id} style={{
            border: '1px solid #ddd',
            padding: '10px',
            marginBottom: '10px',
            width: '300px'
          }}>
            {/* ✅ Display user name */}
            <p><strong>{authorProfile?.name || 'Unknown User'}</strong></p>

            {/* Echo content */}
            <p>{echo.text}</p>

            {/* Like button */}
            <button onClick={() => handleLike(echo.id, echo.likes || [])}>
              {echo.likes && echo.likes.includes(auth.currentUser.uid)
                ? '❤️ Liked'
                : '🤍 Like'}
            </button>

            <p>{echo.likes ? echo.likes.length : 0} likes</p>

            {/* Comment Section */}
            <CommentSection echoId={echo.id} />
          </div>
        );
      })}
    </div>
  );
}
