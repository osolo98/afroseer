import React, { useRef, useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import StreamCommentsModal from './StreamCommentsModal';

export default function StreamCard({ stream }) {
  const videoRef = useRef(null);
  const { ref, inView } = useInView({ threshold: 0.8 });
  const [user] = useAuthState(auth);
  const [showComments, setShowComments] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    if (videoRef.current) {
      inView ? videoRef.current.play() : videoRef.current.pause();
    }
  }, [inView]);

  useEffect(() => {
    if (user && stream.likes?.includes(user.uid)) {
      setHasLiked(true);
    } else {
      setHasLiked(false);
    }
  }, [user, stream.likes]);

  const toggleLike = async () => {
    if (!user) return;
    const streamRef = doc(db, 'streams', stream.id);
    await updateDoc(streamRef, {
      likes: hasLiked ? arrayRemove(user.uid) : arrayUnion(user.uid),
    });
  };

  return (
    <div ref={ref} className="h-screen snap-start relative flex items-center justify-center bg-black">
      <video
        ref={videoRef}
        src={stream.videoUrl}
        controls={false}
        loop
        muted
        className="h-full w-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute bottom-16 left-4 text-white text-sm">
        <p className="font-semibold">@{stream.username}</p>
        <p>{stream.caption}</p>
      </div>

      {/* Action buttons */}
      <div className="absolute bottom-16 right-4 space-y-4 text-white text-center">
        <button onClick={toggleLike}>
          <div className="text-2xl">{hasLiked ? '❤️' : '🤍'}</div>
          <div className="text-sm">{stream.likes?.length || 0}</div>
        </button>
        <button onClick={() => setShowComments(true)}>
          <div className="text-2xl">💬</div>
          <div className="text-sm">{stream.commentsCount || 0}</div>
        </button>
        <button onClick={() => navigator.clipboard.writeText(window.location.href)}>
          <div className="text-2xl">🔗</div>
        </button>
      </div>

      {/* Comments Modal */}
      {showComments && (
        <StreamCommentsModal
          streamId={stream.id}
          onClose={() => setShowComments(false)}
        />
      )}
    </div>
  );
}
