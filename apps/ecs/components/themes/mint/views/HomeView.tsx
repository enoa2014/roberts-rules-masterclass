"use client";

import React from 'react';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';
import { Target, Smile, Cloud, Zap, CheckCircle, Flag } from 'lucide-react';
import { HOME_METRICS, HOME_FEATURES, HOME_STEPS } from '../../../core/data/home-content';
import styles from './mint.module.css';

const getIcon = (type: string, className: string = "h-8 w-8") => {
    switch (type) {
        case 'target': return <Target className={className} />;
        case 'smile': return <Smile className={className} />;
        case 'cloud': return <Cloud className={className} />;
        case 'zap': return <Zap className={className} />;
        case 'check': return <CheckCircle className={className} />;
        default: return <Flag className={className} />;
    }
};

export default function MintHomeView() {
    const popupVariants: Variants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: 'spring', bounce: 0.4, duration: 0.8 }
        }
    };

    const staggerContainer: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <div className={`${styles.mint_root} relative`}>
            <div className={styles.blob_bg_1} />
            <div className={styles.blob_bg_2} />

            <main className="relative z-10 container max-w-6xl mx-auto px-4 py-20 md:py-32">

                {/* HERO */}
                <section className="text-center min-h-[70vh] flex flex-col items-center justify-center">
                    <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-6 py-2 rounded-full font-bold mb-8 border-2 border-orange-200 shadow-sm">
                        <Zap className="h-5 w-5 text-orange-500" />
                        <span>薄荷实践 · 让规则落地生根！</span>
                    </motion.div>

                    <motion.h1
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="text-5xl md:text-7xl font-black text-teal-900 mb-8 leading-tight tracking-tight drop-shadow-sm"
                    >
                        以<span className="text-orange-500 underline decoration-wavy decoration-orange-300">实践</span>为引导的<br />
                        课堂议事体验
                    </motion.h1>

                    <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-xl md:text-2xl text-teal-800 font-medium max-w-2xl mb-12">
                        轻松、活泼、充满反馈机制的议事规则学习。让每一次课堂发言都有理有据。
                    </motion.p>

                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col sm:flex-row gap-6">
                        <Link href="/course" className={styles.mint_btn}>
                            🚀 马上开启实践之旅
                        </Link>
                        <Link href="/about" className={styles.mint_btn_accent}>
                            💡 了解背后的理论
                        </Link>
                    </motion.div>
                </section>

                {/* METRICS - PLAYFUL CARDS */}
                <motion.section
                    variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 -mt-10"
                >
                    {HOME_METRICS.map((metric, i) => (
                        <motion.div variants={popupVariants} key={metric.id} className={`${styles.mint_card} p-8 text-center bg-white`}>
                            <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-teal-200">
                                {getIcon(metric.iconType, 'h-8 w-8')}
                            </div>
                            <div className="text-4xl font-black text-teal-900 mb-2">{metric.value}</div>
                            <div className="text-sm font-bold text-teal-700">{metric.labelMap['mint-campaign']}</div>
                        </motion.div>
                    ))}
                </motion.section>

                {/* FEATURES - OFFSET CARDS */}
                <section className="mt-32">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-black text-teal-900 mb-4 tracking-tight">我们的行动指南</h2>
                        <p className="text-xl text-teal-700 font-medium">清晰、有趣的任务驱动模块</p>
                    </div>

                    <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid md:grid-cols-3 gap-8 px-4">
                        {HOME_FEATURES.slice(0, 3).map((feature, idx) => (
                            <motion.div variants={popupVariants} key={feature.id} className={`${styles.mint_card} p-8 ${idx % 2 === 1 ? 'md:translate-y-12' : ''}`}>
                                <h3 className="text-2xl font-black text-teal-900 mb-4">{feature.titleMap['mint-campaign']}</h3>
                                <p className="text-teal-700 text-lg leading-relaxed font-medium">
                                    {feature.descMap['mint-campaign']}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>

                {/* STEPS - TO-DO LIST STYLE */}
                <section className="mt-48 bg-white border-4 border-teal-700 rounded-[3rem] p-10 md:p-20 shadow-[10px_10px_0_#0f766e] transform rotate-1 hover:rotate-0 transition-transform duration-300">
                    <div className="flex flex-col md:flex-row gap-16 items-center">
                        <div className="md:w-1/3">
                            <h2 className="text-4xl font-black text-teal-900 mb-6 leading-tight">打卡你的<br /><span className="text-orange-500">成长日记</span></h2>
                            <p className="text-teal-700 text-xl font-medium mb-8">
                                三步走，从了解底层逻辑到形成肌肉记忆，将议事规则变成习惯。
                            </p>
                            <Smile className="h-24 w-24 text-teal-200 opacity-80 animate-bounce" />
                        </div>

                        <div className="md:w-2/3 flex flex-col gap-6 w-full">
                            {HOME_STEPS.map((step) => (
                                <div key={step.id} className="flex gap-6 items-start bg-teal-50 p-6 rounded-2xl border-2 border-teal-100">
                                    <div className="w-12 h-12 bg-white rounded-full border-4 border-teal-600 flex items-center justify-center font-black text-teal-600 text-xl shrink-0">
                                        {step.stepIdx}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-teal-900 mb-2">{step.titleMap['mint-campaign']}</h3>
                                        <p className="text-teal-700 font-medium">{step.descMap['mint-campaign']}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="mt-32 text-center pb-20">
                    <h2 className="text-5xl font-black text-teal-900 mb-8 max-w-3xl mx-auto leading-tight">
                        别再犹豫，为课堂带去一丝清凉与规则感！
                    </h2>
                    <Link href="/register" className={styles.mint_btn}>
                        ✍️ 创建免费账号
                    </Link>
                </section>

            </main>
        </div>
    );
}
