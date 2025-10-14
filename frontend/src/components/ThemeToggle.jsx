import React, { useState, useEffect } from 'react';

/**
 * ThemeToggle Component
 * 
 * This component manages the theme switching between light and dark modes.
 * 
 * Behavior:
 * - Always defaults to light mode on first visit
 * - Remembers user's choice in localStorage
 * - No automatic detection of system preference
 * - User must explicitly choose dark mode to enable it
 * 
 * Props:
 * - className: Additional CSS classes
 * - isSidebar: If true, shows on mobile (for sidebar), otherwise hides on mobile
 */
const ThemeToggle = ({ className = '', isSidebar = false }) => {
  const [isDark, setIsDark] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize theme on component mount
    const initializeTheme = () => {
      const savedTheme = localStorage.getItem('theme');

      // Remove any existing theme classes
      document.documentElement.classList.remove('dark-theme', 'light-theme');

      let shouldBeDark = false;

      if (savedTheme === 'dark') {
        shouldBeDark = true;
      } else if (savedTheme === 'light') {
        shouldBeDark = false;
      } else {
        // No saved preference, always default to light mode
        shouldBeDark = false;
        // Set light theme as default in localStorage
        localStorage.setItem('theme', 'light');
      }

      setIsDark(shouldBeDark);

      if (shouldBeDark) {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.add('light-theme');
      }

      setIsInitialized(true);
    };

    initializeTheme();
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    // Remove existing theme classes
    document.documentElement.classList.remove('dark-theme', 'light-theme');

    if (newTheme) {
      document.documentElement.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    }
  };

  // Don't render until theme is initialized to prevent flash
  if (!isInitialized) {
    return null;
  }

  // Determine visibility class based on context
  const visibilityClass = isSidebar
    ? 'block' // Always visible in sidebar (including mobile)
    : '!hidden md:block'; // Hidden on mobile, visible on desktop

  return (
    <button
      onClick={toggleTheme}
      className={`theme-toggle-button ${visibilityClass} ${className}`}
      aria-label="Toggle theme"
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {isDark ? (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;
