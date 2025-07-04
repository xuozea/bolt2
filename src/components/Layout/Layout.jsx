import React, { useState, useEffect } from 'react';
import Header from './Header';
import ThemeToggle from './ThemeToggle';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <div className="min-h-screen relative">
      {/* 3D Background */}
      <div className="bg-3d">
        <div className="floating-sphere"></div>
        <div className="floating-sphere"></div>
        <div className="floating-sphere"></div>
        <div className="floating-sphere"></div>
      </div>

      <Header />
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      
      <main className="flex-1 relative z-10">
        {children}
      </main>
      
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--glass-bg)',
            color: 'var(--text-primary)',
            border: '1px solid var(--glass-border)',
            borderRadius: '12px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px var(--shadow-color)',
          },
          success: {
            iconTheme: {
              primary: 'var(--accent-primary)',
              secondary: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'white',
            },
          },
        }}
      />
    </div>
  );
};

export default Layout;