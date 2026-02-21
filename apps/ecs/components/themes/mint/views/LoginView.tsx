"use client";

import Link from "next/link";
import { Loader2, ArrowRight, UserCircle, KeyRound, AlertCircle, Smile } from "lucide-react";
import { useLogin } from "../../../core/hooks/useLogin";
import { motion, Variants } from "framer-motion";
import styles from "./mint.module.css";

export default function MintLoginView({ callbackUrl }: { callbackUrl: string }) {
    const {
        username,
        setUsername,
        password,
        setPassword,
        loading,
        error,
        handleUsernameLogin,
    } = useLogin(callbackUrl);

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

            <motion.main initial="hidden" animate="visible" variants={containerVariants} className="relative z-10 w-full max-w-lg mb-12">
                <motion.div variants={itemVariants} className={`${styles.mint_card} p-8 md:p-12`}>
                    <div className="text-center mb-8">
                        <div className="mx-auto h-20 w-20 bg-orange-100 text-orange-500 rounded-full flex flex-col items-center justify-center mb-6 border-4 border-white shadow-xl">
                            <Smile className="h-10 w-10 absolute -mt-2" />
                        </div>
                        <h2 className="text-3xl font-black text-teal-900 tracking-tight">你好呀，欢迎回来！</h2>
                        <p className="mt-3 text-teal-700/80 font-bold">登录你的账号，开启一段有趣的实践之旅~</p>
                    </div>

                    {error && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mb-8 rounded-3xl bg-red-100 border-2 border-red-500 p-4 flex items-center gap-3">
                            <AlertCircle className="h-6 w-6 text-red-500 shrink-0" />
                            <p className="text-sm font-bold text-red-800">{error}</p>
                        </motion.div>
                    )}

                    <form className="space-y-6" onSubmit={handleUsernameLogin}>
                        <div>
                            <label className="text-sm font-bold text-teal-800 block mb-2 px-2">是谁呢？</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
                                    <UserCircle className="h-6 w-6 text-teal-300 group-focus-within:text-teal-600 transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    data-testid="login-username"
                                    className="w-full h-14 bg-teal-50/50 border-3 border-teal-100 rounded-2xl pl-14 pr-6 text-teal-900 font-bold focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all"
                                    placeholder="填写用户名~"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
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
                                    data-testid="login-password"
                                    className="w-full h-14 bg-teal-50/50 border-3 border-teal-100 rounded-2xl pl-14 pr-6 text-teal-900 font-bold focus:border-teal-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-teal-500/20 transition-all"
                                    placeholder="保护好自己的密码哦"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.95 }}
                            type="submit"
                            data-testid="login-submit"
                            disabled={loading}
                            className={`w-full ${styles.mint_btn} justify-center h-16 text-lg mt-4`}
                        >
                            {loading && <Loader2 className="mr-2 h-6 w-6 animate-spin" />}
                            Let&apos;s Go!
                        </motion.button>
                    </form>

                    <div className="mt-10 text-center flex flex-col items-center gap-3">
                        <span className="text-teal-700 font-bold">还没有通行证？</span>
                        <Link href="/register" className={styles.mint_btn_accent}>
                            🎉 免费注册一个 <ArrowRight className="inline h-5 w-5 ml-2" />
                        </Link>
                    </div>
                </motion.div>
            </motion.main>
        </div>
    );
}
