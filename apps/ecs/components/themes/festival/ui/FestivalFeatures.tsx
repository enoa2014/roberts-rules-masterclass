"use client";

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { Sparkles, Scale, Zap, Users, Crown } from 'lucide-react';
import { HOME_FEATURES } from '../../../core/data/home-content';
import styles from '../views/festival.module.css';

const getIcon = (type: string) => {
    switch (type) {
        case 'scale': return <Scale className="h-8 w-8" />;
        case 'zap': return <Zap className="h-8 w-8" />;
        case 'users': return <Users className="h-8 w-8" />;
        case 'crown': return <Crown className="h-8 w-8" />;
        default: return <Sparkles className="h-8 w-8" />;
    }
};

const bgColors = [
    'from-rose-500 to-rose-600',
    'from-blue-500 to-blue-600',
    'from-rose-400 to-rose-500',
    'from-blue-400 to-blue-500',
];

export default function FestivalFeatures() {
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
            transition: { type: 'spring', stiffness: 120, damping: 14 }
        }
    };

    return (
        <section className="py-24 md:py-32 relative bg-white rounded-t-[3rem] -mt-10 overflow-hidden shadow-[0_-20px_40px_rgba(225,29,72,0.05)] z-20">
            <div className="container max-w-7xl mx-auto px-4 relative z-10">

                {/* Header */}
                <div className="text-center mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-bold mb-6 bg-rose-50 border border-rose-200 text-rose-700 shadow-sm"
                    >
                        <Sparkles className="h-4 w-4" />
                        <span className="uppercase tracking-widest">活力亮点</span>
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-black mb-6 text-gray-900"
                    >
                        为什么选择活力课堂？
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="max-w-2xl mx-auto text-xl text-rose-800/80 font-medium"
                    >
                        在活力课堂散列的视觉交互氛围中，无压体验规则化沟通与协作训练
                    </motion.p>
                </div>

                {/* Feature Cards Grid (散列表现) */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {HOME_FEATURES.map((feature, idx) => (
                        <motion.div key={feature.id} variants={itemVariants} className="group h-full">
                            <div className={`h-full p-8 rounded-[2rem] bg-white border border-rose-100 shadow-xl shadow-rose-100/50 hover:shadow-2xl hover:shadow-rose-300/40 transition-shadow duration-500 relative flex flex-col items-center text-center group overflow-hidden`}>
                                {/* 装饰性背景球 */}
                                <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br ${bgColors[idx]} opacity-10 blur-xl group-hover:scale-150 transition-transform duration-700`} />

                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    className={`w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 bg-gradient-to-br ${bgColors[idx]} text-white shadow-lg mx-auto relative z-10 rotate-3 group-hover:rotate-0 transition-transform`}
                                >
                                    {getIcon(feature.iconType)}
                                </motion.div>

                                <h3 className="text-2xl font-bold mb-4 text-gray-900 group-hover:text-rose-600 transition-colors relative z-10">
                                    {feature.titleMap['festival-civic']}
                                </h3>

                                <p className="text-base text-gray-600 leading-relaxed font-medium relative z-10">
                                    {feature.descMap['festival-civic']}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
