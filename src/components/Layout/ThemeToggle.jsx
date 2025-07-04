import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
    <motion.button
      onClick={toggleTheme}
      className="theme-toggle"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 }}
    >
      <motion.div
        key={theme}
        initial={{ rotate: -180, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {theme === 'light' ? (
          <Moon className="w-6 h-6 text-gray-600" />
        ) : (
          <Sun className="w-6 h-6 text-yellow-400" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;