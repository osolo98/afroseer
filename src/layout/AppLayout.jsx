// 📄 src/components/layout/AppLayout.jsx

import React, { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../firebase';
import { useAuthModal } from '../context/AuthModalContext';
import LeftSidebar from './LeftSidebar';
import RightSidebar from './RightSidebar';
import BottomNavBar from '../layout/BottomNavBar';
import FAB from '../components/FAB';
import CreatePostModal from '../components/CreatePostModal';
import AuthModal from '../components/AuthModal';
import MobileMenuDrawer from '../components/MobileMenuDrawer';
import logo from '../assets/logo.svg';
import { Bars3Icon } from '@heroicons/react/24/outline';


export default function AppLayout({ children, echoes = [] }) {
  const [user] = useAuthState(auth);
  const { setIsOpen } = useAuthModal();
  const [showModal, setShowModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const requireAuth = (callback) => {
    if (!user) {
      setIsOpen(true);
    } else {
      callback();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative flex-col">
      
      {/* ✅ Mobile top brand header with logo + menu */}
      <div className="lg:hidden sticky top-0 z-40 w-full bg-white border-b shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Afroseer Logo" className="h-6 w-6" />
            <h1 className="text-xl font-bold text-blue-600">Afroseer</h1>
          </div>
          <button onClick={() => setShowMenu(true)} className="text-gray-600">
            <Bars3Icon className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div className="flex flex-1">
        <LeftSidebar />
        <main className="flex-1 lg:ml-56 lg:mr-64 p-4 pb-24">{children}</main>
        <AuthModal />
        <MobileMenuDrawer isOpen={showMenu} onClose={() => setShowMenu(false)} />
        <div className="hidden lg:block fixed right-0 top-0 h-full w-64">
          <RightSidebar echoes={echoes} />
        </div>
        <BottomNavBar />
        <FAB onClick={() => requireAuth(() => setShowModal(true))} />
        <CreatePostModal isOpen={showModal} onClose={() => setShowModal(false)} />
      </div>
    </div>
  );
}
