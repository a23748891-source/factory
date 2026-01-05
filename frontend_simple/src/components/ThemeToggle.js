import React from 'react';
import { useTheme } from '../context/ThemeContext';
import './ThemeToggle.css';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="theme-toggle" onClick={toggleTheme} title={theme === 'light' ? '다크모드로 전환' : '라이트모드로 전환'}>
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

export default ThemeToggle;

