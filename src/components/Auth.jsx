import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import {
  setDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const isRegisterMode = location.pathname.includes('register');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const [username, setUsername] = useState('');
  const [registered, setRegistered] = useState(false);

  // Generate username from display name
  const generateUsername = (name) => {
    const base = name.trim().toLowerCase().replace(/\s+/g, '');
    const random = Math.floor(100 + Math.random() * 900); // 3-digit number
    return `${base}${random}`;
  };

  const handleRegister = async () => {
    if (!displayName || !email || !password) {
      alert('All fields are required!');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const generatedUsername = generateUsername(displayName);
      setUsername(generatedUsername); // store for display

      await setDoc(doc(db, 'users', user.uid), {
        displayName: displayName.trim(),
        username: generatedUsername,
        email: user.email,
        createdAt: serverTimestamp()
      });

      console.log('Registered successfully!');
      setRegistered(true); // show success
      setTimeout(() => navigate('/'), 2000); // redirect after 2 seconds
    } catch (error) {
      console.error('Registration error:', error);
      alert(error.message);
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Please enter email and password.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('Login successful!');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        {isRegisterMode ? 'Register' : 'Login'}
      </h2>

      {isRegisterMode && !registered && (
        <input
          className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      )}

      <input
        className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        className="w-full mb-5 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {isRegisterMode ? (
        registered ? (
          <div className="text-center">
            <p className="text-green-600 font-medium mb-2">🎉 Registered successfully!</p>
            <p className="text-gray-700">Your username is:</p>
            <p className="font-bold text-lg text-blue-600">@{username}</p>
            <p className="text-sm mt-2 text-gray-500">Redirecting to home...</p>
          </div>
        ) : (
          <button
            onClick={handleRegister}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition"
          >
            Register
          </button>
        )
      ) : (
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition"
        >
          Login
        </button>
      )}

      <p className="text-center mt-4 text-sm">
        {isRegisterMode ? (
          <>
            Already have an account?{' '}
            <button
              onClick={() => navigate('/auth/login')}
              className="text-blue-500 hover:underline"
            >
              Login
            </button>
          </>
        ) : (
          <>
            Don’t have an account?{' '}
            <button
              onClick={() => navigate('/auth/register')}
              className="text-blue-500 hover:underline"
            >
              Register
            </button>
          </>
        )}
      </p>
    </div>
  );
}
