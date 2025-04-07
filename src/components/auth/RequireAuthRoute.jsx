// 📄 src/components/auth/RequireAuthRoute.jsx

import React, { useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import { useAuthModal } from '../../context/AuthModalContext';
import { useLocation } from 'react-router-dom';

export default function RequireAuthRoute({ children }) {
  const [user] = useAuthState(auth);
  const { setIsOpen, setRedirectPath } = useAuthModal();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      setRedirectPath(location.pathname); // Save where user was going
      setIsOpen(true); // Open login/register modal
    }
  }, [user, setIsOpen, setRedirectPath, location.pathname]);

  if (!user) return null;
  return children;
}
