import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot } from 'firebase/firestore';

export default function CommentSection({ echoId }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  // Fetch comments in real-time
  useEffect(() => {
    const commentsRef = collection(db, 'echoes', echoId, 'comments');
    const q = query(commentsRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComments(commentsData);
    });

    return () => unsubscribe();
  }, [echoId]);

  // Handle adding a new comment
  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    const commentsRef = collection(db, 'echoes', echoId, 'comments');

    await addDoc(commentsRef, {
      text: commentText,
      user: auth.currentUser.email,
      createdAt: new Date()
    });

    setCommentText('');
  };

  return (
    <div style={{ marginTop: '10px' }}>
      <h4>Comments</h4>

      {/* Comment Input */}
      <textarea
        rows="2"
        placeholder="Add a comment..."
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        style={{ width: '90%' }}
      />
      <br />
      <button onClick={handleAddComment}>Post Comment</button>

      {/* List of Comments */}
      {comments.length === 0 && <p>No comments yet.</p>}
      {comments.map((comment) => (
        <div key={comment.id} style={{
          borderTop: '1px solid #ccc',
          paddingTop: '5px',
          marginTop: '5px'
        }}>
          <strong>{comment.user}</strong>
          <p>{comment.text}</p>
        </div>
      ))}
    </div>
  );
}
