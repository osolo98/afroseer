import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Auth from './components/Auth';
import EchoInput from './components/EchoInput';
import Feed from './components/Feed';
import Profile from './components/Profile';
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import MessagesPage from './components/MessagesPage'; // optional, shown later
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-xl text-gray-600">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 text-gray-800">
      <Sidebar onLogout={() => auth.signOut()} />

      <main className="w-full md:w-3/5 border-x border-gray-300 bg-white min-h-screen">
        <Routes>
          {user ? (
            <>
              <Route path="/" element={<>
                <EchoInput />
                <Feed />
              </>} />
              <Route path="/search" element={<div className="p-6">Search Page</div>} />
              <Route path="/notifications" element={<div className="p-6">Notifications Page</div>} />
              <Route path="/messages" element={<MessagesPage />} />
              <Route path="/profile" element={<Profile targetUserId={user.uid} />} />
              <Route path="/settings" element={<div className="p-6">Settings Page</div>} />
            </>
          ) : (
            <Route path="*" element={<Auth />} />
          )}
        </Routes>
      </main>

      <aside className="hidden lg:flex flex-col w-1/5 p-6 bg-white">
        <h2 className="text-lg font-bold mb-4">What's Happening</h2>
        <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
          Trending topics coming soon!
        </div>
      </aside>

      <MobileNav />
    </div>
  );
}
