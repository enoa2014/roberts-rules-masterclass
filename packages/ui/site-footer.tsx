"use client";

import Link from "next/link";
import {
  GraduationCap,
  Mail,
  MessageCircle,
  Github,
  Twitter,
  Globe,
  Heart,
  ArrowUp,
  Scale,
  Users,
  BookOpen,
  Sparkles
} from "lucide-react";

export function SiteFooter() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 gradient-political"></div>
      <div className="absolute inset-0 parliament-pattern opacity-5"></div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute top-10 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
      <div className="absolute bottom-20 left-20 w-24 h-24 bg-amber-400/10 rounded-full blur-2xl"></div>

      <div className="container py-16 md:py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Enhanced Brand Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-12 w-12 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white">议起读</span>
                <span className="font-mono text-xs text-blue-200 uppercase tracking-wider">
                  DELIBERATION PLATFORM
                </span>
              </div>
            </div>

            <p className="text-blue-100 leading-relaxed max-w-md">
              致力于推广罗伯特议事规则，帮助青少年提升公共议事能力与公民素养。
              从理论学习到模拟议事，全方位掌握议事规则，成为合格的公民参与者。
            </p>

            {/* Mission Statement */}
            <div className="footer-glass p-4">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="h-4 w-4 text-amber-300" />
                <span className="font-mono text-xs text-amber-200 uppercase tracking-wide">
                  我们的使命
                </span>
              </div>
              <p className="text-sm text-blue-100 leading-relaxed">
                培养具备议事能力的公民，推动民主参与文化的发展
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-amber-300" />
              <h4 className="font-mono font-semibold text-white text-sm uppercase tracking-wider">
                学习资源
              </h4>
            </div>
            <ul className="space-y-3">
              {[
                { label: "课程体系", href: "/course", desc: "系统化学习路径" },
                { label: "学习中心", href: "/rules", desc: "议事规则详解" },
                { label: "阅读探究", href: "/reading", desc: "深度阅读材料" },
                { label: "工具库", href: "/tools", desc: "实用工具集合" },
                { label: "资源中心", href: "/resources", desc: "下载学习资料" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex flex-col gap-1 text-blue-100 hover:text-white transition-all duration-200 cursor-pointer"
                  >
                    <span className="font-medium group-hover:translate-x-1 transition-transform duration-200">
                      {link.label}
                    </span>
                    <span className="font-mono text-xs text-blue-300 opacity-70 uppercase tracking-wide">
                      {link.desc}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Community & Support */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-amber-300" />
              <h4 className="font-mono font-semibold text-white text-sm uppercase tracking-wider">
                社区支持
              </h4>
            </div>

            {/* Contact Info */}
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Mail className="h-4 w-4 text-blue-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-medium">邮箱联系</span>
                  <span className="font-mono text-sm text-blue-200">contact@yiqidu.com</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <MessageCircle className="h-4 w-4 text-green-300" />
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-medium">微信公众号</span>
                  <span className="font-mono text-sm text-blue-200">议起读平台</span>
                </div>
              </li>
            </ul>

            {/* Social Links */}
            <div className="pt-4">
              <p className="font-mono text-xs text-blue-300 uppercase tracking-wide mb-3">
                关注我们
              </p>
              <div className="flex gap-3">
                {[
                  { icon: Github, label: "GitHub", href: "#" },
                  { icon: Twitter, label: "Twitter", href: "#" },
                  { icon: Globe, label: "官网", href: "#" },
                ].map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 cursor-pointer group"
                    title={social.label}
                  >
                    <social.icon className="h-4 w-4 text-blue-200 group-hover:text-white group-hover:scale-110 transition-all duration-200" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-16 pt-8 border-t border-white/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              { value: "500+", label: "活跃学员", icon: Users },
              { value: "12+", label: "精品课程", icon: BookOpen },
              { value: "50+", label: "模拟会议", icon: Scale },
              { value: "98%", label: "好评率", icon: Sparkles },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <stat.icon className="h-5 w-5 text-amber-300" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
                <div className="font-mono text-xs text-blue-200 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <p className="font-mono text-sm text-blue-200">
              © {new Date().getFullYear()} 议起读平台. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-blue-200">
              <span className="font-mono text-xs">Made with</span>
              <Heart className="h-3 w-3 text-red-400 fill-current animate-pulse" />
              <span className="font-mono text-xs">for democracy</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex gap-4 font-mono text-xs text-blue-300">
              <span className="hover:text-white transition-colors cursor-pointer">隐私政策</span>
              <span className="hover:text-white transition-colors cursor-pointer">使用条款</span>
              <span className="hover:text-white transition-colors cursor-pointer">帮助中心</span>
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-200 cursor-pointer group"
              title="回到顶部"
            >
              <ArrowUp className="h-4 w-4 text-blue-200 group-hover:text-white group-hover:-translate-y-0.5 transition-all duration-200" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
