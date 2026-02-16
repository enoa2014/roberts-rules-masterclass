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

// 获取初始主题的函数，避免 SSR 不匹配
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') {
    return 'default';
  }

  try {
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (
      savedTheme &&
      (savedTheme === 'default' ||
        savedTheme === 'festival-civic' ||
        savedTheme === 'mint-campaign' ||
        savedTheme === 'charcoal-grid' ||
        savedTheme === 'copper-lecture')
    ) {
      return savedTheme;
    }
  } catch (error) {
    console.warn('Failed to read theme from localStorage:', error);
  }

  return 'default';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('default');
  const [isLoaded, setIsLoaded] = useState(false);

  // 在客户端初始化时立即设置主题
  useEffect(() => {
    const initialTheme = getInitialTheme();
    setThemeState(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    setIsLoaded(true);
  }, []);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);

    try {
      localStorage.setItem('theme', newTheme);
    } catch (error) {
      console.warn('Failed to save theme to localStorage:', error);
    }
  };

  const toggleTheme = () => {
    const themeOrder: Theme[] = ['default', 'festival-civic', 'mint-campaign', 'charcoal-grid', 'copper-lecture'];
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
