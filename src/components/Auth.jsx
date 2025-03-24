import React, { useState } from 'react';
import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    try {
      if (isCreatingAccount) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white shadow-lg rounded-lg p-8 w-full max-w-sm mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-500">
        {isCreatingAccount ? 'Create Account' : 'Login to Afroseer'}
      </h2>

      {error && (
        <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
      )}

      <input
        type="email"
        placeholder="Email"
        className="mb-4 w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Password"
        className="mb-4 w-full px-4 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button
        onClick={handleAuth}
        className="w-full py-3 mb-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded transition"
      >
        {isCreatingAccount ? 'Create Account' : 'Login'}
      </button>

      <p className="text-sm text-gray-600">
        {isCreatingAccount
          ? 'Already have an account?'
          : "Don't have an account?"}{' '}
        <button
          onClick={() => {
            setIsCreatingAccount(!isCreatingAccount);
            setError('');
          }}
          className="text-blue-500 font-medium ml-1"
        >
          {isCreatingAccount ? 'Login' : 'Sign up'}
        </button>
      </p>
    </div>
  );
}
