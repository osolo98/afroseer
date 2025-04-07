// 📄 File: src/screens/HomeScreen.jsx

import React, { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import PostCard from '../components/PostCard';
import CommentModal from '../components/CommentModal';
import AppLayout from '../layout/AppLayout';

export default function HomeScreen() {
  const [echoes, setEchoes] = useState([]);
  const [selectedEcho, setSelectedEcho] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'echoes'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snap) => {
      setEchoes(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, []);

  const handleLike = async (post) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return alert('Please log in first.');

    const ref = doc(db, 'echoes', post.id);
    const hasLiked = post.likes?.includes(userId);

    await updateDoc(ref, {
      likes: hasLiked ? arrayRemove(userId) : arrayUnion(userId),
    });
  };

  return (
    <AppLayout echoes={echoes}>
      <h1 className="text-xl font-semibold mb-4">Home</h1>

      {echoes.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onComment={() => {
            setSelectedEcho(post);
            setShowModal(true);
          }}
          onLike={() => handleLike(post)}
        />
      ))}

      <CommentModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        echo={selectedEcho}
      />
    </AppLayout>
  );
}
