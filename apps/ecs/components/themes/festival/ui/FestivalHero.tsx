"use client";

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Sparkles, Flag, Flame, Heart, Users, BookOpen, Vote, Award } from 'lucide-react';
import { HOME_METRICS } from '../../../core/data/home-content';
import styles from '../views/festival.module.css';

const MOCK_AVATARS = [
    'https://ui-avatars.com/api/?name=张+三&background=be123c&color=fff',
    'https://ui-avatars.com/api/?name=李+四&background=2563eb&color=fff',
    'https://ui-avatars.com/api/?name=王+五&background=e11d48&color=fff',
    'https://ui-avatars.com/api/?name=A+B&background=d946ef&color=fff',
];

const getIcon = (type: string) => {
    switch (type) {
        case 'users': return <Users className="h-6 w-6" />;
        case 'book': return <BookOpen className="h-6 w-6" />;
        case 'vote': return <Vote className="h-6 w-6" />;
        case 'award': return <Award className="h-6 w-6" />;
        default: return <Users className="h-6 w-6" />;
    }
};

export default function FestivalHero() {
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
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 100, damping: 12 }
        }
    };

    const floatVariants: Variants = {
        hover: {
            y: -10,
            scale: 1.05,
            transition: { type: 'spring', stiffness: 300, damping: 10 }
        }
    };

    return (
        <section className="relative px-4 py-20 md:py-28 max-w-7xl mx-auto flex flex-col items-center justify-center min-h-[85vh]">
            {/* 活跃指示物 */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute top-[15%] left-[10%] hidden lg:flex flex-col items-center gap-2 p-4 rounded-3xl bg-white/60 backdrop-blur-md shadow-xl border border-white/50"
            >
                <div className="flex -space-x-3 mb-1">
                    {MOCK_AVATARS.map((src, i) => (
                        <img key={i} src={src} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="avatar" />
                    ))}
                </div>
                <div className="text-xs font-bold text-rose-800 flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span>正在开课中</span>
                </div>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="text-center relative z-10 w-full"
            >
                {/* Badge */}
                <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white shadow-lg border border-rose-100 text-rose-600 font-bold mb-8 mx-auto hover:shadow-xl transition-all shadow-rose-200/50">
                    <Flag className="h-4 w-4" />
                    <span>活力课堂 · 规则研修版块</span>
                    <Sparkles className="h-4 w-4 text-amber-400" />
                </motion.div>

                {/* Hero Title */}
                <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 text-gray-900 leading-[1.15]">
                    掌握议事规则 <br />
                    <span className={`${styles.hero_title_gradient} relative inline-block`}>
                        提升课堂沟通力
                        <svg className="absolute w-full h-4 -bottom-1 left-0 text-rose-500/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                            <path d="M0,5 Q50,15 100,5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                        </svg>
                    </span>
                </motion.h1>

                {/* Hero Subject */}
                <motion.p variants={itemVariants} className="text-xl md:text-2xl text-rose-800/80 font-medium max-w-3xl mx-auto mb-12">
                    加入面向教师与家长的活力课堂培训！在轻松的体验和交互氛围中
                    <br className="hidden md:block" />掌握罗伯特议事规则，提升课堂讨论的组织效率。
                </motion.p>

                {/* CTA Banner */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center mb-20">
                    <Link href="/course">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`bg-rose-600 text-white px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 shadow-rose-600/40 shadow-xl ${styles.btn}`}
                        >
                            <Flame className="h-5 w-5" />
                            <span>立即参与培训</span>
                        </motion.div>
                    </Link>
                    <Link href="/about">
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-rose-600 px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-2 shadow-lg border-2 border-rose-100 hover:border-rose-200 hover:bg-rose-50 transition-colors"
                        >
                            <Heart className="h-5 w-5" />
                            <span>了解活力体系</span>
                        </motion.div>
                    </Link>
                </motion.div>

                {/* Floating Data Cards */}
                <motion.div
                    variants={containerVariants}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 px-4"
                >
                    {HOME_METRICS.map((metric, i) => (
                        <motion.div
                            key={metric.id}
                            variants={itemVariants}
                            whileHover="hover"
                            className={`${styles.card_glass} p-6 rounded-[2rem] flex flex-col items-center justify-center group overflow-hidden relative`}
                        >
                            {/* Highlight sweep */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                            <motion.div variants={floatVariants} className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/30 mb-4 z-10">
                                {getIcon(metric.iconType)}
                            </motion.div>
                            <div className="text-4xl font-black text-gray-900 mb-1 z-10">{metric.value}</div>
                            <div className="text-sm font-bold text-rose-600 tracking-wider uppercase z-10">{metric.labelMap['festival-civic']}</div>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
