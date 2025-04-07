import React from 'react';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';

export default function AuthGuard({ children }) {
  const navigate = useNavigate();

  const user = auth.currentUser;

  const handleClick = () => {
    if (!user) {
      navigate('/login'); // or your Auth screen
      return null;
    }
  };

  return (
    <div onClick={handleClick}>
      {user ? children : <p className="text-blue-600 underline cursor-pointer">Login to continue</p>}
    </div>
  );
}
