"use client";

import Link from "next/link";
import { Loader2, Terminal, ShieldAlert, ArrowRight, Flag } from "lucide-react";
import { useLogin } from "../../../core/hooks/useLogin";
import styles from "./charcoal.module.css";

export default function CharcoalLoginView({ callbackUrl }: { callbackUrl: string }) {
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
        <div className={`${styles.charcoal_root} relative min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 overflow-hidden`}>
            <div className={styles.grid_overlay} />

            <main className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
                {/* Left Side: Brutalist Welcome */}
                <div className="flex flex-col justify-center space-y-6">
                    <div className="inline-flex items-center gap-2 border-2 border-emerald-500 text-emerald-400 font-mono text-xs px-3 py-1 uppercase max-w-max">
                        <Flag className="h-3 w-3" />
                        <span>网关入口: 在线 / AUTH 2.0.4</span>
                    </div>

                    <h2 className={`text-4xl md:text-5xl font-black text-slate-50 leading-none tracking-tighter ${styles.title_glitch}`}>
                        掌握规则<br />
                        <span className="text-emerald-500">获取系统权限.</span>
                    </h2>
                    <p className="text-slate-400 font-mono text-base leading-relaxed mb-8">
                        LOGIN PROTOCOL<br />
                        通过架构化规则验证您的身份标识，解锁全部课程节点与课堂实战资源。
                    </p>
                </div>

                {/* Right Side: Brutalist Form */}
                <div className={`${styles.brutalist_card} p-8 md:p-12 mb-8 md:mb-0`}>
                    <div className="mb-8 border-b-2 border-slate-700 pb-4">
                        <div className="flex items-center gap-3 text-emerald-500 mb-2">
                            <Terminal className="h-6 w-6" />
                            <span className="font-extrabold text-xl uppercase tracking-widest">终端验证</span>
                        </div>
                        <p className="font-mono text-xs text-slate-400 uppercase">Input your credentials below</p>
                    </div>

                    {error && (
                        <div className="mb-6 border-2 border-red-500 bg-red-950/50 p-4 text-red-500 flex items-start gap-3">
                            <ShieldAlert className="h-5 w-5 shrink-0" />
                            <p className="font-mono text-sm leading-tight">{error}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleUsernameLogin}>
                        <div>
                            <label className="font-mono text-sm font-bold text-emerald-500 uppercase block mb-2">
                                &gt; USERNAME_
                            </label>
                            <input
                                type="text"
                                required
                                data-testid="login-username"
                                className="w-full bg-slate-900/80 border-2 border-slate-600 text-slate-100 p-3 font-mono focus:border-emerald-500 focus:outline-none transition-colors"
                                placeholder="[请输入用户名]"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="font-mono text-sm font-bold text-emerald-500 uppercase block mb-2">
                                &gt; PASSWORD_
                            </label>
                            <input
                                type="password"
                                required
                                data-testid="login-password"
                                className="w-full bg-slate-900/80 border-2 border-slate-600 text-slate-100 p-3 font-mono focus:border-emerald-500 focus:outline-none transition-colors"
                                placeholder="[请输入验证秘钥]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            data-testid="login-submit"
                            disabled={loading}
                            className={`w-full ${styles.btn_brutalist} flex items-center justify-center`}
                        >
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            [ 执行验证序列 ]
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-700 text-center font-mono text-sm">
                        <span className="text-slate-500 mr-2">未授权节点?</span>
                        <Link href="/register" className="text-emerald-500 hover:text-emerald-400 transition-colors uppercase font-bold underline decoration-emerald-500/30 underline-offset-4">
                            [ 申请权限配额/注册 ]
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
