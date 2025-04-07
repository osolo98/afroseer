// 📄 src/context/AuthModalContext.jsx

import React, { createContext, useState, useContext } from 'react';

const AuthModalContext = createContext();

export function useAuthModal() {
  return useContext(AuthModalContext);
}

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [redirectPath, setRedirectPath] = useState(null); // ✅ Added

  return (
    <AuthModalContext.Provider
      value={{ isOpen, setIsOpen, redirectPath, setRedirectPath }}
    >
      {children}
    </AuthModalContext.Provider>
  );
}
