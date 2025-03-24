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

  useEffect(() => {
    const fetchProfiles = async () => {
      const querySnapshot = await getDocs(collection(db, 'users'));
      const profiles = {};
      querySnapshot.forEach(doc => {
        profiles[doc.id] = doc.data();
      });
      setUserProfiles(profiles);
    };

    fetchProfiles();
  }, []);

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

  const handleLike = async (echoId, currentLikes = []) => {
    const userId = auth.currentUser.uid;
    const hasLiked = currentLikes.includes(userId);

    const updatedLikes = hasLiked
      ? currentLikes.filter(id => id !== userId)
      : [...currentLikes, userId];

    const echoRef = doc(db, 'echoes', echoId);
    await updateDoc(echoRef, { likes: updatedLikes });
  };

  return (
    <div>
      {echoes.map(echo => {
        const authorProfile = userProfiles[echo.userId];

        return (
          <div
            key={echo.id}
            className="border-b border-gray-300 bg-white hover:bg-gray-50 transition duration-200 p-4 flex space-x-3"
          >
            {/* Avatar Placeholder */}
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-gray-300"></div>
            </div>

            <div className="flex-1">
              <div className="flex justify-between items-center">
                <p className="font-bold">{authorProfile?.name || 'Unknown User'}</p>
              </div>

              <p className="text-gray-800 mt-1 mb-3">{echo.text}</p>

              <div className="flex space-x-6 text-gray-500 text-sm">
                <button
                  onClick={() => handleLike(echo.id, echo.likes || [])}
                  className="hover:text-blue-500 flex items-center space-x-1"
                >
                  <span>{echo.likes && echo.likes.includes(auth.currentUser.uid) ? '❤️' : '🤍'}</span>
                  <span>{echo.likes ? echo.likes.length : 0}</span>
                </button>
              </div>

              {/* Comments Section */}
              <div className="mt-3">
                <CommentSection echoId={echo.id} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
