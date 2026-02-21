"use client";

import Link from "next/link";
import { Loader2, UserCircle2, KeyRound, AlertTriangle, BookMarked, UserPlus2, FileSignature } from "lucide-react";
import { useRegister } from "../../../core/hooks/useRegister";
import styles from "./copper.module.css";

export default function CopperRegisterView() {
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
        <div className={`${styles.copper_root} relative min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 overflow-hidden`}>
            <div className={styles.radial_overlay} />

            <main className="relative z-10 w-full max-w-4xl grid md:grid-cols-5 gap-10 items-stretch my-12">
                {/* Left Side: Classic Welcome */}
                <div className="md:col-span-2 flex flex-col justify-center text-center md:text-left">
                    <div className="mb-6 flex justify-center md:justify-start">
                        <div className="p-3 bg-amber-100 text-amber-900 rounded-full border border-amber-200 shadow-sm">
                            <BookMarked className="h-8 w-8" />
                        </div>
                    </div>
                    <h2 className={`text-4xl lg:text-5xl text-slate-800 leading-tight mb-4 ${styles.heading_serif}`}>
                        开启深度的<br />
                        <span className="text-amber-700 italic">议事修养</span>。
                    </h2>
                    <p className={`${styles.body_serif} text-lg text-slate-600 leading-relaxed mb-8 max-w-sm mx-auto md:mx-0`}>
                        注册并获取您的学籍记录。
                        通过研读规则、思辨案例，建立您在组织管理中的权威与素养。
                    </p>
                    <div className="h-px w-24 bg-gradient-to-r from-amber-700/50 to-transparent mx-auto md:mx-0"></div>
                </div>

                {/* Right Side: Elegant Form */}
                <div className={`md:col-span-3 ${styles.copper_card} p-10 md:p-14`}>
                    <div className="text-center mb-10">
                        <h3 className={`${styles.heading_serif} text-2xl text-slate-900 mb-2`}>新建学籍档案</h3>
                        <p className="text-sm text-slate-500 uppercase tracking-widest">Enrollment & Registration</p>
                    </div>

                    {(error || announcement) && (
                        <div className={`mb-8 border p-4 flex items-center gap-3 ${error ? 'border-red-200 bg-red-50 text-red-800' : 'border-blue-200 bg-blue-50 text-blue-800'}`}>
                            <AlertTriangle className="h-5 w-5 shrink-0" />
                            <p className={`${styles.body_serif} text-base`}>{error || announcement}</p>
                        </div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-2 px-1 uppercase tracking-wider">身份标识 Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <UserPlus2 className="h-5 w-5 text-slate-400 group-focus-within:text-amber-700 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    data-testid="register-username"
                                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3.5 pl-12 focus:border-amber-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20 transition-all shadow-inner"
                                    placeholder="设定您的独有标识 (3-32位字母/数字)"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    minLength={3}
                                    maxLength={32}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-semibold text-slate-700 block mb-2 px-1 uppercase tracking-wider">对外称呼 Nickname (Optional)</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                    <FileSignature className="h-5 w-5 text-slate-400 group-focus-within:text-amber-700 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    data-testid="register-nickname"
                                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3.5 pl-12 focus:border-amber-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20 transition-all shadow-inner"
                                    placeholder="可选项：设定您的公开称呼"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    maxLength={32}
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
                                    data-testid="register-password"
                                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 p-3.5 pl-12 focus:border-amber-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700/20 transition-all shadow-inner"
                                    placeholder="设定您的密码 (至少8位字符)"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            data-testid="register-submit"
                            disabled={loading || settingsLoading || !registrationEnabled}
                            className={`w-full ${styles.btn_copper} flex items-center justify-center h-14 mt-8 shadow-md hover:shadow-lg`}
                        >
                            {(loading || settingsLoading) && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                            {settingsLoading ? "确认入学名额中..." : registrationEnabled ? "登记档案并进入" : "招生登记暂时停止"}
                        </button>
                    </form>

                    <div className="mt-10 pt-8 border-t border-slate-200 text-center">
                        <span className={`${styles.body_serif} text-slate-500 mr-2 text-base`}>已有讲堂记录？</span>
                        <Link href="/login" className="text-amber-700 hover:text-amber-900 transition-colors font-semibold uppercase tracking-wider text-sm border-b border-amber-700/30 hover:border-amber-900 pb-0.5">
                            请移步验证通道
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
}
