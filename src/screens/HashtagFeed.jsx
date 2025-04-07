// 📄 File: src/screens/HashtagFeed.jsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import PostCard from '../components/PostCard';

export default function HashtagFeed() {
  const { tag } = useParams();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const load = async () => {
      const snap = await getDocs(collection(db, 'echoes'));
      const filtered = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((p) => p.text.includes(`#${tag}`));
      setPosts(filtered);
    };
    load();
  }, [tag]);

  return (
    <div className="p-4 pb-24">
      <h1 className="text-xl font-semibold mb-4">#{tag}</h1>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
