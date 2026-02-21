"use client";

import Link from "next/link";
import { Loader2, ArrowRight, UserPlus, Key, AlertCircle, PartyPopper, UserCircle2 } from "lucide-react";
import { useRegister } from "../../../core/hooks/useRegister";
import { motion } from "framer-motion";
import styles from "./festival.module.css";

export default function FestivalRegisterView() {
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
        <div className={`relative min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 overflow-hidden ${styles.fc_root}`}>
            {/* Decorative Blob pattern from local festival styles */}
            <div className={`absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-rose-500/20 to-orange-400/20 rounded-full blur-3xl ${styles.fc_animate_float}`} />
            <div className={`absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-l from-blue-500/20 to-purple-500/20 rounded-full blur-3xl ${styles.fc_animate_float} ${styles.fc_delay_300}`} />

            <main className="relative z-10 w-full max-w-5xl grid md:grid-cols-2 lg:gap-16 items-center my-8">
                {/* Left Side: Vibrant Welcome */}
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }} className="hidden md:flex flex-col justify-center space-y-6 lg:ml-8">
                    <div className={`inline-flex items-center gap-2 ${styles.fc_badge} px-4 py-2 font-black uppercase max-w-max ${styles.fc_animate_glow} shadow-md`}>
                        <PartyPopper className="h-4 w-4 text-rose-600" />
                        <span className="text-rose-700">新成员招募中</span>
                    </div>

                    <h2 className={`${styles.fc_title_hero} text-5xl lg:text-6xl font-black text-rose-600 leading-tight drop-shadow-sm`}>
                        释放学习潜能<br />
                        <span className="text-blue-600">加入我们的派对！</span>
                    </h2>

                    <div className="flex flex-col gap-4 mt-8 opacity-90">
                        <div className="flex items-center gap-4 bg-white/40 p-3 rounded-2xl">
                            <div className="bg-rose-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-rose-500/30">1</div>
                            <span className="font-bold text-slate-800 tracking-wide">创建充满个性的专属账号</span>
                        </div>
                        <div className="flex items-center gap-4 bg-white/40 p-3 rounded-2xl">
                            <div className="bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/30">2</div>
                            <span className="font-bold text-slate-800 tracking-wide">随时加入活跃的互动课堂</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Form */}
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4, delay: 0.1 }}>
                    <div className={`${styles.fc_card} p-8 md:p-10 shadow-2xl relative overflow-hidden bg-white/90 backdrop-blur-xl border-t border-l border-white/60 mx-auto max-w-md md:max-w-full`}>
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-rose-500 to-blue-500" />

                        <div className="mb-8 text-center pt-4">
                            <h3 className={`${styles.fc_title_hero} text-3xl text-slate-900 mb-2`}>登记你的通行证</h3>
                            <p className="text-slate-500 font-medium">Join the Community</p>
                        </div>

                        {(error || announcement) && (
                            <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-blue-50 border-blue-200 text-blue-700'}`}>
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <p className="text-sm font-bold">{error || announcement}</p>
                            </motion.div>
                        )}

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="space-y-1">
                                <label className="text-sm font-black text-indigo-900 uppercase tracking-wider ml-1">用户名标识 LOGIN ID</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <UserPlus className="h-5 w-5 text-indigo-300 group-focus-within:text-rose-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        data-testid="register-username"
                                        className="w-full h-12 bg-slate-50 border-2 border-indigo-100/50 rounded-xl pl-11 pr-4 text-slate-900 font-bold focus:border-rose-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-400/20 transition-all placeholder:text-slate-300 placeholder:font-normal"
                                        placeholder="填写你的大名 (限英文字母或数字)..."
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        minLength={3}
                                        maxLength={32}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-black text-indigo-900 uppercase tracking-wider ml-1">趣味昵称 NICKNAME</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <UserCircle2 className="h-5 w-5 text-indigo-300 group-focus-within:text-rose-500 transition-colors" />
                                    </div>
                                    <input
                                        type="text"
                                        data-testid="register-nickname"
                                        className="w-full h-12 bg-slate-50 border-2 border-indigo-100/50 rounded-xl pl-11 pr-4 text-slate-900 font-bold focus:border-rose-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-rose-400/20 transition-all placeholder:text-slate-300 placeholder:font-normal"
                                        placeholder="(选填) 大家怎么称呼你比较酷？"
                                        value={nickname}
                                        onChange={(e) => setNickname(e.target.value)}
                                        maxLength={32}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-sm font-black text-indigo-900 uppercase tracking-wider ml-1">专属护符 PASSWORD</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                                        <Key className="h-5 w-5 text-indigo-300 group-focus-within:text-blue-500 transition-colors" />
                                    </div>
                                    <input
                                        type="password"
                                        required
                                        data-testid="register-password"
                                        className="w-full h-12 bg-slate-50 border-2 border-indigo-100/50 rounded-xl pl-11 pr-4 text-slate-900 font-bold focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-400/20 transition-all placeholder:text-slate-300 placeholder:font-normal"
                                        placeholder="请至少输入 8 个隐藏字符..."
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        minLength={8}
                                    />
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                data-testid="register-submit"
                                disabled={loading || settingsLoading || !registrationEnabled}
                                className={`w-full ${styles.fc_btn} ${styles.fc_btn_primary} h-14 mt-4 shadow-xl shadow-rose-500/20 hover:shadow-orange-500/30 flex items-center justify-center font-black text-lg group`}
                            >
                                {(loading || settingsLoading) && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                                {settingsLoading ? "准备派对入场券..." : registrationEnabled ? <span>开启派对之旅 <ArrowRight className="inline ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" /></span> : "今天打烊不迎新"}
                            </motion.button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100 text-center flex flex-col items-center gap-2">
                            <span className="text-slate-400 font-bold">老熟人走这边！</span>
                            <Link href="/login" className="text-blue-500 hover:text-rose-500 transition-colors uppercase font-black tracking-widest text-sm flex items-center gap-1 group">
                                &lt; 返回登录大厅
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
}
