import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc,
  doc
} from 'firebase/firestore';
import CommentSection from './CommentSection.jsx';

export default function Feed() {
  const [echoes, setEchoes] = useState([]);
  const [sortOption, setSortOption] = useState('createdAt');
  const [loading, setLoading] = useState(true);

  // Fetch echoes with selected sort option
  useEffect(() => {
    setLoading(true);
    const echoesRef = collection(db, 'echoes');
    const q = query(echoesRef, orderBy(sortOption, 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const echoesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEchoes(echoesData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sortOption]);

  const handleLike = async (echoId, currentLikes = []) => {
    if (!auth.currentUser) {
      alert('You must be logged in to like an echo!');
      return;
    }

    const userId = auth.currentUser.uid;
    const hasLiked = currentLikes.includes(userId);

    const updatedLikes = hasLiked
      ? currentLikes.filter(id => id !== userId)
      : [...currentLikes, userId];

    const echoRef = doc(db, 'echoes', echoId);
    await updateDoc(echoRef, { likes: updatedLikes });
  };

  const handleEchoView = async (echoId, views = 0) => {
    const echoRef = doc(db, 'echoes', echoId);
    await updateDoc(echoRef, {
      views: views + 1
    });
  };

  if (loading) {
    return <p className="text-center py-6 text-gray-500">Loading echoes...</p>;
  }

  return (
    <div>
      {/* Sort Buttons */}
      <div className="flex space-x-4 p-4 border-b bg-white sticky top-0 z-10">
        <button
          onClick={() => setSortOption('createdAt')}
          className={`font-medium ${sortOption === 'createdAt' ? 'text-blue-500' : 'text-gray-600'}`}
        >
          Newest
        </button>
        <button
          onClick={() => setSortOption('views')}
          className={`font-medium ${sortOption === 'views' ? 'text-blue-500' : 'text-gray-600'}`}
        >
          Most Viewed
        </button>
        <button
          onClick={() => setSortOption('commentsCount')}
          className={`font-medium ${sortOption === 'commentsCount' ? 'text-blue-500' : 'text-gray-600'}`}
        >
          Most Commented
        </button>
      </div>

      {echoes.length === 0 ? (
        <p className="text-center py-6 text-gray-500">No echoes found.</p>
      ) : (
        echoes.map((echo) => {
          const timestamp = echo.createdAt
            ? new Date(echo.createdAt.seconds * 1000).toLocaleString()
            : 'Unknown time';

          return (
            <div
              key={echo.id}
              className="border-b border-gray-300 bg-white hover:bg-gray-50 transition duration-200 p-4 flex space-x-3"
              onClick={() => handleEchoView(echo.id, echo.views || 0)} // Increment views on click (optional)
            >
              {/* Avatar Placeholder */}
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gray-300"></div>
              </div>

              <div className="flex-1">
              <div className="flex justify-between items-center text-sm">
              <p>
                <span className="font-bold text-gray-900">{echo.displayName || 'Unknown User'}</span>
                <span className="text-gray-500 ml-2">@{echo.username || 'unknown'}</span>
                <span className="text-gray-400 mx-2">·</span>
                <span className="text-gray-400">{timestamp}</span>
              </p>
            </div>


                <p className="text-gray-800 mt-1 mb-3">{echo.text}</p>

                <div className="flex space-x-6 text-gray-500 text-sm">
                  {/* Likes */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(echo.id, echo.likes || []);
                    }}
                    className="hover:text-blue-500 flex items-center space-x-1"
                  >
                    <span>{echo.likes && auth.currentUser && echo.likes.includes(auth.currentUser.uid) ? '❤️' : '🤍'}</span>
                    <span>{echo.likes ? echo.likes.length : 0}</span>
                  </button>

                  {/* Views */}
                  <div className="flex items-center space-x-1">
                    <span>👀</span>
                    <span>{echo.views || 0}</span>
                  </div>

                  {/* Comments */}
                  <div className="flex items-center space-x-1">
                    <span>💬</span>
                    <span>{echo.commentsCount || 0}</span>
                  </div>
                </div>

                {/* Comment Section (Login Required) */}
                {auth.currentUser ? (
                  <div className="mt-3">
                    <CommentSection echoId={echo.id} />
                  </div>
                ) : (
                  <p className="mt-3 text-xs text-gray-400">Log in to comment</p>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
