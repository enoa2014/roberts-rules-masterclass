"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Menu,
  X,
  BookOpen,
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

export function SiteNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const role = session?.user?.role;
  const isSignedIn = Boolean(session?.user?.id);
  const isTeacherOrAdmin = role === "teacher" || role === "admin";
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

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <Link className="flex items-center gap-2 font-bold text-xl text-primary" href="/">
          <GraduationCap className="h-6 w-6" />
          <span>议起读</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:gap-6">
          {links.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm font-medium transition-colors hover:text-primary ${isActive(href) ? "text-primary" : "text-muted-foreground"
                }`}
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          {isSignedIn ? (
            <>
              {roleLabel ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  {roleLabel}
                </span>
              ) : null}
              {isTeacherOrAdmin ? (
                <Link href="/admin" className="text-sm font-medium text-muted-foreground hover:text-primary">
                  管理后台
                </Link>
              ) : null}
              <button
                type="button"
                className="text-sm font-medium text-muted-foreground hover:text-primary"
                onClick={() => signOut({ callbackUrl: "/login" })}
              >
                退出
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-muted-foreground hover:text-primary">
                登录
              </Link>
              <Link href="/register" className="button h-9 px-4">
                注册
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-muted-foreground hover:text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-white">
          <div className="container py-4 grid gap-4">
            {links.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 text-sm font-medium p-2 rounded-md ${isActive(href) ? "bg-blue-50 text-primary" : "text-muted-foreground hover:bg-gray-50"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
            <div className="border-t pt-4 grid gap-2">
              {isSignedIn ? (
                <>
                  {roleLabel ? (
                    <div className="flex items-center gap-2 text-sm font-medium p-2 rounded-md bg-blue-50 text-blue-700">
                      <ShieldCheck className="h-4 w-4" /> 当前身份：{roleLabel}
                    </div>
                  ) : null}
                  {isTeacherOrAdmin ? (
                    <Link
                      href="/admin"
                      className="flex items-center gap-2 text-sm font-medium p-2 rounded-md text-muted-foreground hover:bg-gray-50"
                      onClick={() => setIsOpen(false)}
                    >
                      <ShieldCheck className="h-4 w-4" /> 管理后台
                    </Link>
                  ) : null}
                  <button
                    type="button"
                    className="flex items-center gap-2 text-sm font-medium p-2 rounded-md text-muted-foreground hover:bg-gray-50"
                    onClick={() => {
                      setIsOpen(false);
                      void signOut({ callbackUrl: "/login" });
                    }}
                  >
                    <LogOut className="h-4 w-4" /> 退出
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 text-sm font-medium p-2 rounded-md text-muted-foreground hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    <LogIn className="h-4 w-4" /> 登录
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-2 text-sm font-medium p-2 rounded-md bg-primary/10 text-primary hover:bg-primary/20"
                    onClick={() => setIsOpen(false)}
                  >
                    <UserPlus className="h-4 w-4" /> 注册
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
