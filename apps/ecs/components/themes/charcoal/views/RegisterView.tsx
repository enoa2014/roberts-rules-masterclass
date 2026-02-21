"use client";

import Link from "next/link";
import { Loader2, Terminal, ShieldAlert, Flag } from "lucide-react";
import { useRegister } from "../../../core/hooks/useRegister";
import styles from "./charcoal.module.css";

export default function CharcoalRegisterView() {
    const {
        username, setUsername,
        password, setPassword,
        nickname, setNickname,
        loading,
        error,
        registrationEnabled,
        settingsLoading,
        announcement,
        handleSubmit
    } = useRegister();

    return (
        <div className={`${styles.charcoal_root} relative min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 overflow-hidden`}>
            <div className={styles.grid_overlay} />

            <main className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
                {/* Left Side: Brutalist Welcome */}
                <div className="flex flex-col justify-center space-y-6">
                    <div className="inline-flex items-center gap-2 border-2 border-emerald-500 text-emerald-400 font-mono text-xs px-3 py-1 uppercase max-w-max">
                        <Flag className="h-3 w-3" />
                        <span>网关入口: 注册节点 / REG 3.1.0</span>
                    </div>

                    <h2 className={`text-4xl md:text-5xl font-black text-slate-50 leading-none tracking-tighter ${styles.title_glitch}`}>
                        建立档案<br />
                        <span className="text-emerald-500">分配系统配额.</span>
                    </h2>
                    <p className="text-slate-400 font-mono text-base leading-relaxed mb-4">
                        {"// REGISTER PROTOCOL"}<br />
                        提交基本标识信息，获取初始访问权限。与集群网络建立信任连接。
                    </p>

                    <div className="flex gap-6 mt-4 font-mono text-xs">
                        <div className="border border-slate-700 p-3 bg-slate-900/50">
                            <div className="text-emerald-500 mb-1">[ NODE 1 ]</div>
                            <div className="text-slate-300">身份验证</div>
                        </div>
                        <div className="border border-slate-700 p-3 bg-slate-900/50 opacity-50">
                            <div className="text-slate-500 mb-1">[ NODE 2 ]</div>
                            <div className="text-slate-500">配额下发</div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Brutalist Form */}
                <div className={`${styles.brutalist_card} p-8 md:p-12 mb-8 md:mb-0`}>
                    <div className="mb-8 border-b-2 border-slate-700 pb-4">
                        <div className="flex items-center gap-3 text-emerald-500 mb-2">
                            <Terminal className="h-6 w-6" />
                            <span className="font-extrabold text-xl uppercase tracking-widest">终端接入登记</span>
                        </div>
                        <p className="font-mono text-xs text-slate-400 uppercase">Input initialization data</p>
                    </div>

                    {(error || announcement) && (
                        <div className={`mb-6 border-2 p-4 flex items-start gap-3 ${error ? 'border-red-500 bg-red-950/50 text-red-500' : 'border-blue-500 bg-blue-950/50 text-blue-500'}`}>
                            <ShieldAlert className="h-5 w-5 shrink-0" />
                            <p className="font-mono text-sm leading-tight">{error || announcement}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="font-mono text-sm font-bold text-emerald-500 uppercase block mb-2">
                                &gt; NEW_USERNAME_
                            </label>
                            <input
                                type="text"
                                required
                                data-testid="register-username"
                                className="w-full bg-slate-900/80 border-2 border-slate-600 text-slate-100 p-3 font-mono focus:border-emerald-500 focus:outline-none transition-colors"
                                placeholder="[请输入用户名]"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                minLength={3}
                                maxLength={32}
                            />
                        </div>

                        <div>
                            <label className="font-mono text-sm font-bold text-emerald-500 uppercase block mb-2">
                                &gt; NICKNAME_ (OPTIONAL)
                            </label>
                            <input
                                type="text"
                                data-testid="register-nickname"
                                className="w-full bg-slate-900/80 border-2 border-slate-600 text-slate-100 p-3 font-mono focus:border-emerald-500 focus:outline-none transition-colors"
                                placeholder="[设定公共显示标识]"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                maxLength={32}
                            />
                        </div>

                        <div>
                            <label className="font-mono text-sm font-bold text-emerald-500 uppercase block mb-2">
                                &gt; INIT_PASSWORD_
                            </label>
                            <input
                                type="password"
                                required
                                data-testid="register-password"
                                className="w-full bg-slate-900/80 border-2 border-slate-600 text-slate-100 p-3 font-mono focus:border-emerald-500 focus:outline-none transition-colors"
                                placeholder="[设定验证秘钥]"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={8}
                            />
                        </div>

                        <button
                            type="submit"
                            data-testid="register-submit"
                            disabled={loading || settingsLoading || !registrationEnabled}
                            className={`w-full ${styles.btn_brutalist} flex items-center justify-center`}
                        >
                            {(loading || settingsLoading) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {settingsLoading ? "[ 建立系统链接... ]" : registrationEnabled ? "[ 写入系统档案 ]" : "[ 注册通道锁定 ]"}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-slate-700 text-center font-mono text-sm">
                        <span className="text-slate-500 mr-2">已有配额?</span>
                        <Link href="/login" className="text-emerald-500 hover:text-emerald-400 transition-colors uppercase font-bold underline decoration-emerald-500/30 underline-offset-4">
                            [ 执行验证序列/登录 ]
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
