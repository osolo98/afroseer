// 📄 File: src/layout/BottomNavBar.jsx

import React from 'react';
import { NavLink } from 'react-router-dom';

const tabs = [
  { to: '/', label: 'Home', icon: '🏠' },
  { to: '/streams', label: 'Streams', icon: '🎥' },
  { to: '/messages', label: 'Messages', icon: '💬' },
  { to: '/wallet', label: 'Wallet', icon: '💰' },
  { to: '/profile', label: 'Profile', icon: '👤' },
];

export default function BottomNavBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-inner flex justify-around border-t lg:hidden z-50">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          className={({ isActive }) =>
            `flex flex-col items-center text-xs py-2 px-1 ${
              isActive ? 'text-blue-600 font-semibold' : 'text-gray-500'
            }`
          }
        >
          <span className="text-xl">{tab.icon}</span>
          <span>{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
