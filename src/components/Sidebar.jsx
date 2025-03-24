import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Search,
  Bell,
  MessageCircle,
  User,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar({ onLogout }) {
  const navItems = [
    { name: 'Home', icon: Home, path: '/', counter: 0 },
    { name: 'Search', icon: Search, path: '/search', counter: 0 },
    { name: 'Notifications', icon: Bell, path: '/notifications', counter: 3 },
    { name: 'Messages', icon: MessageCircle, path: '/messages', counter: 5 },
    { name: 'Profile', icon: User, path: '/profile', counter: 0 },
    { name: 'Settings', icon: Settings, path: '/settings', counter: 0 },
  ];

  return (
    <div className="hidden md:flex flex-col justify-between w-1/5 border-r border-gray-300 bg-white py-6 px-4 h-screen sticky top-0">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-blue-500 mb-8">Afroseer</h1>

        {navItems.map(({ name, icon: Icon, path, counter }) => (
          <NavLink
            key={name}
            to={path}
            className={({ isActive }) =>
              `flex items-center justify-between font-medium w-full py-3 px-4 rounded-full transition ${
                isActive
                  ? 'text-blue-500 bg-gray-100'
                  : 'text-gray-800 hover:text-blue-500 hover:bg-gray-100'
              }`
            }
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-4"
            >
              <Icon className="w-6 h-6" />
              <span>{name}</span>
            </motion.div>
            {counter > 0 && (
              <div className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                {counter}
              </div>
            )}
          </NavLink>
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
