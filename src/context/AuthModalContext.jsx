import React, { createContext, useState, useContext } from 'react';

const AuthModalContext = createContext();

export function useAuthModal() {
  return useContext(AuthModalContext);
}

export function AuthModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <AuthModalContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </AuthModalContext.Provider>
  );
}
