"use client";

import { useState } from "react";
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
} from "lucide-react";

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
  const roleLabel =
    role === "admin"
      ? "管理员"
      : role === "teacher"
        ? "教师"
        : role === "student"
          ? "学员"
          : role === "registered"
            ? "已注册"
            : "";

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  return (
    <nav className="sticky top-0 z-50 w-full">
      <div className="mx-4 mt-3 mb-0 rounded-2xl border border-white/30 bg-white/80 backdrop-blur-xl shadow-soft">
        <div className="container flex h-16 items-center justify-between">
          {/* Logo */}
          <Link className="flex items-center gap-2.5 font-extrabold text-xl group cursor-pointer" href="/">
            <div className="h-9 w-9 gradient-primary rounded-xl flex items-center justify-center shadow-glow transition-shadow duration-300 group-hover:shadow-glow-lg">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-800 to-indigo-700 bg-clip-text text-transparent">
              议起读
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex md:gap-1 md:flex-1 md:justify-center md:overflow-x-auto md:px-3">
            {navLinks.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className={`relative text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${isActive(href)
                    ? "text-primary bg-blue-50"
                    : "text-gray-600 hover:text-primary hover:bg-gray-50"
                  }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isSignedIn ? (
              <>
                {roleLabel ? (
                  <span className="badge-primary">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    {roleLabel}
                  </span>
                ) : null}
                {isTeacherOrAdmin ? (
                  <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors cursor-pointer">
                    管理后台
                  </Link>
                ) : null}
                <button
                  type="button"
                  className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
                  onClick={() => signOut({ callbackUrl: "/login" })}
                >
                  退出
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors cursor-pointer">
                  登录
                </Link>
                <Link href="/register" className="button h-9 px-4 text-sm">
                  注册
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-primary hover:bg-gray-50 rounded-lg transition-all duration-200 cursor-pointer"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mx-4 mt-2 rounded-2xl border border-white/30 bg-white/95 backdrop-blur-xl shadow-soft animate-fadeInUp overflow-hidden">
          <div className="p-4 grid gap-1">
            {navLinks.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 text-sm font-medium p-3 rounded-xl transition-all duration-200 cursor-pointer ${isActive(href)
                    ? "bg-blue-50 text-primary"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-4.5 w-4.5" />
                {label}
              </Link>
            ))}
            <div className="border-t my-2" />
            {isSignedIn ? (
              <>
                {roleLabel ? (
                  <div className="flex items-center gap-2 text-sm font-medium p-3 rounded-xl bg-blue-50 text-blue-700">
                    <ShieldCheck className="h-4 w-4" /> 当前身份：{roleLabel}
                  </div>
                ) : null}
                {isTeacherOrAdmin ? (
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 text-sm font-medium p-3 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    <ShieldCheck className="h-4 w-4" /> 管理后台
                  </Link>
                ) : null}
                <button
                  type="button"
                  className="flex items-center gap-3 text-sm font-medium p-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 cursor-pointer w-full text-left"
                  onClick={() => {
                    setIsOpen(false);
                    void signOut({ callbackUrl: "/login" });
                  }}
                >
                  <LogOut className="h-4 w-4" /> 退出登录
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="flex items-center gap-3 text-sm font-medium p-3 rounded-xl text-gray-600 hover:bg-gray-50 cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  <LogIn className="h-4 w-4" /> 登录
                </Link>
                <Link
                  href="/register"
                  className="flex items-center gap-3 text-sm font-semibold p-3 rounded-xl gradient-primary text-white cursor-pointer"
                  onClick={() => setIsOpen(false)}
                >
                  <UserPlus className="h-4 w-4" /> 注册账号
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
