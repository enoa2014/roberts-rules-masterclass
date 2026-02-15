import Link from "next/link";
import { GraduationCap, Mail, MessageCircle } from "lucide-react";

export function SiteFooter() {
    return (
        <footer className="bg-slate-900 text-white">
            <div className="container py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-2.5">
                            <div className="h-9 w-9 gradient-primary rounded-xl flex items-center justify-center">
                                <GraduationCap className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-extrabold">议起读</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                            致力于推广罗伯特议事规则，帮助青少年提升公共议事能力与公民素养。
                            从理论学习到模拟议事，全方位掌握议事规则。
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-white text-sm uppercase tracking-wider">
                            快速链接
                        </h4>
                        <ul className="space-y-3">
                            {[
                                { label: "课程体系", href: "/course" },
                                { label: "关于我们", href: "/about" },
                                { label: "常见问题", href: "/faq" },
                                { label: "互动课堂", href: "/interact" },
                            ].map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-slate-400 hover:text-white transition-colors duration-200 cursor-pointer"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-white text-sm uppercase tracking-wider">
                            联系我们
                        </h4>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2.5 text-sm text-slate-400">
                                <Mail className="h-4 w-4 text-blue-400 flex-shrink-0" />
                                <span>contact@yiqidu.com</span>
                            </li>
                            <li className="flex items-center gap-2.5 text-sm text-slate-400">
                                <MessageCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                                <span>微信公众号：议起读</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-slate-500">
                        © {new Date().getFullYear()} 议起读平台. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs text-slate-500">
                        <span className="hover:text-slate-300 transition-colors cursor-pointer">隐私政策</span>
                        <span className="hover:text-slate-300 transition-colors cursor-pointer">使用条款</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
