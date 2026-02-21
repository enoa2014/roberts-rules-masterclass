"use client";

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Star, UserPlus, Globe } from 'lucide-react';
import styles from '../views/festival.module.css';

export default function FestivalCTA() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, scale: 0.9, y: 50 },
        visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: { type: 'spring', stiffness: 100, damping: 15 }
        }
    };

    return (
        <section className="relative py-32 overflow-hidden z-20">
            {/* Dynamic Background with CSS Module and framer-motion */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-rose-500 to-blue-600"></div>

            {/* Particle/Bubble Overlays */}
            <motion.div
                animate={{ y: [0, -20, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-10 left-[10%] w-48 h-48 bg-white/10 rounded-full blur-2xl block"
            />
            <motion.div
                animate={{ y: [0, 30, 0], scale: [1, 1.1, 1] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute bottom-10 right-[20%] w-64 h-64 bg-blue-400/20 rounded-full blur-3xl block"
            />

            <div className="container max-w-4xl mx-auto px-4 relative z-10 text-center">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-bold mb-10 bg-white/20 backdrop-blur-md border border-white/30 text-white shadow-xl shadow-white/10">
                        <Star className="h-5 w-5 text-yellow-300" />
                        <span className="uppercase tracking-widest text-shadow-sm">加入课程</span>
                    </motion.div>

                    <motion.h2 variants={itemVariants} className="text-4xl md:text-6xl font-black mb-8 text-white tracking-tight drop-shadow-md">
                        准备好开始培训了吗？
                    </motion.h2>

                    <motion.p variants={itemVariants} className="max-w-2xl mx-auto mb-16 text-xl text-rose-100/90 leading-relaxed font-medium">
                        注册账号并输入邀请码，即可加入教师与家长培训课程。
                        <br className="hidden md:block" />
                        与更多教师与家长一同学习，形成可落地的课堂协作方法。
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 justify-center">
                        <Link href="/register">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className={`bg-white text-rose-600 px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 shadow-2xl hover:bg-rose-50 transition-colors ${styles.btn}`}
                            >
                                <UserPlus className="h-6 w-6" />
                                <span>立即加入课程</span>
                            </motion.div>
                        </Link>
                        <Link href="/course">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-transparent border-2 border-white/40 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 hover:bg-white/10 transition-colors backdrop-blur-sm"
                            >
                                <Globe className="h-6 w-6" />
                                <span>浏览活力课程</span>
                            </motion.div>
                        </Link>
                    </motion.div>

                    {/* Social Proof Stats */}
                    <motion.div variants={itemVariants} className="mt-20 pt-10 border-t border-white/20 flex flex-col items-center">
                        <p className="font-mono text-sm text-blue-100 mb-4 uppercase tracking-widest font-bold">
                            已有 500+ 学员加入课程
                        </p>
                        <div className="flex items-center gap-2 bg-white/10 px-6 py-3 rounded-full backdrop-blur-md border border-white/20 shadow-lg">
                            <div className="flex -space-x-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400 drop-shadow-sm" />
                                ))}
                            </div>
                            <span className="ml-3 font-bold text-rose-50 tracking-wider">
                                4.9/5.0 学员评分
                            </span>
                        </div>
                    </motion.div>

                </motion.div>
            </div>
        </section>
    );
}
