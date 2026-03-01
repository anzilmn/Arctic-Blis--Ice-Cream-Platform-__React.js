import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

const DarkModeToggle = () => {
  // 1. Initialize theme based on local storage or default to light
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  // 2. Apply theme class to <html> element and update localStorage
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-2xl bg-pink-50 dark:bg-darkCard hover:bg-gray-200 dark:hover:bg-gray-700 transition"
    >
      {theme === 'light' ? (
        <Moon className="text-gray-600" size={20} />
      ) : (
        <Sun className="text-yellow-400" size={20} />
      )}
    </button>
  );
};

export default DarkModeToggle;