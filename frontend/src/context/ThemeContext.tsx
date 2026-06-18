/**
 * Theme Context
 * Manages dark/light mode theme switching across the application
 * Persists user's theme preference in localStorage
 */

import React, { createContext, useContext, useEffect, useState } from 'react';

/**
 * Available theme modes
 */
type Theme = 'light' | 'dark';

/**
 * Theme context type definition
 */
interface ThemeContextType {
  theme: Theme;              // Current theme (light or dark)
  toggleTheme: () => void;   // Function to switch theme
}

// Create the Theme context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider Component
 * Provides theme state to all child components
 * Loads theme from localStorage or system preferences
 * Updates document class and localStorage when theme changes
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize theme from localStorage or system preferences
  const [theme, setTheme] = useState<Theme>(() => {
    // Try to get saved theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    // Fall back to system preference
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  /**
   * Effect: Update DOM and localStorage when theme changes
   * Adds or removes 'dark' class from document root
   * Persists theme choice to localStorage
   */
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      // Add dark mode class to enable dark theme styling
      root.classList.add('dark');
    } else {
      // Remove dark mode class to enable light theme styling
      root.classList.remove('dark');
    }
    // Save theme preference to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  /**
   * Toggle theme between light and dark
   */
  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to use theme context
 * Must be used within ThemeProvider
 * @returns Theme context with current theme and toggleTheme function
 * @throws Error if used outside ThemeProvider
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
