// 📄 File: src/components/CommentModal.jsx

import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db, auth } from '../firebase';
import { formatDistanceToNow } from 'date-fns'; // ⬅️ install via npm if needed
import AuthGuard from './AuthGuard';

export default function CommentModal({ isOpen, onClose, echo }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (!echo) return;

    const q = query(
      collection(db, 'echoes', echo.id, 'comments'),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, (snap) => {
      setComments(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [echo]);

  const handleComment = async () => {
    if (!text.trim()) return;

    const user = auth.currentUser;

    await addDoc(collection(db, 'echoes', echo.id, 'comments'), {
      userId: user.uid,
      username: user.displayName || 'unknown',
      displayName: user.displayName || 'Unnamed User',
      text: text.trim(),
      createdAt: serverTimestamp(),
    });

    setText('');
  };

  const parseHashtags = (txt) =>
    txt.split(' ').map((word, i) =>
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
    );

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <Dialog.Panel className="bg-white w-full max-w-md p-6 rounded-lg shadow max-h-[90vh] overflow-y-auto">
        {/* Echo at the top */}
        {echo && (
          <div className="mb-6 border-b pb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />
              <div>
                <p className="font-semibold">{echo.displayName || 'User'}</p>
                <p className="text-xs text-gray-500 mb-1">@{echo.username}</p>
                <p className="text-sm text-gray-800 leading-relaxed">{parseHashtags(echo.text)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Comments */}
        <div className="space-y-5 mb-6">
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-3 border-b pb-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{c.displayName}</p>
                  <p className="text-xs text-gray-500">
                    {c.createdAt?.toDate
                      ? formatDistanceToNow(c.createdAt.toDate(), { addSuffix: true })
                      : 'Just now'}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mb-1">@{c.username}</p>
                <p className="text-sm text-gray-800">{parseHashtags(c.text)}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reply box */}
        <div className="flex items-end gap-3 mt-4">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />
          <div className="flex-1">
          <AuthGuard>
            <textarea
              rows={2}
              className="w-full border rounded p-2 text-sm resize-none"
              placeholder="Reply to this echo..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <button
              onClick={handleComment}
              className="mt-2 bg-blue-600 text-white px-4 py-1 rounded text-sm"
            >
              Reply
            </button>
            </AuthGuard>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
}
