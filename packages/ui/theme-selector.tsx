"use client";

import { useState, useRef, useEffect } from 'react';
import { Palette, Sparkles, Crown, Zap, Grid3X3, ScrollText } from 'lucide-react';
import { useTheme } from './theme-provider';
import { ThemeType } from './theme-types';

type ThemeSelectorProps = {
  placement?: 'down' | 'up';
};

export function ThemeSelector({ placement = 'down', onThemeChange }: ThemeSelectorProps & { onThemeChange?: (theme: ThemeType) => void }) {
  const { theme, setTheme, isLoaded } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 处理点击外部关闭
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  // 处理键盘导航
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsOpen(!isOpen);
    }
  };

  // 如果主题还没加载完成，显示占位符而不是返回 null
  if (!isLoaded) {
    return (
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl border-2 bg-white border-gray-200 text-gray-400 shadow-lg opacity-50">
        <Palette className="h-5 w-5" />
        <span className="font-mono text-sm font-semibold uppercase tracking-wide">
          主题
        </span>
        <Zap className="h-4 w-4 opacity-60" />
      </div>
    );
  }

  const themes = [
    {
      id: 'classic' as const,
      name: '经典课堂',
      description: '稳重专业的课堂风格',
      icon: Crown,
      colors: ['#1e3a8a', '#c27c2f', '#f8fafc'],
      preview: 'bg-gradient-to-r from-blue-800 via-amber-600 to-slate-50'
    },
    {
      id: 'festival-civic' as const,
      name: '活力课堂',
      description: '活力鲜明的课堂风格',
      icon: Sparkles,
      colors: ['#be123c', '#e11d48', '#2563eb'],
      preview: 'bg-gradient-to-r from-rose-700 via-rose-500 to-blue-600'
    },
    {
      id: 'mint-campaign' as const,
      name: '薄荷实践',
      description: '清新活力的实践风格',
      icon: Zap,
      colors: ['#0f766e', '#14b8a6', '#f97316'],
      preview: 'bg-gradient-to-r from-teal-700 via-teal-500 to-orange-500'
    },
    {
      id: 'charcoal-grid' as const,
      name: '炭黑栅格',
      description: '结构化的深灰风格',
      icon: Grid3X3,
      colors: ['#1f2937', '#374151', '#10b981'],
      preview: 'bg-gradient-to-r from-gray-800 via-gray-600 to-emerald-500'
    },
    {
      id: 'copper-lecture' as const,
      name: '铜色讲堂',
      description: '讲座质感的铜棕风格',
      icon: ScrollText,
      colors: ['#9a3412', '#b45309', '#1d4ed8'],
      preview: 'bg-gradient-to-r from-orange-900 via-amber-700 to-blue-700'
    }
  ];

  const panelPlacementClasses = placement === 'up'
    ? 'fixed inset-x-4 bottom-4 w-auto max-h-[70vh]'
    : 'absolute top-full right-0 mt-3 w-[min(20rem,calc(100vw-2rem))] max-h-[70vh]';

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative">
        {/* 主题切换按钮 */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          className={`
            flex items-center gap-2 px-4 py-3 rounded-2xl border-2 transition-all duration-300
            focus:outline-none focus:ring-2 focus:ring-offset-2
            ${theme === 'classic'
              ? 'bg-white border-blue-200 text-blue-800 shadow-lg hover:shadow-xl focus:ring-blue-500'
              : theme === 'festival-civic'
                ? 'bg-white border-rose-200 text-rose-800 shadow-lg hover:shadow-xl focus:ring-rose-500'
                : theme === 'mint-campaign'
                  ? 'bg-white border-teal-200 text-teal-800 shadow-lg hover:shadow-xl focus:ring-teal-500'
                  : theme === 'copper-lecture'
                    ? 'bg-white border-amber-700 text-amber-900 shadow-lg hover:shadow-xl focus:ring-amber-700'
                    : 'bg-white border-gray-700 text-gray-800 shadow-lg hover:shadow-xl focus:ring-gray-500'
            }
          `}
          aria-expanded={isOpen}
          aria-haspopup="true"
          aria-label="选择主题"
        >
          <Palette className="h-5 w-5" />
          <span className="font-mono text-sm font-semibold uppercase tracking-wide">
            主题
          </span>
          <Zap className="h-4 w-4 opacity-60" />
        </button>

        {/* 主题选择面板 */}
        <div className={`
          ${panelPlacementClasses} z-50 bg-white rounded-3xl border-2 shadow-2xl overflow-y-auto overscroll-contain
          transition-all duration-300 transform
          ${isOpen
            ? 'opacity-100 visible translate-y-0'
            : 'opacity-0 invisible translate-y-2 pointer-events-none'
          }
          ${theme === 'classic'
            ? 'border-blue-200'
            : theme === 'festival-civic'
              ? 'border-rose-200'
              : theme === 'mint-campaign'
                ? 'border-teal-200'
                : theme === 'copper-lecture'
                  ? 'border-amber-700'
                  : 'border-gray-700'
          }
        `}>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h3 className="font-bold text-gray-900">选择主题风格</h3>
            </div>

            <div className="space-y-3">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isActive = theme === themeOption.id;

                return (
                  <button
                    key={themeOption.id}
                    onClick={() => {
                      if (theme !== themeOption.id) {
                        setTheme(themeOption.id);
                        if (onThemeChange) {
                          onThemeChange(themeOption.id);
                        }
                      }
                      setIsOpen(false);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (theme !== themeOption.id) {
                          setTheme(themeOption.id);
                          if (onThemeChange) onThemeChange(themeOption.id);
                        }
                        setIsOpen(false);
                      }
                    }}
                    className={`
                      w-full p-4 rounded-2xl border-2 text-left transition-all duration-300
                      focus:outline-none focus:ring-2 focus:ring-offset-2
                      ${isActive
                        ? themeOption.id === 'classic'
                          ? 'border-blue-500 bg-blue-50 shadow-lg focus:ring-blue-500'
                          : themeOption.id === 'festival-civic'
                            ? 'border-rose-500 bg-rose-50 shadow-lg focus:ring-rose-500'
                            : themeOption.id === 'mint-campaign'
                              ? 'border-teal-500 bg-teal-50 shadow-lg focus:ring-teal-500'
                              : themeOption.id === 'copper-lecture'
                                ? 'border-amber-700 bg-amber-50 shadow-lg focus:ring-amber-700'
                                : 'border-gray-700 bg-gray-50 shadow-lg focus:ring-gray-500'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md focus:ring-gray-400'
                      }
                    `}
                    aria-pressed={isActive}
                  >
                    <div className="flex items-start gap-3">
                      {/* 主题图标 */}
                      <div className={`
                        p-2 rounded-xl
                        ${themeOption.id === 'classic'
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600'
                          : themeOption.id === 'festival-civic'
                            ? 'bg-gradient-to-br from-rose-500 to-rose-600'
                            : themeOption.id === 'mint-campaign'
                              ? 'bg-gradient-to-br from-teal-500 to-teal-600'
                              : themeOption.id === 'copper-lecture'
                                ? 'bg-gradient-to-br from-amber-800 to-orange-700'
                                : 'bg-gradient-to-br from-gray-700 to-gray-800'
                        }
                      `}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>

                      <div className="flex-1">
                        {/* 主题名称 */}
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900">{themeOption.name}</h4>
                          {isActive && (
                            <div className={`
                              px-2 py-1 rounded-full text-xs font-mono font-semibold uppercase
                              ${themeOption.id === 'classic'
                                ? 'bg-blue-100 text-blue-700'
                                : themeOption.id === 'festival-civic'
                                  ? 'bg-rose-100 text-rose-700'
                                  : themeOption.id === 'mint-campaign'
                                    ? 'bg-teal-100 text-teal-700'
                                    : themeOption.id === 'copper-lecture'
                                      ? 'bg-amber-100 text-amber-800'
                                      : 'bg-gray-100 text-gray-700'
                              }
                            `}>
                              当前
                            </div>
                          )}
                        </div>

                        {/* 主题描述 */}
                        <p className="text-sm text-gray-600 mb-3">
                          {themeOption.description}
                        </p>

                        {/* 颜色预览 */}
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            {themeOption.colors.map((color, index) => (
                              <div
                                key={index}
                                className="w-4 h-4 rounded-full border border-gray-200"
                                style={{ backgroundColor: color }}
                              />
                            ))}
                          </div>
                          <div className={`
                            flex-1 h-2 rounded-full ${themeOption.preview}
                          `} />
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 提示信息 */}
            <div className="mt-4 p-3 bg-gray-50 rounded-xl">
              <p className="text-xs text-gray-600 leading-relaxed">
                <strong>经典课堂</strong> 保持稳重专业风格。
                <strong>活力课堂</strong> 采用高饱和与戏剧性动画。
                <strong>薄荷实践</strong> 强调清新活力与实践感。
                <strong>炭黑栅格</strong> 结构化深灰风格，信息边界明确。
                <strong>铜色讲堂</strong> 强调讲座质感与内容层次。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
