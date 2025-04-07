import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useAuthModal } from '../context/AuthModalContext';

export default function StreamLeftSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [user] = useAuthState(auth);
  const { setIsOpen, setRedirectPath } = useAuthModal();

  const items = [
    { label: 'Streams', icon: '🎬', path: '/streams' },
    { label: 'My Videos', icon: '📂', path: '/streams/my' },
    { label: 'Analytics', icon: '📊', path: '/streams/analytics' },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-16 p-2 items-center justify-between fixed left-0 top-0 h-full border-r bg-black text-white z-10">
      {/* Top nav section */}
      <div className="space-y-6">
        {/* Echoes/Home icon */}
        <button
          onClick={() => navigate('/')}
          title="Back to Echoes"
          className="p-2 rounded hover:bg-white/10 transition text-gray-300"
        >
          <span className="text-2xl">🏠</span>
        </button>

        {/* Navigation icons */}
        {items.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            title={item.label}
            className={`p-2 rounded hover:bg-white/10 transition ${
              pathname === item.path ? 'text-pink-500' : 'text-gray-300'
            }`}
          >
            <span className="text-2xl">{item.icon}</span>
          </button>
        ))}
      </div>

      {/* Bottom login button with hover label */}
      {!user && (
        <button
          onClick={() => {
            setRedirectPath('/streams');
            setIsOpen(true);
          }}
          className="group relative flex flex-col items-center text-white hover:text-pink-400 hover:bg-white/10 p-2 rounded transition"
          title="Login / Register"
        >
          <span className="text-2xl">🔑</span>
          <span className="absolute -right-[110px] bg-white text-black text-xs px-2 py-1 rounded hidden group-hover:flex whitespace-nowrap">
            Login / Register
          </span>
        </button>
      )}
    </aside>
  );
}
