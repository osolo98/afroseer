import React from 'react';
import './App.css';

import Auth from './components/Auth';
import EchoInput from './components/EchoInput';
import Feed from './components/Feed';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Profile from './components/Profile.jsx';


function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <h2>Loading...</h2>;
  const [showProfile, setShowProfile] = useState(false);


  return (
    <div className="App" style={{ textAlign: 'center' }}>
      <h1>Afroseer MVP</h1>

      {!user ? (
        <Auth />
      ) : (
        <>
          <button onClick={() => auth.signOut()}>Logout</button>
          <button onClick={() => setShowProfile(!showProfile)}>
          {showProfile ? 'Hide Profile' : 'View/Edit Profile'}
        </button>

        {showProfile && <Profile />}

          <EchoInput />
          <Feed />
        </>
      )}
    </div>
  );
}

export default App;
