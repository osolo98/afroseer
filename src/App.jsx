import React from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase';

import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import Feed from './components/Feed';
import EchoInput from './components/EchoInput';
import Profile from './components/Profile';
import MessagesPage from './pages/MessagesPage';
import Auth from './components/Auth';

export default function App() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-xl text-gray-600">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 text-gray-800">
      {/* ✅ Sidebar shows for both guests and logged in users */}
      <Sidebar user={user} onLogout={handleLogout} />

      <main className="w-full md:w-3/5 border-x border-gray-300 bg-white min-h-screen">
        <Routes>
          {/* ✅ Public homepage */}
          <Route path="/" element={
            <>
              {user && <EchoInput />}
              <Feed />
            </>
          } />

           {/* ✅ Block access to /auth if already logged in */}
           <Route path="/auth/:mode" element={
            user ? <Navigate to="/" /> : <Auth />
          } /> 

       

          {/* ✅ Protected pages */}
          {user && (
            <>
              <Route path="/profile" element={<Profile targetUserId={user.uid} />} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/settings" element={<div className="p-6">Settings Page</div>} />
              <Route path="/notifications" element={<div className="p-6">Notifications Page</div>} />
            </>
          )}

          {/* Optional fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      {/* ✅ MobileNav (show only when logged in) */}
      {user && <MobileNav />}
    </div>
  );
}
