import React from 'react';
import {
  Home,
  Search,
  Bell,
  MessageCircle,
  User,
  Settings
} from 'lucide-react';

export default function Sidebar({ onProfileClick, onLogout }) {
  const navItems = [
    { name: 'Home', icon: Home, onClick: () => console.log('Go to Home') },
    { name: 'Search', icon: Search, onClick: () => console.log('Go to Search') },
    { name: 'Notifications', icon: Bell, onClick: () => console.log('Go to Notifications') },
    { name: 'Messages', icon: MessageCircle, onClick: () => console.log('Go to Messages') },
    { name: 'Profile', icon: User, onClick: onProfileClick },
    { name: 'Settings', icon: Settings, onClick: () => console.log('Go to Settings') }
  ];

  return (
    <div className="hidden md:flex flex-col justify-between w-1/5 border-r border-gray-300 bg-white py-6 px-4 h-screen sticky top-0">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-blue-500 mb-8">Afroseer</h1>

        {navItems.map(({ name, icon: Icon, onClick }) => (
          <button
            key={name}
            onClick={onClick}
            className="flex items-center space-x-4 text-gray-800 hover:text-blue-500 font-medium w-full py-3 px-4 rounded-full hover:bg-gray-100 transition"
          >
            <Icon className="w-6 h-6" />
            <span>{name}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onLogout}
        className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition"
      >
        Logout
      </button>
    </div>
  );
}
