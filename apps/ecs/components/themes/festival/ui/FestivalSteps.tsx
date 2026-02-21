"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Shield, BookOpen, Gavel, TrendingUp } from 'lucide-react';
import { HOME_STEPS } from '../../../core/data/home-content';
import styles from '../views/festival.module.css';

const getIcon = (type: string, className: string = "h-10 w-10") => {
    switch (type) {
        case 'shield': return <Shield className={className} />;
        case 'book': return <BookOpen className={className} />;
        case 'gavel': return <Gavel className={className} />;
        default: return <Shield className={className} />;
    }
};

const stepColors = [
    'bg-gradient-to-br from-rose-500 to-rose-600 shadow-rose-500/30',
    'bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/30',
    'bg-gradient-to-br from-rose-400 to-rose-500 shadow-rose-400/30',
];

export default function FestivalSteps() {
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, y: 40, scale: 0.9 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: { type: 'spring', stiffness: 100, damping: 12 }
        }
    };

    return (
        <section className="py-24 md:py-32 bg-rose-50/50 relative overflow-hidden z-10 w-full pt-16">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-200 to-transparent"></div>

            {/* 散列装饰 */}
            <div className="absolute top-20 right-[15%] w-20 h-20 bg-blue-300/20 rounded-full blur-xl" />
            <div className="absolute bottom-10 left-[10%] w-32 h-32 bg-rose-300/30 rounded-full blur-2xl" />

            <div className="container max-w-6xl mx-auto px-4 relative z-10">
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold mb-6 bg-white shadow-sm border border-rose-100 text-rose-700 hover:shadow-md transition-shadow"
                    >
                        <TrendingUp className="h-4 w-4" />
                        <span className="uppercase tracking-widest">活力路径</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black mb-6 text-gray-900"
                    >
                        你的活力之旅
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="max-w-xl mx-auto text-xl text-rose-800/80 font-medium leading-relaxed"
                    >
                        三步开启课堂协作训练，从入门到熟练的散列化体验。
                    </motion.p>
                </div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-3 gap-12 relative px-4"
                >
                    {/* Dynamic wavy connecting line for larger screens */}
                    <div className="hidden md:block absolute top-[25%] left-[20%] right-[20%] h-2 bg-gradient-to-r from-rose-200 via-blue-200 to-rose-200 z-0 rounded-full opacity-50 blur-[1px]"></div>

                    {HOME_STEPS.map((step, idx) => (
                        <motion.div key={step.id} variants={itemVariants} className="relative z-10">
                            <div className="p-8 text-center group bg-white/80 rounded-[3rem] shadow-xl border border-white backdrop-blur-md h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                                <div className="relative mb-8">
                                    <motion.div
                                        whileHover={{ scale: 1.1, rotate: [-2, 2, -2, 0] }}
                                        transition={{ duration: 0.5 }}
                                        className={`w-28 h-28 mx-auto rounded-[2.5rem] flex items-center justify-center shadow-2xl relative z-10 ${stepColors[idx]}`}
                                    >
                                        {getIcon(step.iconType, 'h-12 w-12 text-white')}
                                    </motion.div>
                                    <div className="absolute -top-3 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center font-black text-rose-600 text-lg z-20 border-[3px] border-rose-50">
                                        {step.stepIdx}
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black mb-4 text-gray-900 group-hover:text-rose-600 transition-colors">
                                    {step.titleMap['festival-civic']}
                                </h3>
                                <p className="text-base text-gray-600 leading-relaxed font-medium">
                                    {step.descMap['festival-civic']}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
