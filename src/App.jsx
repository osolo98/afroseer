import React, { useState } from 'react';
//import './App.css'; // Optional, if you have Tailwind already handling styles
import Auth from './components/Auth';
import EchoInput from './components/EchoInput';
import Feed from './components/Feed';
import Profile from './components/Profile';
import Sidebar from './components/Sidebar'; // New Sidebar with icons
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function App() {
  const [user, loading] = useAuthState(auth);
  const [showProfile, setShowProfile] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h2 className="text-xl text-gray-600">Loading...</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 text-gray-800">
      {/* Sidebar Navigation */}
      <Sidebar
        onProfileClick={() => setShowProfile(!showProfile)}
        onLogout={() => auth.signOut()}
      />

      {/* Center Feed Column */}
      <main className="w-full md:w-3/5 border-x border-gray-300 bg-white min-h-screen">
        <header className="bg-white sticky top-0 z-10 border-b border-gray-300 p-4 flex justify-center items-center">
          <h2 className="text-xl font-bold">Home</h2>
        </header>

        {user ? (
          <>
            {showProfile && (
              <Profile
                targetUserId={user.uid}
              />
            )}
            <EchoInput />
            <Feed />
          </>
        ) : (
          <div className="flex justify-center items-center h-screen">
            <Auth />
          </div>
        )}
      </main>

      {/* Right Sidebar (optional future features: trends, suggestions) */}
      <aside className="hidden lg:flex flex-col w-1/5 p-6 bg-white">
        <h2 className="text-lg font-bold mb-4">What's Happening</h2>
        <div className="bg-gray-100 rounded-lg p-4 text-sm text-gray-600">
          Trending topics coming soon!
        </div>
      </aside>
    </div>
  );
}
