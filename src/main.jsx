// 📄 File: src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthModalProvider } from './context/AuthModalContext';
import { BrowserRouter } from 'react-router-dom'; // ✅ ADD THIS

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthModalProvider>
        <App />
      </AuthModalProvider>
    </BrowserRouter>
  </React.StrictMode>
);
