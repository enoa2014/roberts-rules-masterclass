"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  BookOpen,
  Wrench,
  LibraryBig,
  FolderOpen,
  HelpCircle,
  Info,
  GraduationCap,
} from "lucide-react";
import { ThemeSelector } from "./theme-selector";
import { navLinksCore } from "@yiqidu/content";

const coreIconMap: Record<string, typeof BookOpen> = {
  "/course": BookOpen,
  "/rules": BookOpen,
  "/reading": LibraryBig,
  "/tools": Wrench,
  "/resources": FolderOpen,
  "/about": Info,
  "/faq": HelpCircle,
};

const navLinks = navLinksCore.map(({ label, href }) => ({
  label,
  href,
  icon: coreIconMap[href] ?? BookOpen,
}));

export function SiteNavEsa() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      return;
    }

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen]);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"
      }`}>
      <div className="container">
        <div className={`nav-glass rounded-2xl transition-all duration-500 ${scrolled ? "shadow-political" : "shadow-lg"
          }`}>
          <div className="flex h-16 items-center justify-between px-6">
            {/* Enhanced Logo */}
            <Link
              className="flex items-center gap-3 font-bold text-xl group cursor-pointer"
              href="/"
            >
              <div className="relative">
                <div className="h-10 w-10 gradient-political rounded-xl flex items-center justify-center shadow-political transition-all duration-300 group-hover:shadow-accent group-hover:scale-110">
                  <GraduationCap className="h-5 w-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse opacity-80"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-gradient-political font-bold text-lg leading-none">
                  议起读
                </span>
                <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                  DELIBERATION
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex lg:items-center lg:gap-1 lg:flex-1 lg:justify-center lg:px-8">
              {navLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${isActive(href)
                      ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-political"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    }`}
                >
                  <Icon className={`h-4 w-4 transition-transform duration-300 ${isActive(href) ? "scale-110" : "group-hover:scale-110"
                    }`} />
                  <span className="font-mono text-xs uppercase tracking-wide">
                    {label}
                  </span>
                  {isActive(href) && (
                    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-yellow-400 rounded-full animate-pulse"></div>
                  )}
                </Link>
              ))}
            </div>

            {/* Desktop Theme */}
            <div className="hidden lg:flex items-center gap-4">
              <ThemeSelector placement="down" onThemeChange={() => router.refresh()} />
            </div>

            {/* Mobile Menu Button */}
            <button
              type="button"
              className="lg:hidden p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200 cursor-pointer"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-nav-menu"
              aria-label={isOpen ? "关闭导航菜单" : "打开导航菜单"}
            >
              <div className="relative w-6 h-6">
                <Menu className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${isOpen ? 'opacity-0 rotate-180' : 'opacity-100 rotate-0'}`} />
                <X className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${isOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-180'}`} />
              </div>
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isOpen && (
          <div
            id="mobile-nav-menu"
            className="lg:hidden mt-3 transition-all duration-500 ease-out opacity-100 transform translate-y-0"
          >
            <div className="glass-card p-6 animate-fadeInUp max-h-[calc(100vh-8rem)] overflow-y-auto overscroll-contain touch-pan-y">
              {/* Mobile Navigation Links */}
              <div className="grid gap-2 mb-6">
                {navLinks.map(({ label, href, icon: Icon }, index) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-4 p-4 rounded-xl font-medium transition-all duration-300 cursor-pointer animate-slideInLeft ${isActive(href)
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-political"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                      }`}
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className={`p-2 rounded-lg transition-all duration-300 ${isActive(href)
                        ? "bg-white/20"
                        : "bg-blue-100 text-blue-600"
                      }`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">{label}</span>
                      <span className="font-mono text-xs opacity-70 uppercase tracking-wide">
                        {href.replace('/', '').toUpperCase() || 'HOME'}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mobile Theme Selector */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <ThemeSelector placement="up" onThemeChange={() => router.refresh()} />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
