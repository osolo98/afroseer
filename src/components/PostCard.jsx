// 📄 src/components/PostCard.jsx

import React from 'react';
import { auth } from '../firebase';
import { formatDistanceToNow } from 'date-fns';

export default function PostCard({ post, onComment, onLike }) {
  const timestamp = post.createdAt?.toDate
    ? formatDistanceToNow(post.createdAt.toDate(), { addSuffix: true })
    : 'Just now';

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-4">
      {/* Header: Avatar + Name/Username/Time */}
      <div className="flex items-start gap-3 mb-2">
        <img
          src={post.avatar || 'https://placehold.co/40x40?text=👤'}
          alt="Avatar"
          className="h-10 w-10 rounded-full object-cover border flex-shrink-0"
        />
        <div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="font-semibold text-black">
              {post.displayName || 'Unnamed User'}
            </span>
            <span
              onClick={() => window.location.href = `/profile/${post.userId}`}
              className="text-gray-500 cursor-pointer hover:underline"
            >
              @{post.username || 'unknown'}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-400 text-xs">{timestamp}</span>
          </div>
        </div>
      </div>

      {/* Post Text with Hashtag Parsing */}
      <p className="text-gray-800 mb-3 whitespace-pre-line">
        {post.text?.split(' ').map((word, i) =>
          word.startsWith('#') ? (
            <span
              key={i}
              onClick={() => window.location.href = `/hashtag/${word.slice(1)}`}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              {word + ' '}
            </span>
          ) : (
            word + ' '
          )
        )}
      </p>

      {/* Media Content */}
      {post.mediaUrl && post.mediaType === 'image' && (
        <div className="w-full aspect-video overflow-hidden rounded-lg mb-3">
          <img
            src={post.mediaUrl}
            alt="Echo media"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {post.mediaUrl && post.mediaType === 'video' && (
        <video
          src={post.mediaUrl}
          controls
          className="w-full rounded-lg mb-3 max-h-[500px] object-contain"
        />
      )}

      {/* Engagement Bar */}
      <div className="flex text-sm text-gray-500 space-x-6">
        <button onClick={onLike} className="hover:text-red-500">
          {post.likes?.includes(auth.currentUser?.uid) ? '❤️' : '🤍'} {post.likes?.length || 0}
        </button>
        <button onClick={onComment}>💬 {post.commentsCount || 0}</button>
        <div>👀 {post.views || 0}</div>
      </div>
    </div>
  );
}
