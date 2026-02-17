"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Menu,
  X,
  BookOpen,
  Users,
  FileText,
  Wrench,
  LibraryBig,
  FolderOpen,
  MessageSquare,
  GraduationCap,
  HelpCircle,
  LogIn,
  UserPlus,
  Info,
  LogOut,
  ShieldCheck,
  Crown,
  Sparkles,
} from "lucide-react";
import { ThemeSelector } from "./theme-selector";

const links = [
  { label: "课程总览", href: "/course", icon: BookOpen },
  { label: "关于与报名", href: "/about", icon: Info },
  { label: "FAQ", href: "/faq", icon: HelpCircle },
];

const learnerLinks = [
  { label: "课程总览", href: "/course", icon: BookOpen },
  { label: "学习中心", href: "/rules", icon: BookOpen },
  { label: "阅读探究", href: "/reading", icon: LibraryBig },
  { label: "工具库", href: "/tools", icon: Wrench },
  { label: "资源中心", href: "/resources", icon: FolderOpen },
  { label: "互动课堂", href: "/interact", icon: Users },
  { label: "作业复盘", href: "/homework", icon: FileText },
  { label: "留言讨论", href: "/discussion", icon: MessageSquare },
];

const registeredLinks = [{ label: "输入邀请码", href: "/invite", icon: ShieldCheck }];

export function SiteNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isSignedIn = Boolean(session?.user?.id);
  const isTeacherOrAdmin = role === "teacher" || role === "admin";
  const isRegistered = role === "registered";
  const shouldShowLearningLinks = role === "student" || role === "teacher" || role === "admin";

  const navLinks = shouldShowLearningLinks
    ? learnerLinks
    : isRegistered
      ? [...links, ...registeredLinks]
      : links;

  const roleConfig = {
    admin: { label: "管理员", icon: Crown, color: "text-red-600", bgColor: "bg-red-50 border-red-200" },
    teacher: { label: "教师", icon: GraduationCap, color: "text-purple-600", bgColor: "bg-purple-50 border-purple-200" },
    student: { label: "学员", icon: Sparkles, color: "text-blue-600", bgColor: "bg-blue-50 border-blue-200" },
    registered: { label: "已注册", icon: ShieldCheck, color: "text-green-600", bgColor: "bg-green-50 border-green-200" },
  };

  const currentRole = role ? roleConfig[role as keyof typeof roleConfig] : null;

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
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? "py-2" : "py-4"
    }`}>
      <div className="container">
        <div className={`nav-glass rounded-2xl transition-all duration-500 ${
          scrolled ? "shadow-political" : "shadow-lg"
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
                  className={`group relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-300 cursor-pointer ${
                    isActive(href)
                      ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 shadow-political"
                      : "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-transform duration-300 ${
                    isActive(href) ? "scale-110" : "group-hover:scale-110"
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

            {/* Desktop Auth Section */}
            <div className="hidden lg:flex items-center gap-4">
              {/* 主题选择器 */}
              <ThemeSelector placement="down" />

              {isSignedIn ? (
                <>
                  {currentRole && (
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${currentRole.bgColor} ${currentRole.color}`}>
                      <currentRole.icon className="h-4 w-4" />
                      <span className="font-mono text-xs font-semibold uppercase tracking-wide">
                        {currentRole.label}
                      </span>
                    </div>
                  )}
                  {isTeacherOrAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 transition-all duration-200 cursor-pointer"
                    >
                      <Crown className="h-4 w-4" />
                      <span className="uppercase tracking-wide">管理后台</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all duration-200 cursor-pointer"
                    onClick={() => signOut({ callbackUrl: "/login" })}
                  >
                    <LogOut className="h-4 w-4" />
                    <span className="uppercase tracking-wide">退出</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                  >
                    <LogIn className="h-4 w-4" />
                    <span className="uppercase tracking-wide">登录</span>
                  </Link>
                  <Link
                    href="/register"
                    className="btn btn-primary relative overflow-hidden"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span className="uppercase tracking-wide">注册</span>
                  </Link>
                </>
              )}
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
            {/* Mobile Role Badge */}
            {isSignedIn && currentRole && (
              <div className={`flex items-center justify-center gap-2 mb-6 px-4 py-3 rounded-xl ${currentRole.bgColor} ${currentRole.color}`}>
                <currentRole.icon className="h-5 w-5" />
                <span className="font-mono text-sm font-bold uppercase tracking-wide">
                  当前身份：{currentRole.label}
                </span>
              </div>
            )}

            {/* Mobile Navigation Links */}
            <div className="grid gap-2 mb-6">
              {navLinks.map(({ label, href, icon: Icon }, index) => (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-4 p-4 rounded-xl font-medium transition-all duration-300 cursor-pointer animate-slideInLeft ${
                    isActive(href)
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-political"
                      : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setIsOpen(false)}
                >
                  <div className={`p-2 rounded-lg transition-all duration-300 ${
                    isActive(href)
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

            {/* Mobile Auth Section */}
            <div className="border-t border-gray-200 pt-6">
              {isSignedIn ? (
                <div className="grid gap-2">
                  {isTeacherOrAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-4 p-4 rounded-xl text-gray-700 hover:bg-purple-50 hover:text-purple-600 transition-all duration-300 cursor-pointer"
                      onClick={() => setIsOpen(false)}
                    >
                      <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                        <Crown className="h-5 w-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-semibold">管理后台</span>
                        <span className="font-mono text-xs opacity-70 uppercase tracking-wide">ADMIN</span>
                      </div>
                    </Link>
                  )}
                  <button
                    type="button"
                    className="flex items-center gap-4 p-4 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all duration-300 cursor-pointer w-full text-left"
                    onClick={() => {
                      setIsOpen(false);
                      void signOut({ callbackUrl: "/login" });
                    }}
                  >
                    <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                      <LogOut className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">退出登录</span>
                      <span className="font-mono text-xs opacity-70 uppercase tracking-wide">LOGOUT</span>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="grid gap-2">
                  <Link
                    href="/login"
                    className="flex items-center gap-4 p-4 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-300 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <LogIn className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">登录</span>
                      <span className="font-mono text-xs opacity-70 uppercase tracking-wide">LOGIN</span>
                    </div>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-4 p-4 rounded-xl gradient-political text-white shadow-political transition-all duration-300 cursor-pointer hover:shadow-accent"
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="p-2 bg-white/20 rounded-lg">
                      <UserPlus className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-semibold">注册账号</span>
                      <span className="font-mono text-xs opacity-80 uppercase tracking-wide">REGISTER</span>
                    </div>
                  </Link>
                </div>
              )}

              {/* 移动端主题选择器（保持在菜单底部） */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <ThemeSelector placement="up" />
              </div>
            </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
