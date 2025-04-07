// 📄 src/components/StreamBottomNavBar.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useAuthModal } from '../context/AuthModalContext';

export default function StreamBottomNavBar({ openUploader }) {
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const { setIsOpen, setRedirectPath } = useAuthModal();

  const handleProtectedClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      setRedirectPath(path);
      setIsOpen(true);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-black text-white shadow-inner flex justify-around border-t border-gray-700 lg:hidden z-50">
      <button onClick={() => navigate('/')} className="flex flex-col items-center text-xs py-2 px-1">
        <span className="text-xl">🏠</span>
        <span>Home</span>
      </button>
      <button onClick={() => navigate('/streams')} className="flex flex-col items-center text-xs py-2 px-1">
        <span className="text-xl">🎬</span>
        <span>Streams</span>
      </button>
      <button onClick={openUploader} className="flex flex-col items-center text-xs py-2 px-1">
        <span className="text-xl">📷</span>
        <span>Upload</span>
      </button>
      <button onClick={() => handleProtectedClick('/profile')} className="flex flex-col items-center text-xs py-2 px-1">
        <span className="text-xl">👤</span>
        <span>Me</span>
      </button>
    </nav>
  );
}
