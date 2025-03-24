import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  Bell,
  MessageCircle,
  User,
  Settings,
  LogIn,
  UserPlus
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', icon: Home, path: '/' },
    { name: 'Search', icon: Search, path: '/search' },
  ];

  const userNavItems = [
    { name: 'Notifications', icon: Bell, path: '/notifications' },
    { name: 'Messages', icon: MessageCircle, path: '/messages' },
    { name: 'Profile', icon: User, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' }
  ];

  return (
    <div className="hidden md:flex flex-col justify-between w-1/5 border-r border-gray-300 bg-white py-6 px-4 h-screen sticky top-0">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-blue-500 mb-8">Afroseer</h1>

        {navItems.map(({ name, icon: Icon, path }) => (
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
          </NavLink>
        ))}

        {user && userNavItems.map(({ name, icon: Icon, path }) => (
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
          </NavLink>
        ))}
      </div>

      {/* Bottom action buttons */}
      {user ? (
        <button
          onClick={onLogout}
          className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition"
        >
          Logout
        </button>
      ) : (
        <div className="space-y-2">
          <button
            onClick={() => navigate('/auth/login')}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition flex items-center justify-center space-x-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Login</span>
          </button>

          <button
            onClick={() => navigate('/auth/register')}
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition flex items-center justify-center space-x-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register</span>
          </button>
        </div>
      )}
    </div>
  );
}
