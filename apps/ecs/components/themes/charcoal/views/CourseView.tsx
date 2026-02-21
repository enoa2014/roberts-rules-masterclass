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
import styles from "./charcoal.module.css";

export default function CharcoalCourseView() {
    return (
        <div className="flex flex-col pt-20 min-h-screen">
            {/* Enhanced Page Header */}
            <section className={`relative overflow-hidden py-16 md:py-20 ${styles.cg_hero} ${styles.cg_pattern}`}>
                <div className="absolute inset-0 opacity-30"></div>

                {/* 碳纤背景元素 */}
                <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-r from-gray-700/20 to-gray-600/10 rounded-none blur-2xl" />
                <div className="absolute bottom-10 right-10 w-28 h-28 bg-gradient-to-r from-emerald-500/15 to-emerald-400/10 rounded-none blur-2xl" />

                <div className="container max-w-7xl relative z-10">
                    {/* Breadcrumb Navigation */}
                    <nav className={`flex items-center gap-2 text-sm font-mono text-gray-600 mb-8 pt-4 ${styles.cg_animate_slide}`}>
                        <Link href="/" className="hover:text-emerald-600 transition-colors">首页</Link>
                        <span>/</span>
                        <Link href="/rules" className="hover:text-emerald-600 transition-colors">学习中心</Link>
                        <span>/</span>
                        <span className="text-emerald-600 font-semibold">课程总览</span>
                    </nav>

                    {/* Page Title Section */}
                    <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
                        <div className={styles.cg_animate_slide}>
                            <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-mono font-semibold mb-4 ${styles.cg_badge} ${styles.cg_animate_glow}`}>
                                <BookOpen className="h-4 w-4" />
                                <span className="uppercase tracking-wide">结构课程</span>
                            </div>
                            <h1 className={`mb-4 ${styles.cg_title_hero}`}>结构课程总览</h1>
                            <p className="max-w-2xl text-lg text-gray-700">
                                在边界清晰的结构化学习中掌握议事技能，从基础理论到实战应用，
                                <br className="hidden md:block" />
                                通过标准化训练流程，持续提升课堂协作效率。
                            </p>
                        </div>

                        {/* Stats Cards */}
                        <div className={`grid grid-cols-2 lg:grid-cols-4 gap-4 ${styles.cg_animate_slide}`}>
                            {[
                                { icon: BookOpen, value: "12", label: "结构课程", color: "text-gray-700" },
                                { icon: Users, value: "500+", label: "结构学员", color: "text-emerald-600" },
                                { icon: Clock, value: "40+", label: "小时", color: "text-amber-600" },
                                { icon: Award, value: "98%", label: "结构好评", color: "text-green-600" },
                            ].map((stat, i) => (
                                <div key={stat.label} className={`p-4 text-center transition-all duration-300 ${styles.cg_stat_card} ${styles.cg_animate_snap}`} style={{ animationDelay: `${(i + 3) * 100}ms` }}>
                                    <div className="inline-flex p-2 rounded-lg mb-2 shadow-sm bg-gradient-to-br from-gray-700 to-gray-800 text-white">
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    <div className={`text-2xl font-bold ${styles.cg_stat_value}`}>{stat.value}</div>
                                    <div className={`font-mono text-xs uppercase tracking-wide ${styles.cg_stat_label}`}>{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="py-8 border-b border-gray-100 bg-gray-50/80">
                <div className="container max-w-7xl">
                    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
                        {/* Search Bar */}
                        <div className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="搜索结构课程..."
                                    className="input pl-10 pr-4 border-gray-400 focus:border-emerald-500 focus:ring-emerald-500"
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
                                                ? `bg-gradient-to-r from-gray-700 to-gray-800 text-white ${styles.cg_animate_glow}`
                                                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-emerald-700"
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>

                            {/* View Toggle */}
                            <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                                <button className="p-2 bg-white rounded-md shadow-sm">
                                    <Grid3X3 className="h-4 w-4 text-emerald-600" />
                                </button>
                                <button className="p-2 text-gray-400 hover:text-gray-600">
                                    <List className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Course Grid */}
            <section className="py-12 bg-gradient-to-b from-white to-gray-100/80">
                <div className="container max-w-7xl">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {courses.map((course, index) => (
                            <CourseCard key={course.id} course={course} index={index} />
                        ))}
                    </div>

                    {/* Load More */}
                    <div className="text-center mt-12">
                        <button className={`group ${styles.cg_btn} ${styles.cg_btn_ghost}`}>
                            <span>加载更多结构课程</span>
                            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            </section>

            {/* Learning Path Section */}
            <section className="py-16 md:py-20 bg-white">
                <div className="container max-w-6xl">
                    <div className="text-center mb-16">
                        <div className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-mono font-semibold mb-6 ${styles.cg_badge} ${styles.cg_animate_glow}`}>
                            <TrendingUp className="h-4 w-4" />
                            <span className="uppercase tracking-wide">结构路径</span>
                        </div>
                        <h2 className={`mb-4 ${styles.cg_title_section} ${styles.cg_animate_slide}`}>结构化学习路径</h2>
                        <p className={`max-w-2xl mx-auto text-lg text-gray-700 ${styles.cg_animate_slide}`}>
                            根据你的基础与目标，我们为你推荐最适合的结构化学习路径
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
        blue: { bg: "from-gray-700 to-gray-800", text: "text-gray-700", badge: "bg-gray-100 text-gray-800 border-gray-300" },
        purple: { bg: "from-emerald-600 to-emerald-500", text: "text-emerald-700", badge: "bg-emerald-50 text-emerald-800 border-emerald-200" },
        cyan: { bg: "from-gray-600 to-gray-700", text: "text-gray-700", badge: "bg-gray-100 text-gray-700 border-gray-300" },
        green: { bg: "from-emerald-600 to-emerald-500", text: "text-emerald-700", badge: "bg-emerald-50 text-emerald-800 border-emerald-300" },
        amber: { bg: "from-emerald-500 to-emerald-600", text: "text-emerald-700", badge: "bg-emerald-50 text-emerald-800 border-emerald-300" },
        red: { bg: "from-gray-700 to-gray-800", text: "text-gray-800", badge: "bg-gray-100 text-gray-800 border-gray-300" },
    };

    const colors = colorMap[course.color as keyof typeof colorMap] || colorMap.blue;

    return (
        <div className={`p-6 group transition-all duration-300 ${styles.cg_card} ${styles.cg_animate_snap}`} style={{ animationDelay: `${(index % 3 + 1) * 100}ms` }}>
            <div className="flex items-start justify-between mb-4">
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-semibold uppercase tracking-wide ${colors.badge}`}>
                    {course.level}
                </div>
                <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-emerald-500 fill-current" />
                    <span className="text-sm font-semibold text-gray-700">{course.rating}</span>
                </div>
            </div>

            <h3 className="text-xl font-bold mb-3 transition-colors text-gray-900 group-hover:text-emerald-700">
                {course.title}
            </h3>
            <p className="text-sm leading-relaxed mb-4 text-gray-700">{course.description}</p>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
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
                        <span className="font-mono text-xs text-gray-500 uppercase tracking-wide">学习进度</span>
                        <span className="text-sm font-semibold text-gray-700">{course.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className={`h-2 rounded-full bg-gradient-to-r ${colors.bg} transition-all duration-300`} style={{ width: `${course.progress}%` }}></div>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {course.status === "completed" && <CheckCircle className="h-5 w-5 text-emerald-500" />}
                    {course.status === "locked" && <Lock className="h-5 w-5 text-gray-400" />}
                    <span className={`font-mono text-xs uppercase tracking-wide ${course.status === "completed" ? "text-emerald-600" :
                            course.status === "locked" ? "text-gray-400" : colors.text
                        }`}>
                        {course.status === "completed" ? "已完成" : course.status === "locked" ? "未解锁" : "学习中"}
                    </span>
                </div>

                <button
                    className={`group ${course.status === "locked" ? `${styles.cg_btn} ${styles.cg_btn_ghost} opacity-50 cursor-not-allowed` : `${styles.cg_btn} ${styles.cg_btn_primary}`}`}
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
        blue: { bg: "from-gray-700 to-gray-800", text: "text-gray-700" },
        purple: { bg: "from-emerald-600 to-emerald-500", text: "text-emerald-700" },
        amber: { bg: "from-emerald-500 to-emerald-600", text: "text-emerald-700" },
    };

    const colors = colorMap[path.color as keyof typeof colorMap] || colorMap.blue;
    const iconMap: Record<string, any> = { Target, TrendingUp, Award, Zap };
  const Icon = iconMap[path.icon] || Target;

    return (
        <div className={`p-8 text-center group transition-all duration-300 ${styles.cg_card} ${styles.cg_animate_snap}`} style={{ animationDelay: `${(index + 1) * 100}ms` }}>
            <div className={`w-16 h-16 mx-auto rounded-2xl text-white flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110 bg-gradient-to-br ${colors.bg} group-hover:shadow-xl ${styles.cg_animate_glow}`}>
                <Icon className="h-8 w-8" />
            </div>

            <h3 className="text-xl font-bold mb-3 transition-colors text-gray-900 group-hover:text-emerald-700">{path.title}</h3>
            <p className="text-sm leading-relaxed mb-6 text-gray-700">{path.description}</p>

            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div>
                    <div className="text-lg font-bold text-gray-900">{path.courses}</div>
                    <div className="font-mono text-xs uppercase tracking-wide text-gray-600">门课程</div>
                </div>
                <div>
                    <div className="text-lg font-bold text-gray-900">{path.duration}</div>
                    <div className="font-mono text-xs uppercase tracking-wide text-gray-600">总时长</div>
                </div>
                <div>
                    <div className={`text-lg font-bold ${colors.text}`}>{path.difficulty}</div>
                    <div className="font-mono text-xs uppercase tracking-wide text-gray-600">难度</div>
                </div>
            </div>

            <button className={`w-full group ${styles.cg_btn} ${styles.cg_btn_primary}`}>
                <Zap className="h-4 w-4 transition-transform group-hover:scale-110" />
                <span>开始结构学习</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
        </div>
    );
}
