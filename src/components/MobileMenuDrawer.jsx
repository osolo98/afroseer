// 📄 src/components/MobileMenuDrawer.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { useAuthModal } from '../context/AuthModalContext';

export default function MobileMenuDrawer({ isOpen, onClose }) {
  const [user] = useAuthState(auth);
  const { setIsOpen, setRedirectPath } = useAuthModal();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    onClose();
    navigate('/');
  };

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
      onClose();
    } else {
      setRedirectPath('/profile');
      setIsOpen(true);
      onClose();
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black bg-opacity-40" onClick={onClose} />
      )}

      <div className={`fixed top-0 right-0 z-50 h-full w-64 bg-white shadow-lg transform transition-transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b">
          <h2 className="text-lg font-bold text-blue-600">Menu</h2>
        </div>

        <div className="flex flex-col p-4 space-y-3 text-gray-700">
          <button onClick={handleProfileClick} className="text-left hover:text-blue-600">👤 View Profile</button>
          <button onClick={() => { navigate('/settings'); onClose(); }} className="text-left hover:text-blue-600">⚙️ Settings</button>

          {user ? (
            <button onClick={handleLogout} className="text-left text-red-600 hover:underline">
              🔓 Logout
            </button>
          ) : (
            <button
              onClick={() => {
                setIsOpen(true);
                onClose();
              }}
              className="text-left text-blue-600 hover:underline"
            >
              🔐 Login / Register
            </button>
          )}
        </div>
      </div>
    </>
  );
}
