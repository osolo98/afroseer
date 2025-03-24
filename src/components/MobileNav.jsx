import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Search,
  Bell,
  MessageCircle,
  User
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function MobileNav() {
  const navItems = [
    { name: 'Home', icon: Home, path: '/', counter: 0 },
    { name: 'Search', icon: Search, path: '/search', counter: 0 },
    { name: 'Notifications', icon: Bell, path: '/notifications', counter: 3 },
    { name: 'Messages', icon: MessageCircle, path: '/messages', counter: 5 },
    { name: 'Profile', icon: User, path: '/profile', counter: 0 },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 flex justify-around items-center h-16 md:hidden z-50">
      {navItems.map(({ name, icon: Icon, path, counter }) => (
        <NavLink
          key={name}
          to={path}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center transition ${
              isActive
                ? 'text-blue-500'
                : 'text-gray-800 hover:text-blue-500'
            }`
          }
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="relative"
          >
            <Icon className="w-6 h-6" />
            {counter > 0 && (
              <div className="absolute -top-1 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">
                {counter}
              </div>
            )}
          </motion.div>
          <span className="text-xs">{name}</span>
        </NavLink>
      ))}
    </nav>
  );
}
