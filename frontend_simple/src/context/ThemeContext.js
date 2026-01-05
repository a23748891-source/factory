import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  const [colorScheme, setColorScheme] = useState(() => {
    const savedScheme = localStorage.getItem('colorScheme');
    return savedScheme || 'purple';
  });

  useEffect(() => {
    localStorage.setItem('theme', theme);
    localStorage.setItem('colorScheme', colorScheme);
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('data-color-scheme', colorScheme);
  }, [theme, colorScheme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const changeColorScheme = (scheme) => {
    setColorScheme(scheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, colorScheme, toggleTheme, changeColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

