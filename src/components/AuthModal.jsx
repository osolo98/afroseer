// 📄 src/components/AuthModal.jsx

import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { auth, db } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthModal } from '../context/AuthModalContext';
import { useNavigate } from 'react-router-dom';

export default function AuthModal() {
  const { isOpen, setIsOpen, redirectPath, setRedirectPath } = useAuthModal();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async () => {
    setLoading(true);
    try {
      let userCred;
      if (isRegister) {
        userCred = await createUserWithEmailAndPassword(auth, email, password);

        const defaultUsername = 'user' + Math.floor(Math.random() * 10000);
        await setDoc(doc(db, 'users', userCred.user.uid), {
          displayName: 'New User',
          username: defaultUsername,
          avatar: '',
          createdAt: serverTimestamp(),
        });
      } else {
        userCred = await signInWithEmailAndPassword(auth, email, password);
      }

      // ✅ Close modal and redirect
      setIsOpen(false);
      navigate(redirectPath || '/profile');
      setRedirectPath(null);
    } catch (err) {
      alert('Authentication failed. Check your credentials.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
          <Dialog.Title className="text-lg font-semibold mb-4">
            {isRegister ? 'Register' : 'Login'}
          </Dialog.Title>

          <input
            type="email"
            placeholder="Email"
            className="w-full mb-3 p-2 border rounded"
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
            onClick={handleAuth}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Processing...' : isRegister ? 'Register' : 'Login'}
          </button>

          <p className="text-sm text-center text-gray-500 mt-4">
            {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-600 hover:underline"
            >
              {isRegister ? 'Login' : 'Register'}
            </button>
          </p>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
