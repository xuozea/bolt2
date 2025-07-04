import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, LogOut, User, Calendar, Home, Bell, Search, MessageCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../hooks/useNotifications';
import SearchBar from '../Search/SearchBar';

const Header: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const { permission, requestPermission } = useNotifications();
  const [showSearch, setShowSearch] = useState(false);

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: Calendar },
    { path: '/businesses', label: 'Businesses', icon: Users },
    { path: '/messages', label: 'Messages', icon: MessageCircle },
  ];

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const handleNotificationRequest = async () => {
    if (permission === 'default') {
      await requestPermission();
    }
  };

  return (
    <header className="apple-glass sticky top-0 z-50 border-b border-opacity-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <motion.div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))'
              }}
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <Users className="w-6 h-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold gradient-text">
              Queue Away
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <SearchBar />
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'apple-glass-card'
                      : 'hover:apple-glass-card'
                  }`}
                  style={{
                    color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                    fontWeight: isActive ? '600' : '500'
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            {/* Mobile Search Toggle */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="md:hidden flex items-center space-x-2 px-3 py-2 rounded-xl hover:apple-glass-card transition-all duration-300"
              style={{ color: 'var(--text-secondary)' }}
            >
              <Search className="w-5 h-5" />
            </button>

            {currentUser ? (
              <div className="flex items-center space-x-3">
                {/* Notification Bell */}
                <motion.button
                  onClick={handleNotificationRequest}
                  className="relative flex items-center space-x-2 px-3 py-2 rounded-xl hover:apple-glass-card transition-all duration-300"
                  style={{ color: 'var(--text-secondary)' }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Bell className="w-5 h-5" />
                  {permission === 'default' && (
                    <div className="notification-badge">!</div>
                  )}
                </motion.button>

                <Link
                  to="/profile"
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:apple-glass-card transition-all duration-300"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <User className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">
                    {currentUser.displayName || currentUser.email}
                  </span>
                </Link>
                <motion.button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300 text-red-600"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">Logout</span>
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="apple-button-secondary"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="apple-button"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search Bar */}
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-opacity-20"
            style={{ borderColor: 'var(--glass-border)' }}
          >
            <SearchBar />
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;