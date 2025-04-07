// 📄 src/layout/BottomNavBar.jsx

import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useAuthModal } from '../context/AuthModalContext';

export default function BottomNavBar() {
  const [user] = useAuthState(auth);
  const { setIsOpen, setRedirectPath } = useAuthModal();
  const navigate = useNavigate();

  const handleProtectedClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      setRedirectPath(path);
      setIsOpen(true);
    }
  };

  const handleProfileClick = () => handleProtectedClick('/profile');

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-inner flex justify-around border-t lg:hidden z-50">
      <NavLink to="/" className="flex flex-col items-center text-xs py-2 px-1">
        <span className="text-xl">🏠</span>
        <span>Home</span>
      </NavLink>
      <NavLink to="/streams" className="flex flex-col items-center text-xs py-2 px-1">
        <span className="text-xl">🎥</span>
        <span>Streams</span>
      </NavLink>
      <button onClick={() => handleProtectedClick('/messages')} className="flex flex-col items-center text-xs py-2 px-1 text-gray-500">
        <span className="text-xl">💬</span>
        <span>Messages</span>
      </button>
      <button onClick={() => handleProtectedClick('/wallet')} className="flex flex-col items-center text-xs py-2 px-1 text-gray-500">
        <span className="text-xl">💰</span>
        <span>Wallet</span>
      </button>
      <button onClick={handleProfileClick} className="flex flex-col items-center text-xs py-2 px-1 text-gray-500">
        <span className="text-xl">👤</span>
        <span>Profile</span>
      </button>
    </nav>
  );
}
