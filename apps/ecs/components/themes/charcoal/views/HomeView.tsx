"use client";

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Shield, Sparkles, Flag, BookOpen, Users, Gavel, FileText } from 'lucide-react';
import { HOME_METRICS, HOME_FEATURES, HOME_STEPS } from '../../../core/data/home-content';
import styles from './charcoal.module.css';

const getIcon = (type: string, className: string = "h-6 w-6") => {
    switch (type) {
        case 'users': return <Users className={className} />;
        case 'book': return <BookOpen className={className} />;
        case 'gavel': return <Gavel className={className} />;
        case 'shield': return <Shield className={className} />;
        case 'file': return <FileText className={className} />;
        default: return <Sparkles className={className} />;
    }
};

export default function CharcoalHomeView() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: "linear" } }
    };

    return (
        <div className={`${styles.charcoal_root} relative`}>
            <div className={styles.grid_overlay} />

            <main className="relative z-10 container max-w-6xl mx-auto px-6 py-32 space-y-32">

                {/* HERO */}
                <section className="min-h-[70vh] flex flex-col justify-center">
                    <motion.div initial="hidden" animate="visible" variants={itemVariants} className="inline-flex items-center gap-2 border-2 border-emerald-500 text-emerald-400 font-mono text-sm px-4 py-1 uppercase mb-8">
                        <Flag className="h-4 w-4" />
                        <span>系统状态: 在线 / VERSION 2.0.4</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
                        className={`text-6xl md:text-8xl font-black text-slate-50 leading-none mb-6 tracking-tighter ${styles.title_glitch}`}
                    >
                        结构化议事<br />
                        <span className="text-emerald-500">提示协作效率.</span>
                    </motion.h1>

                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-xl md:text-2xl text-slate-400 max-w-2xl mb-12 font-mono">
                        构建结构化的议事框架！在清晰明确的学习体系中，精准掌握议事规则，提升课堂协作效率。
                    </motion.p>

                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="flex flex-wrap gap-6">
                        <Link href="/course" className={styles.btn_brutalist}>
                            [ 部署学习节点 ]
                        </Link>
                        <Link href="/about" className="border-2 border-slate-600 text-slate-300 font-bold uppercase tracking-widest px-8 py-3 hover:border-emerald-500 hover:text-emerald-400 transition-colors">
                            [ 查阅知识库 ]
                        </Link>
                    </motion.div>
                </section>

                {/* METRICS */}
                <section>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {HOME_METRICS.map((metric) => (
                            <motion.div
                                key={metric.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants}
                                className="border-2 border-slate-700 bg-slate-800/50 p-6 flex flex-col hover:border-emerald-500 transition-colors group"
                            >
                                <div className="text-emerald-500 mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
                                    {getIcon(metric.iconType, 'h-8 w-8')}
                                </div>
                                <div className="text-4xl font-black text-slate-50 font-mono mb-2">{metric.value}</div>
                                <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                                    {metric.labelMap['charcoal-grid']}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* FEATURES */}
                <section className="border-t-2 border-slate-800 pt-32">
                    <div className="mb-16">
                        <h2 className="text-4xl font-black text-slate-50 uppercase tracking-tighter mb-4">{"// 系统核心特性 _"}</h2>
                        <p className="text-slate-400 font-mono">架构化思维训练 / 模块化学习体验 / 严密的规则引擎</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {HOME_FEATURES.slice(0, 3).map((feature) => (
                            <motion.div
                                key={feature.id} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={itemVariants}
                                className={`${styles.brutalist_card} p-8 hover:-translate-y-2`}
                            >
                                <div className="w-12 h-12 border-2 border-emerald-500 text-emerald-500 flex items-center justify-center mb-6">
                                    {getIcon(feature.iconType, 'h-6 w-6')}
                                </div>
                                <h3 className="text-xl font-bold text-slate-50 mb-4 uppercase">
                                    {feature.titleMap['charcoal-grid']}
                                </h3>
                                <p className="text-slate-400 font-mono text-sm leading-relaxed">
                                    {feature.descMap['charcoal-grid']}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="border-4 border-emerald-500 relative overflow-hidden bg-emerald-900/20 p-12 md:p-24 text-center">
                    <div className="absolute top-0 left-0 w-32 h-32 border-b-4 border-r-4 border-emerald-500 -translate-x-4 -translate-y-4" />
                    <div className="absolute bottom-0 right-0 w-32 h-32 border-t-4 border-l-4 border-emerald-500 translate-x-4 translate-y-4" />

                    <h2 className="text-5xl md:text-6xl font-black text-emerald-400 mb-8 tracking-tighter">
                        初始化培训序列 _
                    </h2>
                    <p className="text-slate-300 font-mono text-lg mb-12 max-w-2xl mx-auto">
                        注册账号并输入访问令牌，接入教师与家长协作网络，下载规则补丁与系统更新。
                    </p>
                    <Link href="/register" className={styles.btn_brutalist}>
                        [ 建立连接 ]
                    </Link>
                </section>

            </main>
        </div>
    );
}
