import React from 'react';
import './App.css';

import Auth from './components/Auth';
import EchoInput from './components/EchoInput';
import Feed from './components/Feed';
import { auth } from './firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

function App() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="App" style={{ textAlign: 'center' }}>
      <h1>Afroseer MVP</h1>

      {!user ? (
        <Auth />
      ) : (
        <>
          <button onClick={() => auth.signOut()}>Logout</button>
          <EchoInput />
          <Feed />
        </>
      )}
    </div>
  );
}

export default App;
