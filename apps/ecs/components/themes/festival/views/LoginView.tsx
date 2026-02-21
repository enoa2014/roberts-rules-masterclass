"use client";

import Link from "next/link";
import { Loader2, ArrowRight, UserCircle, Key, AlertCircle, PartyPopper } from "lucide-react";
import { useLogin } from "../../../core/hooks/useLogin";
import { motion } from "framer-motion";
import styles from "./festival.module.css";

export default function FestivalLoginView({ callbackUrl }: { callbackUrl: string }) {
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
        <div className={`relative min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 overflow-hidden ${styles.fc_root}`}>
            {/* Decorative Blob pattern from local festival styles */}
            <div className={`absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-rose-500/20 to-orange-400/20 rounded-full blur-3xl ${styles.fc_animate_float}`} />
            <div className={`absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-l from-blue-500/20 to-purple-500/20 rounded-full blur-3xl ${styles.fc_animate_float} ${styles.fc_delay_300}`} />

            <main className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 lg:gap-16 items-center">
                {/* Left Side: Vibrant Welcome */}
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="hidden md:flex flex-col justify-center space-y-6 lg:ml-8">
                    <div className={`inline-flex items-center gap-2 ${styles.fc_badge} px-4 py-2 font-black uppercase max-w-max ${styles.fc_animate_glow} shadow-md`}>
                        <PartyPopper className="h-4 w-4 text-rose-600" />
                        <span className="text-rose-700">课堂活力枢纽</span>
                    </div>

                    <h2 className={`${styles.fc_title_hero} text-5xl lg:text-6xl font-black text-rose-600 leading-tight drop-shadow-sm`}>
                        激发互动能量<br />
                        <span className="text-blue-600">重塑协作阵地！</span>
                    </h2>
                    <p className="text-slate-600 text-lg leading-relaxed mb-8 max-w-md font-medium">
                        以活力与热情驱动议事规则实践，携手同行建立高互动的多维协作课堂。输入你的活力印章，继续燃爆全场！
                    </p>
                </motion.div>

                {/* Right Side: Form */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
                    <div className={`${styles.fc_card} p-8 md:p-10 shadow-2xl relative overflow-hidden bg-white/90 backdrop-blur-xl border-t border-l border-white/60 mx-auto max-w-md md:max-w-full`}>
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 to-blue-500" />

                        <div className="mb-8 text-center pt-4">
                            <h3 className="text-2xl font-black text-slate-800 mb-2">进入活力网络</h3>
                            <p className="text-slate-500 font-bold text-sm">Welcome back to the Festival!</p>
                        </div>

                        {error && (
                            <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="mb-6 rounded-2xl bg-rose-50 border border-rose-200 p-4 text-rose-600 flex items-center gap-3">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <p className="font-bold text-sm leading-tight">{error}</p>
                            </motion.div>
                        )}

                        <form className="space-y-6" onSubmit={handleUsernameLogin}>
                            <div>
                                <label className="text-sm font-black text-slate-700 block mb-2 px-1">学籍名片</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <UserCircle className="h-5 w-5 text-indigo-300 group-focus-within:text-rose-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        data-testid="login-username"
                                        className="w-full h-12 bg-slate-50 border-2 border-indigo-100/50 rounded-xl pl-11 pr-4 text-slate-900 font-bold focus:border-rose-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-400/20 transition-all placeholder:text-slate-300 placeholder:font-normal"
                                        placeholder="输入用户名录..."
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-sm font-black text-slate-700 block mb-2 px-1">安全口令</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <Key className="h-5 w-5 text-indigo-300 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        data-testid="login-password"
                                        className="w-full h-12 bg-slate-50 border-2 border-indigo-100/50 rounded-xl pl-11 pr-4 text-slate-900 font-bold focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-400/20 transition-all placeholder:text-slate-300 placeholder:font-normal"
                                        placeholder="输入校验凭证..."
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                data-testid="login-submit"
                                disabled={loading}
                                className={`w-full ${styles.fc_btn} ${styles.fc_btn_primary} h-14 mt-4 shadow-xl shadow-rose-500/20 hover:shadow-orange-500/30 flex items-center justify-center font-black text-lg group`}
                            >
                                {loading && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                连接系统 <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </motion.button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100 text-center font-bold text-sm">
                            <span className="text-slate-400 mr-2">首期活力体验？</span>
                            <Link href="/register" className="text-rose-600 hover:text-blue-600 transition-colors">
                                抓紧获取资格！
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
