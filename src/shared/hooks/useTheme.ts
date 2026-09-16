import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks';
import {
  setTheme,
  toggleTheme as toggleThemeAction,
  selectTheme,
} from '@/shared/store/slices/uiSlice';

/**
 * Custom hook to manage theme (light/dark mode)
 * Applies the theme class to the document root
 * Syncs with localStorage
 */
export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector(selectTheme);

  // Apply theme class to document root
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    // Store in localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (stored && stored !== theme) {
      dispatch(setTheme(stored));
    } else if (!stored) {
      dispatch(setTheme('dark')); // Default to dark if no preference
    }
  }, [dispatch, theme]);

  const toggleTheme = () => {
    dispatch(toggleThemeAction());
  };

  const setThemeMode = (mode: 'light' | 'dark') => {
    dispatch(setTheme(mode));
  };

  return {
    theme,
    toggleTheme,
    setTheme: setThemeMode,
    isDark: theme === 'dark',
  };
};
