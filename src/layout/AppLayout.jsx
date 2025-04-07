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

export default function AppLayout({ children, echoes = [] }) {
  const [user] = useAuthState(auth);
  const { setIsOpen } = useAuthModal();
  const [showModal, setShowModal] = useState(false);

  const requireAuth = (callback) => {
    if (!user) {
      setIsOpen(true);
    } else {
      callback();
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      <LeftSidebar />

      <main className="flex-1 lg:ml-56 lg:mr-64 p-4 pb-24">{children}</main>

      <AuthModal />

      <div className="hidden lg:block fixed right-0 top-0 h-full w-64">
        <RightSidebar echoes={echoes} />
      </div>

      <BottomNavBar />

      {/* FAB protected by requireAuth */}
      <FAB onClick={() => requireAuth(() => setShowModal(true))} />

      {/* Create Echo Modal */}
      <CreatePostModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </div>
  );
}
