"use client";

import React from 'react';
import Link from 'next/link';
import { BookOpen, MapPin, Feather, Bookmark, Clock, Award } from 'lucide-react';
import { HOME_METRICS, HOME_FEATURES, HOME_STEPS } from '../../../core/data/home-content';
import styles from './copper.module.css';

const getIcon = (type: string, className: string = "h-6 w-6") => {
    switch (type) {
        case 'book': return <BookOpen className={className} />;
        case 'clock': return <Clock className={className} />;
        case 'award': return <Award className={className} />;
        default: return <Bookmark className={className} />;
    }
};

export default function CopperHomeView() {
    return (
        <div className={`${styles.copper_root} leading-loose`}>
            <div className="max-w-4xl mx-auto px-6 py-20 md:py-32">
                {/* HEADER */}
                <header className="text-center mb-24 border-b border-stone-300 pb-16">
                    <div className="flex justify-center mb-8">
                        <Feather className="h-10 w-10 text-orange-800 opacity-80" strokeWidth={1.5} />
                    </div>
                    <h1 className={`${styles.serif_heading} text-5xl md:text-7xl font-semibold mb-6 text-stone-900`}>
                        铜色讲堂议事
                    </h1>
                    <p className={`${styles.sans_body} text-lg md:text-xl md:px-12 leading-relaxed text-stone-600 max-w-2xl mx-auto`}>
                        汲取经典，传承智慧。在这里，我们将罗伯特议事规则的精髓带入您的每一堂课，提升您对课堂沟通组织的掌控能力。
                    </p>
                    <div className="mt-12 flex justify-center gap-6">
                        <Link href="/course" className={`${styles.btn_elegant} px-8 py-3 rounded text-sm uppercase`}>
                            申请入座听讲
                        </Link>
                    </div>
                </header>

                {/* METRICS - CLASSIC LIST */}
                <section className="mb-24 flex justify-around border-y border-stone-200 py-10">
                    {HOME_METRICS.slice(0, 3).map(metric => (
                        <div key={metric.id} className="text-center">
                            <span className={`${styles.serif_heading} text-4xl block font-bold text-orange-900 mb-2`}>{metric.value}</span>
                            <span className={`${styles.sans_body} text-xs uppercase tracking-widest text-stone-500`}>
                                {metric.labelMap['copper-lecture']}
                            </span>
                        </div>
                    ))}
                </section>

                {/* FEATURES - ELEGANT CARDS */}
                <section className="mb-24">
                    <div className={styles.copper_divider}></div>
                    <h2 className={`${styles.serif_heading} text-3xl text-center mb-16 text-stone-800`}>研修内容提要</h2>

                    <div className="grid md:grid-cols-2 gap-10">
                        {HOME_FEATURES.map((feature, idx) => (
                            <div key={feature.id} className={`${styles.copper_card} p-10 flex flex-col`}>
                                <div className="text-orange-800 mb-6 bg-orange-50 w-12 h-12 flex items-center justify-center rounded-full">
                                    {getIcon(feature.iconType, 'h-6 w-6')}
                                </div>
                                <h3 className={`${styles.serif_heading} text-2xl mb-4 text-stone-900`}>{feature.titleMap['copper-lecture']}</h3>
                                <p className={`${styles.sans_body} text-stone-600 font-serif`}>
                                    {feature.descMap['copper-lecture']}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* STEPS - SYMBOLIC PATH */}
                <section className="mb-32">
                    <div className={styles.copper_divider}></div>
                    <h2 className={`${styles.serif_heading} text-3xl text-center mb-16 text-stone-800`}>讲堂阶段划分</h2>
                    <div className="space-y-12">
                        {HOME_STEPS.map((step, idx) => (
                            <div key={step.id} className="flex gap-8 items-start relative group">
                                <div className="text-orange-900 font-bold text-2xl pt-1 opacity-40 font-serif">
                                    0{step.stepIdx}
                                </div>
                                <div className="flex-1 pb-12 border-b border-stone-200 group-last:border-none">
                                    <h3 className={`${styles.serif_heading} text-2xl mb-3 text-stone-900 group-hover:text-orange-800 transition-colors`}>{step.titleMap['copper-lecture']}</h3>
                                    <p className={`${styles.sans_body} text-stone-600 leading-relaxed max-w-2xl`}>{step.descMap['copper-lecture']}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="text-center py-20 bg-stone-100 rounded border border-stone-200 shadow-inner">
                    <BookOpen className="h-12 w-12 text-stone-300 mx-auto mb-6" />
                    <h2 className={`${styles.serif_heading} text-3xl mb-6 text-stone-800`}>准备好开始阅讲了吗？</h2>
                    <p className={`${styles.sans_body} max-w-xl mx-auto mb-10 text-stone-600`}>
                        注册账号并输入您的研修凭据，即刻获取教师与家长的系统讲义，研习课堂协作的古典智慧。
                    </p>
                    <Link href="/register" className={`${styles.btn_elegant} px-10 py-4 text-lg rounded shadow-xl`}>
                        呈交研习申请
                    </Link>
                </section>

            </div>
        </div>
    );
}
