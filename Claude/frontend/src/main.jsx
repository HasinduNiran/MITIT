// src/main.jsx
// Application entry point — mounts React into the DOM.
// Toaster is placed here so toast notifications work globally
// regardless of which page or component triggers them.

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* react-hot-toast Toaster renders notification toasts at the top-right */}
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#1e293b',
          color: '#f8fafc',
          borderRadius: '12px',
          fontSize: '14px',
        },
        success: {
          iconTheme: { primary: '#4ade80', secondary: '#1e293b' },
        },
        error: {
          iconTheme: { primary: '#f87171', secondary: '#1e293b' },
        },
      }}
    />
    <App />
  </React.StrictMode>
);
