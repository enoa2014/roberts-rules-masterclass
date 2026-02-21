"use client";

import Link from "next/link";
import { Loader2, ArrowRight, UserCircle2, KeyRound, AlertTriangle, BookMarked } from "lucide-react";
import { useLogin } from "../../../core/hooks/useLogin";
import styles from "./copper.module.css";

export default function CopperLoginView({ callbackUrl }: { callbackUrl: string }) {
    const {
        username,
        setUsername,
        password,
        setPassword,
        loading,
        error,
        handleUsernameLogin,
    } = useLogin(callbackUrl);

    return (
        <div className={`${styles.copper_root} relative min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 overflow-hidden`}>
            <div className={styles.radial_overlay} />

            <main className="relative z-10 w-full max-w-4xl grid md:grid-cols-5 gap-10 items-stretch my-12">
                {/* Left Side: Classic Welcome */}
                <div className="md:col-span-2 flex flex-col justify-center text-center md:text-left">
                    <div className="mb-6 flex justify-center md:justify-start">
                        <div className="p-3 bg-amber-100 text-amber-900 rounded-full border border-amber-200">
                            <BookMarked className="h-8 w-8" />
                        </div>
                    </div>
                    <h2 className={`text-4xl lg:text-5xl text-slate-800 leading-tight mb-4 ${styles.heading_serif}`}>
                        重拾经典的<br />
                        <span className="text-amber-700 italic">议事修养</span>。
                    </h2>
                    <p className={`${styles.body_serif} text-lg text-slate-600 leading-relaxed mb-8 max-w-sm mx-auto md:mx-0`}>
                        欢迎回到讲堂。
                        在系统的理论沉淀与严谨的案例剖析中，稳步提升您在复杂协作环境下的表达、倾听与组织能力。
                    </p>
                    <div className="h-px w-24 bg-gradient-to-r from-amber-700/50 to-transparent mx-auto md:mx-0"></div>
                </div>

                {/* Right Side: Elegant Form */}
                <div className={`md:col-span-3 ${styles.copper_card} p-10 md:p-14`}>
                    <div className="text-center mb-10">
                        <h3 className={`${styles.heading_serif} text-2xl text-slate-900 mb-2`}>讲堂出入许可</h3>
                        <p className="text-sm text-slate-500 uppercase tracking-widest">Login & Authenticate</p>
                    </div>

                    {error && (
                        <div className="mb-8 border border-red-200 bg-red-50 p-4 text-red-800 flex items-center gap-3">
                            <AlertTriangle className="h-5 w-5 shrink-0" />
                            <p className={`${styles.body_serif} text-base`}>{error}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleUsernameLogin}>
                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-2 px-1 uppercase tracking-wider">身份凭证 Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <UserCircle2 className="h-5 w-5 text-slate-400 group-focus-within:text-amber-700 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    data-testid="login-username"
                                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3.5 pl-12 focus:border-amber-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20 transition-all shadow-inner"
                                    placeholder="在此输入您的用户名"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-2 px-1 uppercase tracking-wider">验证密钥 Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <KeyRound className="h-5 w-5 text-slate-400 group-focus-within:text-amber-700 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    data-testid="login-password"
                                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3.5 pl-12 focus:border-amber-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20 transition-all shadow-inner"
                                    placeholder="在此输入您的密码"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            data-testid="login-submit"
                            disabled={loading}
                            className={`w-full ${styles.btn_copper} flex items-center justify-center h-14 mt-8 shadow-md hover:shadow-lg`}
                        >
                            {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            验证并进入
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-200 text-center">
                        <span className={`${styles.body_serif} text-slate-500 mr-2 text-base`}>尚未注册学籍？</span>
                        <Link href="/register" className="text-amber-700 hover:text-amber-900 transition-colors font-semibold uppercase tracking-wider text-sm border-b border-amber-700/30 hover:border-amber-900 pb-0.5">
                            立即登记注册
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
