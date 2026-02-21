"use client";

import { createContext, useContext, useEffect, useState } from 'react';

import { ThemeType, VALID_THEMES, THEME_SHORT_MAP } from './theme-types';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  toggleTheme: () => void;
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function isTheme(value: string | null | undefined): value is ThemeType {
  return VALID_THEMES.includes(value as ThemeType);
}

function normalizeTheme(value: string | null | undefined): ThemeType | null {
  if (!value) return null;
  const mapped = THEME_SHORT_MAP[value] || value;
  return isTheme(mapped) ? mapped : null;
}

// 获取初始主题的函数，避免 SSR 不匹配
function getInitialTheme(): ThemeType {
  if (typeof document !== 'undefined') {
    const domTheme = document.documentElement.getAttribute('data-theme');
    const normDom = normalizeTheme(domTheme);
    if (normDom) {
      return normDom;
    }
  }

  if (typeof window === 'undefined') {
    return 'classic';
  }

  try {
    const rawCookie = document.cookie;
    const cookieTheme = rawCookie.split('; ').find(row => row.startsWith('app-theme='))?.split('=')[1];
    const normCookie = normalizeTheme(cookieTheme);
    if (normCookie) {
      return normCookie;
    }
    // Also try checking localStorage as fallback
    const savedTheme = localStorage.getItem('theme');
    const normSaved = normalizeTheme(savedTheme);
    if (normSaved) {
      return normSaved;
    }
  } catch (error) {
    console.warn('Failed to read theme:', error);
  }

  return 'classic';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>('classic');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setThemeState(initialTheme);
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('theme', theme);
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }
  }, [theme]);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    // Write cookie from ThemeProvider itself so it's globally managed
    if (typeof document !== 'undefined') {
      document.cookie = `app-theme=${newTheme}; path=/; max-age=31536000`;
    }
  };

  const toggleTheme = () => {
    const themeOrder: ThemeType[] = [...VALID_THEMES];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isLoaded }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
