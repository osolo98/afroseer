// src/components/Auth.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';


export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      let userCredential;
  
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
  
      // Create profile if it's their first time
      await createUserProfile(userCredential.user);
  
    } catch (err) {
      setError(err.message);
    }
  };
  

  const createUserProfile = async (user) => {
    const userRef = doc(db, 'users', user.uid);
  
    const userSnap = await getDoc(userRef);
  
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        name: user.email.split('@')[0], // default name
        bio: 'Hello! I am new here.',
        followers: [],
        following: []
      });
    }
  };
   

  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <br />
        <input
          type="password"
          placeholder="Password (6+ characters)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <br />
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>

      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Sign Up' : 'Have an account? Login'}
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}
