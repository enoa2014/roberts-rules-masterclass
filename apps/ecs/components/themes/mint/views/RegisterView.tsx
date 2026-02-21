"use client";

import Link from "next/link";
import { Loader2, ArrowRight, UserPlus, KeyRound, AlertCircle, Sparkles, SmilePlus } from "lucide-react";
import { useRegister } from "../../../core/hooks/useRegister";
import { motion, Variants } from "framer-motion";
import styles from "./mint.module.css";

export default function MintRegisterView() {
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

    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <div className={`${styles.mint_root} relative min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 overflow-hidden`}>
            <div className={styles.blob_bg_1} />
            <div className={styles.blob_bg_2} />

            <motion.main initial="hidden" animate="visible" variants={containerVariants} className="relative z-10 w-full max-w-lg my-12">
                <motion.div variants={itemVariants} className={`${styles.mint_card} p-8 md:p-12 mt-10`}>
                    <div className="text-center mb-8">
                        <div className="mx-auto h-20 w-20 bg-teal-100 text-teal-600 rounded-full flex flex-col items-center justify-center mb-6 border-4 border-white shadow-xl">
                            <Sparkles className="h-10 w-10 absolute -mt-2" />
                        </div>
                        <h2 className="text-3xl font-black text-teal-900 tracking-tight">你好呀，新朋友！</h2>
                        <p className="mt-3 text-teal-700/80 font-bold">给自己起个好听的名字，开启实践之旅~</p>
                    </div>

                    {(error || announcement) && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`mb-8 rounded-3xl p-4 flex items-center gap-3 ${error ? 'bg-red-100 border-2 border-red-500' : 'bg-blue-100 border-2 border-blue-400'}`}>
                            <AlertCircle className={`h-6 w-6 ${error ? 'text-red-500' : 'text-blue-500'} shrink-0`} />
                            <p className={`text-sm font-bold ${error ? 'text-red-800' : 'text-blue-800'}`}>{error || announcement}</p>
                        </motion.div>
                    )}

                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label className="text-sm font-bold text-teal-800 block mb-2 px-2">想叫什么名字呢？</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                                    <UserPlus className="h-6 w-6 text-teal-300 group-focus-within:text-teal-600 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    data-testid="register-username"
                                    className="w-full h-14 bg-teal-50/50 border-3 border-teal-100 rounded-2xl pl-14 pr-6 text-teal-900 font-bold focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all"
                                    placeholder="填个登录名吧~"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    minLength={3}
                                    maxLength={32}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-teal-800 block mb-2 px-2">昵称 (如果不填，那就叫上面的名字啦)</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                                    <SmilePlus className="h-6 w-6 text-teal-300 group-focus-within:text-teal-600 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    data-testid="register-nickname"
                                    className="w-full h-14 bg-teal-50/50 border-3 border-teal-100 rounded-2xl pl-14 pr-6 text-teal-900 font-bold focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all"
                                    placeholder="你在大家眼中的称呼"
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    maxLength={32}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm font-bold text-teal-800 block mb-2 px-2">专属密码！</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                                    <KeyRound className="h-6 w-6 text-teal-300 group-focus-within:text-teal-600 transition-colors" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    data-testid="register-password"
                                    className="w-full h-14 bg-teal-50/50 border-3 border-teal-100 rounded-2xl pl-14 pr-6 text-teal-900 font-bold focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all"
                                    placeholder="至少 8 位，千万保护好自己哦"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    minLength={8}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            data-testid="register-submit"
                            disabled={loading || settingsLoading || !registrationEnabled}
                            className={`w-full ${styles.mint_btn} justify-center h-16 text-lg mt-4`}
                        >
                            {(loading || settingsLoading) && <Loader2 className="mr-2 h-6 w-6 animate-spin" />}
                            {settingsLoading ? "正在连接网络..." : registrationEnabled ? "加入我们！" : "哎呀，现在无法注册"}
                        </motion.button>
                    </form>

                    <div className="mt-10 text-center flex flex-col items-center gap-3">
                        <span className="text-teal-700 font-bold">之前来过啦？</span>
                        <Link href="/login" className={styles.mint_btn_accent}>
                            😊 马上回家 <ArrowRight className="inline h-5 w-5 ml-2" />
                        </Link>
                    </div>
                </motion.div>
            </motion.main>
        </div>
    );
}
