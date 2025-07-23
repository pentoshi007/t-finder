import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
          },
        }}
      />
      <App />
    </AuthProvider>
  </React.StrictMode>
);
