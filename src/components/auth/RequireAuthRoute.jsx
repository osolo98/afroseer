import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Navigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { useAuthModal } from '../../context/AuthModalContext';

export default function RequireAuthRoute({ children }) {
  const [user] = useAuthState(auth);
  const { setIsOpen } = useAuthModal();

  if (!user) {
    setIsOpen(true); // show modal instead of navigate
    return null;
  }

  return children;
}
