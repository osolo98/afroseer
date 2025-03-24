import React, { useState } from 'react';
import './App.css';

import Auth from './components/Auth';
import EchoInput from './components/EchoInput';
import Feed from './components/Feed';
import Profile from './components/Profile.jsx';

import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function App() {
  const [user, loading] = useAuthState(auth);
  const [showProfile, setShowProfile] = useState(false);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="App" style={{ textAlign: 'center' }}>
      <h1>Afroseer MVP</h1>

      {/* If not logged in, show Auth */}
      {!user ? (
        <Auth />
      ) : (
        <>
          <button onClick={() => auth.signOut()}>Logout</button>

          {/* Toggle the Profile view */}
          <button onClick={() => setShowProfile(!showProfile)}>
            {showProfile ? 'Hide Profile' : 'View/Edit Profile'}
          </button>

          {/* Render Profile component and pass the current user's UID */}
          {showProfile && <Profile targetUserId={user.uid} />}

          {/* Main Echo Input and Feed */}
          <EchoInput />
          <Feed />
        </>
      )}
    </div>
  );
}

export default App;
