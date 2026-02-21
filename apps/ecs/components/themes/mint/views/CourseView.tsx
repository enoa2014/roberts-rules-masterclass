"use client";

import Link from "next/link";
import {
    BookOpen,
    Clock,
    Users,
    Star,
    Play,
    CheckCircle,
    Lock,
    ArrowRight,
    Search,
    Grid3X3,
    List,
    TrendingUp,
    Award,
    Zap,
    Target,
} from "lucide-react";
import { courses, learningPaths } from "../../../core/data/courseData";
import type { Course, LearningPath } from "../../../core/data/courseData";
import styles from "./mint.module.css";

export default function MintCourseView() {
    return (
        <div className="flex flex-col pt-20 min-h-screen">
            {/* Enhanced Page Header */}
            <section className={`relative overflow-hidden py-16 md:py-20 ${styles.mc_hero} ${styles.mc_pattern}`}>
                <div className="absolute inset-0 opacity-30"></div>

                {/* 薄荷背景元素 */}
                <div className={`absolute top-10 left-10 w-28 h-28 bg-gradient-to-r from-teal-600/20 to-teal-500/10 rounded-full blur-3xl ${styles.mc_animate_float}`} />
                <div className={`absolute bottom-10 right-10 w-36 h-36 bg-gradient-to-r from-orange-500/15 to-orange-400/10 rounded-full blur-3xl ${styles.mc_animate_float}`} />

                <div className="container max-w-7xl relative z-10">
                    {/* Breadcrumb Navigation */}
                    <nav className={`flex items-center gap-2 text-sm font-mono text-gray-600 mb-8 ${styles.mc_animate_slide}`}>
                        <Link href="/" className="hover:text-teal-600 transition-colors">首页</Link>
                        <span>/</span>
                        <Link href="/rules" className="hover:text-teal-600 transition-colors">学习中心</Link>
                        <span>/</span>
                        <span className="text-teal-600 font-semibold">课程总览</span>
                    </nav>

                    {/* Page Title Section */}
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
                        <div className={styles.mc_animate_slide}>
                            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-mono font-semibold mb-4 ${styles.mc_badge} ${styles.mc_animate_glow}`}>
                                <BookOpen className="h-4 w-4" />
                                <span className="uppercase tracking-wide">实践课程</span>
                            </div>
                            <h1 className={`mb-4 ${styles.mc_title_hero}`}>实践课程总览</h1>
                            <p className="max-w-2xl text-lg text-teal-800">
                                在清新实践的学习氛围中掌握议事技能，从基础理论到实战应用，
                                <br className="hidden md:block" />
                                与同行伙伴一起强化课堂表达与协作热情。
                            </p>
                        </div>

                        {/* Stats Cards */}
                        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${styles.mc_animate_slide}`}>
                            {[
                                { icon: BookOpen, value: "12", label: "实践课程", color: "text-teal-600" },
                                { icon: Users, value: "500+", label: "实践学员", color: "text-orange-600" },
                                { icon: Clock, value: "40+", label: "小时", color: "text-amber-600" },
                                { icon: Award, value: "98%", label: "实践好评", color: "text-green-600" },
                            ].map((stat, i) => (
                                <div key={stat.label} className={`p-4 text-center transition-all duration-300 ${styles.mc_card} ${styles.mc_animate_bounce}`} style={{ animationDelay: `${(i + 3) * 100}ms` }}>
                                    <div className="inline-flex p-2 rounded-lg mb-2 shadow-sm bg-gradient-to-br from-teal-500 to-teal-600 text-white">
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    <div className={`text-2xl font-bold ${styles.mc_stat_value}`}>{stat.value}</div>
                                    <div className={`font-mono text-xs uppercase tracking-wide ${styles.mc_stat_label}`}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="py-8 border-b border-teal-100 bg-teal-50/30">
                <div className="container max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                        {/* Search Bar */}
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-teal-400" />
                                <input
                                    type="text"
                                    placeholder="搜索实践课程..."
                                    className="input pl-10 pr-4 border-teal-200 focus:border-teal-500 focus:ring-teal-500"
                                />
                            </div>
                        </div>

                        {/* Filter Controls */}
                        <div className="flex items-center gap-4">
                            {/* Category Filters */}
                            <div className="flex items-center gap-2">
                                {["全部", "基础", "进阶", "实战"].map((filter, index) => (
                                    <button
                                        key={filter}
                                        className={`px-4 py-2 rounded-lg font-mono text-sm font-medium transition-all duration-200 ${index === 0
                                                ? `bg-gradient-to-r from-teal-600 to-teal-700 text-white ${styles.mc_animate_glow}`
                                                : "bg-white text-teal-700 hover:bg-teal-50 border border-teal-100"
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>

                            {/* View Toggle */}
                            <div className="flex items-center gap-1 p-1 bg-white border border-teal-100 rounded-lg">
                                <button className="p-2 bg-teal-50 rounded-md shadow-sm">
                                    <Grid3X3 className="h-4 w-4 text-teal-600" />
                                </button>
                                <button className="p-2 text-teal-400 hover:text-teal-600">
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Grid */}
            <section className="py-12 bg-gradient-to-b from-white to-teal-50/40">
                <div className="container max-w-7xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course, index) => (
                            <CourseCard key={course.id} course={course} index={index} />
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="text-center mt-12">
                        <button className={`group ${styles.mc_btn} ${styles.mc_btn_ghost}`}>
                            <span>加载更多实践课程</span>
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Learning Path Section */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container max-w-6xl">
                    <div className="text-center mb-16">
                        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-mono font-semibold mb-6 ${styles.mc_badge} ${styles.mc_animate_glow}`}>
                            <TrendingUp className="h-4 w-4" />
                            <span className="uppercase tracking-wide">实践路径</span>
                        </div>
                        <h2 className={`mb-4 ${styles.mc_title_section} ${styles.mc_animate_slide}`}>实践学习路径</h2>
                        <p className={`max-w-2xl mx-auto text-lg text-teal-800 ${styles.mc_animate_slide}`}>
                            根据你的基础和目标，我们为你推荐最适合的实践学习路径
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {learningPaths.map((path, index) => (
                            <LearningPathCard key={path.id} path={path} index={index} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

function CourseCard({ course, index }: { course: Course; index: number }) {
    const colorMap = {
        blue: { bg: "from-teal-500 to-teal-600", text: "text-teal-600", badge: "bg-teal-50 text-teal-700 border-teal-200" },
        purple: { bg: "from-orange-500 to-orange-600", text: "text-orange-600", badge: "bg-orange-50 text-orange-700 border-orange-200" },
        cyan: { bg: "from-teal-400 to-teal-500", text: "text-teal-500", badge: "bg-teal-50 text-teal-600 border-teal-200" },
        green: { bg: "from-emerald-500 to-emerald-600", text: "text-emerald-600", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
        amber: { bg: "from-orange-500 to-orange-600", text: "text-orange-600", badge: "bg-orange-50 text-orange-700 border-orange-200" },
        red: { bg: "from-red-500 to-orange-500", text: "text-orange-700", badge: "bg-orange-50 text-orange-800 border-orange-200" },
    };

    const colors = colorMap[course.color as keyof typeof colorMap] || colorMap.blue;

    return (
        <div className={`p-6 group transition-all duration-300 ${styles.mc_card} ${styles.mc_animate_bounce}`} style={{ animationDelay: `${(index % 3 + 1) * 100}ms` }}>
            <div className="flex items-start justify-between mb-4">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-semibold uppercase tracking-wide ${colors.badge}`}>
                    {course.level}
                </div>
                <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-orange-400 fill-current" />
                    <span className="text-sm font-semibold text-teal-800">{course.rating}</span>
                </div>
            </div>

            <h3 className="text-xl font-bold mb-3 transition-colors text-teal-800 group-hover:text-teal-600">
                {course.title}
            </h3>
            <p className="text-sm leading-relaxed mb-4 text-teal-700">{course.description}</p>

            <div className="flex items-center gap-4 text-sm text-teal-600/70 mb-4">
                <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{course.duration}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{course.students}人</span>
                </div>
            </div>

            {course.status !== "locked" && (
                <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs text-teal-600/70 uppercase tracking-wide">学习进度</span>
                        <span className="text-sm font-semibold text-teal-800">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-teal-100 rounded-full h-2">
                        <div className={`h-2 rounded-full bg-gradient-to-r ${colors.bg} transition-all duration-300`} style={{ width: `${course.progress}%` }}></div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {course.status === "completed" && <CheckCircle className="h-5 w-5 text-teal-500" />}
                    {course.status === "locked" && <Lock className="h-5 w-5 text-teal-300" />}
                    <span className={`font-mono text-xs uppercase tracking-wide ${course.status === "completed" ? "text-teal-600" :
                            course.status === "locked" ? "text-teal-400" : colors.text
                        }`}>
                        {course.status === "completed" ? "已完成" : course.status === "locked" ? "未解锁" : "学习中"}
                    </span>
                </div>

                <button
                    className={`group ${course.status === "locked" ? `${styles.mc_btn} ${styles.mc_btn_ghost} opacity-50 cursor-not-allowed` : `${styles.mc_btn} ${styles.mc_btn_primary}`}`}
                    disabled={course.status === "locked"}
                >
                    {course.status === "completed" ? (
                        <>
                            <CheckCircle className="h-4 w-4" />
                            <span>复习</span>
                        </>
                    ) : course.status === "locked" ? (
                        <>
                            <Lock className="h-4 w-4" />
                            <span>未解锁</span>
                        </>
                    ) : (
                        <>
                            <Play className="h-4 w-4 transition-transform group-hover:scale-110" />
                            <span>继续学习</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}

function LearningPathCard({ path, index }: { path: LearningPath; index: number }) {
    const colorMap = {
        blue: { bg: "from-teal-500 to-teal-600", text: "text-teal-600" },
        purple: { bg: "from-orange-500 to-orange-600", text: "text-orange-600" },
        amber: { bg: "from-orange-500 to-orange-600", text: "text-orange-600" },
    };

    const colors = colorMap[path.color as keyof typeof colorMap] || colorMap.blue;
    const iconMap: Record<string, any> = { Target, TrendingUp, Award, Zap };
  const Icon = iconMap[path.icon] || Target;

    return (
        <div className={`p-8 text-center group transition-all duration-300 ${styles.mc_card} ${styles.mc_animate_bounce}`} style={{ animationDelay: `${(index + 1) * 100}ms` }}>
            <div className={`w-16 h-16 mx-auto rounded-2xl text-white flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 bg-gradient-to-br ${colors.bg} group-hover:shadow-xl ${styles.mc_animate_glow}`}>
                <Icon className="h-8 w-8" />
            </div>

            <h3 className="text-xl font-bold mb-3 transition-colors text-teal-800 group-hover:text-teal-600">{path.title}</h3>
            <p className="text-sm leading-relaxed mb-6 text-teal-700">{path.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div>
                    <div className="text-lg font-bold text-teal-800">{path.courses}</div>
                    <div className="font-mono text-xs uppercase tracking-wide text-teal-600">门课程</div>
                </div>
                <div>
                    <div className="text-lg font-bold text-teal-800">{path.duration}</div>
                    <div className="font-mono text-xs uppercase tracking-wide text-teal-600">总时长</div>
                </div>
                <div>
                    <div className={`text-lg font-bold ${colors.text}`}>{path.difficulty}</div>
                    <div className="font-mono text-xs uppercase tracking-wide text-teal-600">难度</div>
                </div>
            </div>

            <button className={`w-full group ${styles.mc_btn} ${styles.mc_btn_primary}`}>
                <Zap className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>开始实践学习</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
        </div>
    );
}
