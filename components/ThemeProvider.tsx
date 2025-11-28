'use client';

import { useEffect } from 'react';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Function to update theme based on system preference
    const updateTheme = () => {
      const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (isDarkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    // Initial theme setup
    updateTheme();

    // Listen for changes in system theme preference
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const lightModeQuery = window.matchMedia('(prefers-color-scheme: light)');

    const handleChange = () => {
      updateTheme();
    };

    // Add listeners for both dark and light mode changes
    darkModeQuery.addEventListener('change', handleChange);
    lightModeQuery.addEventListener('change', handleChange);

    return () => {
      darkModeQuery.removeEventListener('change', handleChange);
      lightModeQuery.removeEventListener('change', handleChange);
    };
  }, []);

  return <>{children}</>;
}
