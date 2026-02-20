"use client";

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'default' | 'festival-civic' | 'mint-campaign' | 'charcoal-grid' | 'copper-lecture';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

function isTheme(value: string | null | undefined): value is Theme {
  return (
    value === 'default' ||
    value === 'festival-civic' ||
    value === 'mint-campaign' ||
    value === 'charcoal-grid' ||
    value === 'copper-lecture'
  );
}

// 获取初始主题的函数，避免 SSR 不匹配
function getInitialTheme(): Theme {
  if (typeof document !== 'undefined') {
    const domTheme = document.documentElement.getAttribute('data-theme');
    if (isTheme(domTheme)) {
      return domTheme;
    }
  }

  if (typeof window === 'undefined') {
    return 'default';
  }

  try {
    const savedTheme = localStorage.getItem('theme');
    if (isTheme(savedTheme)) {
      return savedTheme;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }

  return 'default';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme());

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

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const themeOrder: Theme[] = ['default', 'festival-civic', 'mint-campaign', 'charcoal-grid', 'copper-lecture'];
    const currentIndex = themeOrder.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setTheme(themeOrder[nextIndex]);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isLoaded: true }}>
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
