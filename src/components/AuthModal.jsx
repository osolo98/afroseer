import React, { useState } from 'react';
import { useAuthModal } from '../context/AuthModalContext';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function AuthModal() {
  const { isOpen, setIsOpen } = useAuthModal();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const toggle = () => setIsLogin(!isLogin);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCred.user;
        const username = `user_${Date.now().toString(36)}`;
        await setDoc(doc(db, 'users', user.uid), {
          displayName,
          username,
          createdAt: serverTimestamp(),
          dmPermission: 'everyone',
          followers: [],
          following: []
        });
      }
      setIsOpen(false);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-md p-6 rounded shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">{isLogin ? 'Login' : 'Register'}</h2>

        {!isLogin && (
          <input
            type="text"
            placeholder="Display Name"
            className="w-full mb-2 p-2 border rounded"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-2 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full bg-blue-600 text-white py-2 rounded mb-2"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? 'Processing...' : isLogin ? 'Login' : 'Register'}
        </button>

        <p className="text-sm text-center">
          {isLogin ? 'New here?' : 'Already have an account?'}{' '}
          <button onClick={toggle} className="text-blue-600 underline">
            {isLogin ? 'Register' : 'Login'}
          </button>
        </p>

        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-3 text-gray-500 hover:text-black text-xl"
        >
          &times;
        </button>
      </div>
    </div>
  );
}
