// 📄 src/components/layout/LeftSidebar.jsx

import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  HomeIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  WalletIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  UserIcon,
  BellIcon,
  LockClosedIcon,
} from '@heroicons/react/24/outline';

import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAuthModal } from '../context/AuthModalContext';
import { doc, getDoc } from 'firebase/firestore';

export default function LeftSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [user] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { setIsOpen, setRedirectPath } = useAuthModal();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
    } else {
      setRedirectPath('/profile');
      setIsOpen(true);
    }
  };

  const handleProtectedClick = (path) => {
    if (user) {
      navigate(path);
    } else {
      setRedirectPath(path);
      setIsOpen(true);
    }
  };

  const nav = [
    { label: 'Home', path: '/', icon: <HomeIcon className="h-5 w-5" />, protected: false },
    { label: 'Streams', path: '/streams', icon: <VideoCameraIcon className="h-5 w-5" />, protected: false },
    { label: 'Messages', path: '/messages', icon: <ChatBubbleLeftRightIcon className="h-5 w-5" />, protected: true },
    { label: 'Wallet', path: '/wallet', icon: <WalletIcon className="h-5 w-5" />, protected: true },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-56 p-4 space-y-4 fixed left-0 top-0 h-full border-r bg-white">
      <h1 className="text-2xl font-bold text-blue-600 mb-4">Afroseer</h1>

      {/* Profile summary (clickable) */}
      {user && userData && (
        <button
          onClick={handleProfileClick}
          className="flex items-center space-x-3 mb-2 p-2 rounded hover:bg-gray-100 transition text-left"
        >
          <img
            src={userData.avatar || 'https://placehold.co/40x40?text=👤'}
            alt="avatar"
            className="h-10 w-10 rounded-full object-cover border"
          />
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900 leading-tight">
              {userData.displayName || 'Unnamed User'}
            </p>
            <p className="text-xs text-gray-500 leading-tight">
              @{userData.username || 'user'}
            </p>
          </div>
        </button>
      )}

      {/* Nav links */}
      {nav.map((item) =>
        item.protected ? (
          <button
            key={item.path}
            onClick={() => handleProtectedClick(item.path)}
            className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-100 w-full text-left ${
              pathname === item.path ? 'font-semibold text-blue-600' : 'text-gray-700'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ) : (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-100 ${
              pathname === item.path ? 'font-semibold text-blue-600' : 'text-gray-700'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        )
      )}

      {/* Profile button (protected) */}
      <button
        onClick={handleProfileClick}
        className={`flex items-center space-x-2 p-2 rounded hover:bg-gray-100 ${
          pathname === '/profile' ? 'font-semibold text-blue-600' : 'text-gray-700'
        }`}
      >
        <UserCircleIcon className="h-5 w-5" />
        <span>Profile</span>
      </button>

      {/* Settings dropdown */}
      <div className="mt-6">
        <button
          onClick={() => setSettingsOpen(!settingsOpen)}
          className="flex items-center justify-between w-full p-2 rounded hover:bg-gray-100 text-gray-700"
        >
          <span className="flex items-center gap-2">
            <Cog6ToothIcon className="h-5 w-5" /> Settings
          </span>
          <span>{settingsOpen ? '▾' : '▸'}</span>
        </button>

        {settingsOpen && (
          <div className="ml-6 mt-2 space-y-2 text-sm text-gray-600">
            <button
              onClick={() => handleProtectedClick('/settings/account')}
              className={`flex items-center gap-2 p-1 rounded hover:text-blue-600 ${
                pathname === '/settings/account' ? 'text-blue-600 font-medium' : ''
              }`}
            >
              <UserIcon className="h-4 w-4" /> Account
            </button>
            <button
              onClick={() => handleProtectedClick('/settings/notifications')}
              className={`flex items-center gap-2 p-1 rounded hover:text-blue-600 ${
                pathname === '/settings/notifications' ? 'text-blue-600 font-medium' : ''
              }`}
            >
              <BellIcon className="h-4 w-4" /> Notifications
            </button>
            <button
              onClick={() => handleProtectedClick('/settings/privacy')}
              className={`flex items-center gap-2 p-1 rounded hover:text-blue-600 ${
                pathname === '/settings/privacy' ? 'text-blue-600 font-medium' : ''
              }`}
            >
              <LockClosedIcon className="h-4 w-4" /> Privacy
            </button>
          </div>
        )}
      </div>

      {/* Login/Logout */}
      <div className="mt-auto pt-4 border-t">
        {user ? (
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        ) : (
          <button
            onClick={() => setIsOpen(true)}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login / Register
          </button>
        )}
      </div>
    </aside>
  );
}
