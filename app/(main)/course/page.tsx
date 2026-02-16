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
  Filter,
  Search,
  Grid3X3,
  List,
  TrendingUp,
  Award,
  Target,
  Zap,
} from "lucide-react";
import { useTheme } from "@/components/theme-provider";

export default function CoursePage() {
  const { theme } = useTheme();
  const isFestival = theme === 'festival-civic';
  const isMint = theme === 'mint-campaign';
  return (
    <div className="flex flex-col pt-20 min-h-screen">
      {/* Enhanced Page Header */}
      <section className={`
        relative overflow-hidden py-16 md:py-20
        ${isFestival
          ? 'fc-hero fc-pattern'
          : isMint
            ? 'mc-hero mc-pattern'
            : 'gradient-hero'
        }
      `}>
        <div className={`
          absolute inset-0 opacity-30
          ${isFestival ? '' : isMint ? '' : 'parliament-pattern'}
        `}></div>

        {/* 节庆背景元素 */}
        {isFestival && (
          <>
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-rose-600/20 to-rose-500/10 rounded-full blur-3xl fc-animate-float" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-600/15 to-blue-500/10 rounded-full blur-3xl fc-animate-float fc-delay-300" />
          </>
        )}

        {/* 薄荷背景元素 */}
        {isMint && (
          <>
            <div className="absolute top-10 left-10 w-28 h-28 bg-gradient-to-r from-teal-600/20 to-teal-500/10 rounded-full blur-3xl mc-animate-float" />
            <div className="absolute bottom-10 right-10 w-36 h-36 bg-gradient-to-r from-orange-500/15 to-orange-400/10 rounded-full blur-3xl mc-animate-float mc-delay-300" />
          </>
        )}
        <div className="container max-w-7xl relative z-10">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center gap-2 text-sm font-mono text-gray-600 mb-8 animate-fadeInUp">
            <Link href="/" className="hover:text-blue-600 transition-colors">首页</Link>
            <span>/</span>
            <Link href="/rules" className="hover:text-blue-600 transition-colors">学习中心</Link>
            <span>/</span>
            <span className="text-blue-600 font-semibold">课程总览</span>
          </nav>

          {/* Page Title Section */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-12">
            <div className={`
              ${isFestival
                ? 'fc-animate-slide'
                : isMint
                  ? 'mc-animate-slide'
                  : 'animate-fadeInUp'
              }
            `}>
              <div className={`
                inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-mono font-semibold mb-4
                ${isFestival
                  ? 'fc-badge fc-animate-glow'
                  : isMint
                    ? 'mc-badge mc-animate-glow'
                    : 'bg-blue-50 border border-blue-200 text-blue-700'
                }
              `}>
                <BookOpen className="h-4 w-4" />
                <span className="uppercase tracking-wide">
                  {isFestival ? '节庆课程' : isMint ? '行动课程' : '学习路径'}
                </span>
              </div>
              <h1 className={`
                mb-4
                ${isFestival
                  ? 'fc-title-hero'
                  : isMint
                    ? 'mc-title-hero'
                    : 'text-hero text-gray-900'
                }
              `}>
                {isFestival ? '节庆课程总览' : isMint ? '行动课程总览' : '课程总览'}
              </h1>
              <p className={`
                max-w-2xl
                ${isFestival
                  ? 'text-lg text-rose-800'
                  : isMint
                    ? 'text-lg text-teal-800'
                    : 'text-body text-gray-600'
                }
              `}>
                {isFestival ? (
                  <>
                    在充满活力的节庆氛围中系统学习议事规则，从基础理论到实战应用，
                    <br className="hidden md:block" />
                    与数百名节庆参与者一同成长为行动公民。
                  </>
                ) : isMint ? (
                  <>
                    在清新活力的行动氛围中掌握议事技能，从基础理论到实战应用，
                    <br className="hidden md:block" />
                    与志同道合的伙伴一起激发公民参与热情。
                  </>
                ) : (
                  <>
                    系统化的议事规则学习体系，从基础理论到实战应用，
                    <br className="hidden md:block" />
                    帮助你成为合格的公民参与者。
                  </>
                )}
              </p>
            </div>

            {/* Stats Cards */}
            <div className={`
              grid grid-cols-2 lg:grid-cols-4 gap-4
              ${isFestival
                ? 'fc-animate-slide fc-delay-200'
                : isMint
                  ? 'mc-animate-slide mc-delay-200'
                  : 'animate-fadeInUp delay-200'
              }
            `}>
              {[
                { icon: BookOpen, value: "12", label: isFestival ? "节庆课程" : isMint ? "行动课程" : "门课程", color: isFestival ? "text-rose-600" : isMint ? "text-teal-600" : "text-blue-600" },
                { icon: Users, value: "500+", label: isFestival ? "节庆参与者" : isMint ? "行动参与者" : "学员", color: isFestival ? "text-blue-600" : isMint ? "text-orange-600" : "text-purple-600" },
                { icon: Clock, value: "40+", label: "小时", color: "text-amber-600" },
                { icon: Award, value: "98%", label: isFestival ? "节庆好评" : isMint ? "行动好评" : "完成率", color: "text-green-600" },
              ].map((stat, i) => (
                <div key={stat.label} className={`
                  p-4 text-center transition-all duration-300
                  ${isFestival
                    ? `fc-card fc-animate-bounce fc-delay-${(i + 3) * 100}`
                    : isMint
                      ? `mc-card mc-animate-bounce mc-delay-${(i + 3) * 100}`
                      : 'glass-card hover-lift'
                  }
                `}>
                  <div className={`
                    inline-flex p-2 rounded-lg mb-2 shadow-sm
                    ${isFestival
                      ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white'
                      : isMint
                        ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white'
                        : `bg-white ${stat.color}`
                    }
                  `}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className={`
                    text-2xl font-bold
                    ${isFestival ? 'fc-stat-value' : isMint ? 'mc-stat-value' : 'text-gray-900'}
                  `}>
                    {stat.value}
                  </div>
                  <div className={`
                    font-mono text-xs uppercase tracking-wide
                    ${isFestival ? 'fc-stat-label' : isMint ? 'mc-stat-label' : 'text-gray-500'}
                  `}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className={`
        py-8 border-b border-gray-100
        ${isFestival ? 'bg-white' : isMint ? 'bg-teal-50/30' : 'bg-white'}
      `}>
        <div className="container max-w-7xl">
          <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={isFestival ? "搜索节庆课程..." : isMint ? "搜索行动课程..." : "搜索课程..."}
                  className={`
                    input pl-10 pr-4
                    ${isFestival
                      ? 'border-rose-200 focus:border-rose-500 focus:ring-rose-500'
                      : isMint
                        ? 'border-teal-200 focus:border-teal-500 focus:ring-teal-500'
                      : ''
                    }
                  `}
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
                    className={`px-4 py-2 rounded-lg font-mono text-sm font-medium transition-all duration-200 ${
                      index === 0
                        ? isFestival
                          ? "bg-gradient-to-r from-rose-600 to-rose-700 text-white fc-animate-glow"
                          : isMint
                            ? "bg-gradient-to-r from-teal-600 to-teal-700 text-white mc-animate-glow"
                            : "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-political"
                        : isFestival
                          ? "bg-gray-100 text-gray-600 hover:bg-rose-50 hover:text-rose-600"
                          : isMint
                            ? "bg-gray-100 text-gray-600 hover:bg-teal-50 hover:text-teal-600"
                            : "bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600"
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-1 p-1 bg-gray-100 rounded-lg">
                <button className="p-2 bg-white rounded-md shadow-sm">
                  <Grid3X3 className="h-4 w-4 text-blue-600" />
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
      <section className={`
        py-12
        ${isFestival
          ? 'bg-gradient-to-b from-white to-rose-50/30'
          : isMint
            ? 'bg-gradient-to-b from-white to-teal-50/40'
            : 'bg-gradient-to-b from-white to-gray-50'
        }
      `}>
        <div className="container max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <CourseCard key={course.id} course={course} index={index} isFestival={isFestival} isMint={isMint} />
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-12">
            <button className={`
              group
              ${isFestival
                ? 'fc-btn fc-btn-ghost'
                : isMint
                  ? 'mc-btn mc-btn-ghost'
                  : 'btn btn-ghost'
              }
            `}>
              <span>{isFestival ? '加载更多节庆课程' : isMint ? '加载更多行动课程' : '加载更多课程'}</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <div className={`
              inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-mono font-semibold mb-6
              ${isFestival
                ? 'fc-badge fc-animate-glow'
                : isMint
                  ? 'mc-badge mc-animate-glow'
                  : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700'
              }
            `}>
              <TrendingUp className="h-4 w-4" />
              <span className="uppercase tracking-wide">
                {isFestival ? '节庆路径' : isMint ? '行动路径' : '推荐路径'}
              </span>
            </div>
            <h2 className={`
              mb-4
              ${isFestival
                ? 'fc-title-section fc-animate-slide fc-delay-100'
                : isMint
                  ? 'mc-title-section mc-animate-slide mc-delay-100'
                  : 'text-display text-gray-900'
              }
            `}>
              {isFestival ? '节庆学习路径' : isMint ? '行动学习路径' : '个性化学习路径'}
            </h2>
            <p className={`
              max-w-2xl mx-auto
              ${isFestival
                ? 'text-lg text-rose-800 fc-animate-slide fc-delay-200'
                : isMint
                  ? 'text-lg text-teal-800 mc-animate-slide mc-delay-200'
                  : 'text-body text-gray-600'
              }
            `}>
              {isFestival
                ? '根据你的基础和目标，我们为你推荐最适合的节庆学习路径'
                : isMint
                  ? '根据你的基础和目标，我们为你推荐最适合的行动学习路径'
                  : '根据你的基础和目标，我们为你推荐最适合的学习路径'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {learningPaths.map((path, index) => (
              <LearningPathCard key={path.id} path={path} index={index} isFestival={isFestival} isMint={isMint} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// Course data
const courses = [
  {
    id: 1,
    title: "议事规则基础",
    description: "掌握罗伯特议事规则的基本概念和核心原则",
    level: "基础",
    duration: "6小时",
    students: 245,
    rating: 4.9,
    progress: 85,
    status: "in_progress",
    instructor: "张教授",
    topics: ["基本概念", "会议流程", "投票规则"],
    color: "blue",
  },
  {
    id: 2,
    title: "会议主持技巧",
    description: "学习如何有效主持各类会议，提升领导力",
    level: "进阶",
    duration: "8小时",
    students: 189,
    rating: 4.8,
    progress: 60,
    status: "in_progress",
    instructor: "李老师",
    topics: ["主持技巧", "时间管理", "冲突处理"],
    color: "purple",
  },
  {
    id: 3,
    title: "辩论与表达",
    description: "提升公共演讲和辩论能力，学会有效表达观点",
    level: "进阶",
    duration: "10小时",
    students: 156,
    rating: 4.7,
    progress: 30,
    status: "in_progress",
    instructor: "王老师",
    topics: ["演讲技巧", "逻辑思维", "说服力"],
    color: "cyan",
  },
  {
    id: 4,
    title: "模拟议会实战",
    description: "通过模拟议会实践，真实体验议事过程",
    level: "实战",
    duration: "12小时",
    students: 98,
    rating: 4.9,
    progress: 0,
    status: "locked",
    instructor: "赵专家",
    topics: ["模拟实践", "角色扮演", "案例分析"],
    color: "green",
  },
  {
    id: 5,
    title: "公民参与实践",
    description: "了解公民参与的途径和方法，提升参与能力",
    level: "实战",
    duration: "8小时",
    students: 134,
    rating: 4.6,
    progress: 45,
    status: "in_progress",
    instructor: "陈老师",
    topics: ["参与途径", "权利义务", "实践案例"],
    color: "amber",
  },
  {
    id: 6,
    title: "议事文书写作",
    description: "掌握各类议事文书的写作规范和技巧",
    level: "基础",
    duration: "4小时",
    students: 203,
    rating: 4.8,
    progress: 100,
    status: "completed",
    instructor: "刘老师",
    topics: ["文书规范", "写作技巧", "模板应用"],
    color: "red",
  },
];

const learningPaths = [
  {
    id: 1,
    title: "新手入门",
    description: "适合零基础学员的完整学习路径",
    courses: 4,
    duration: "20小时",
    difficulty: "基础",
    color: "blue",
    icon: Target,
  },
  {
    id: 2,
    title: "进阶提升",
    description: "有一定基础，希望深入学习的学员",
    courses: 6,
    duration: "35小时",
    difficulty: "进阶",
    color: "purple",
    icon: TrendingUp,
  },
  {
    id: 3,
    title: "实战专家",
    description: "面向有经验学员的高级实战课程",
    courses: 8,
    duration: "50小时",
    difficulty: "专家",
    color: "amber",
    icon: Award,
  },
];

function CourseCard({
  course,
  index,
  isFestival,
  isMint,
}: {
  course: any;
  index: number;
  isFestival: boolean;
  isMint: boolean;
}) {
  const colorMap = {
    blue: {
      bg: isFestival ? "from-rose-500 to-rose-600" : isMint ? "from-teal-500 to-teal-600" : "from-blue-500 to-blue-600",
      text: isFestival ? "text-rose-600" : isMint ? "text-teal-600" : "text-blue-600",
      badge: isFestival ? "bg-rose-50 text-rose-700 border-rose-200" : isMint ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-blue-50 text-blue-700 border-blue-200",
    },
    purple: {
      bg: isFestival ? "from-blue-500 to-blue-600" : isMint ? "from-orange-500 to-orange-600" : "from-purple-500 to-purple-600",
      text: isFestival ? "text-blue-600" : isMint ? "text-orange-600" : "text-purple-600",
      badge: isFestival ? "bg-blue-50 text-blue-700 border-blue-200" : isMint ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-purple-50 text-purple-700 border-purple-200",
    },
    cyan: {
      bg: isFestival ? "from-rose-400 to-rose-500" : isMint ? "from-teal-400 to-teal-500" : "from-cyan-500 to-cyan-600",
      text: isFestival ? "text-rose-500" : isMint ? "text-teal-500" : "text-cyan-600",
      badge: isFestival ? "bg-rose-50 text-rose-600 border-rose-200" : isMint ? "bg-teal-50 text-teal-600 border-teal-200" : "bg-cyan-50 text-cyan-700 border-cyan-200",
    },
    green: {
      bg: isFestival ? "from-blue-400 to-blue-500" : isMint ? "from-emerald-500 to-emerald-600" : "from-green-500 to-green-600",
      text: isFestival ? "text-blue-500" : isMint ? "text-emerald-600" : "text-green-600",
      badge: isFestival ? "bg-blue-50 text-blue-600 border-blue-200" : isMint ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-green-50 text-green-700 border-green-200",
    },
    amber: {
      bg: isMint ? "from-orange-500 to-orange-600" : "from-amber-500 to-amber-600",
      text: isMint ? "text-orange-600" : "text-amber-600",
      badge: isMint ? "bg-orange-50 text-orange-700 border-orange-200" : "bg-amber-50 text-amber-700 border-amber-200",
    },
    red: {
      bg: isFestival ? "from-rose-600 to-rose-700" : isMint ? "from-red-500 to-orange-500" : "from-red-500 to-red-600",
      text: isFestival ? "text-rose-700" : isMint ? "text-orange-700" : "text-red-600",
      badge: isFestival ? "bg-rose-50 text-rose-800 border-rose-200" : isMint ? "bg-orange-50 text-orange-800 border-orange-200" : "bg-red-50 text-red-700 border-red-200",
    },
  };

  const colors = colorMap[course.color as keyof typeof colorMap] || colorMap.blue;

  return (
    <div className={`
      p-6 group transition-all duration-300
      ${isFestival
        ? `fc-card fc-animate-bounce fc-delay-${(index % 3 + 1) * 100}`
        : isMint
          ? `mc-card mc-animate-bounce mc-delay-${(index % 3 + 1) * 100}`
          : `card hover-lift animate-fadeInUp delay-${(index % 3 + 1) * 100}`
      }
    `}>
      {/* Course Header */}
      <div className="flex items-start justify-between mb-4">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-semibold uppercase tracking-wide ${colors.badge}`}>
          {course.level}
        </div>
        <div className="flex items-center gap-1">
          <Star className="h-4 w-4 text-amber-400 fill-current" />
          <span className="text-sm font-semibold text-gray-700">{course.rating}</span>
        </div>
      </div>

      {/* Course Title & Description */}
      <h3 className={`
        text-xl font-bold mb-3 transition-colors
        ${isFestival
          ? 'text-rose-800 group-hover:text-rose-600'
          : isMint
            ? 'text-teal-800 group-hover:text-teal-600'
            : 'text-gray-900 group-hover:text-blue-600'
        }
      `}>
        {course.title}
      </h3>
      <p className={`
        text-sm leading-relaxed mb-4
        ${isFestival ? 'text-rose-700' : isMint ? 'text-teal-700' : 'text-gray-600'}
      `}>
        {course.description}
      </p>

      {/* Course Meta */}
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

      {/* Progress Section */}
      {course.status !== "locked" && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-xs text-gray-500 uppercase tracking-wide">
              学习进度
            </span>
            <span className="text-sm font-semibold text-gray-700">
              {course.progress}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full bg-gradient-to-r ${colors.bg} transition-all duration-300`}
              style={{ width: `${course.progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Action Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {course.status === "completed" && (
            <CheckCircle className="h-5 w-5 text-green-500" />
          )}
          {course.status === "locked" && (
            <Lock className="h-5 w-5 text-gray-400" />
          )}
          <span className={`font-mono text-xs uppercase tracking-wide ${
            course.status === "completed" ? "text-green-600" :
            course.status === "locked" ? "text-gray-400" :
            colors.text
          }`}>
            {course.status === "completed" ? "已完成" :
             course.status === "locked" ? "未解锁" :
             "学习中"}
          </span>
        </div>

        <button
          className={`
            group
            ${course.status === "locked"
              ? "opacity-50 cursor-not-allowed"
              : ""
            }
            ${isFestival
              ? course.status === "locked"
                ? "fc-btn fc-btn-ghost opacity-50 cursor-not-allowed"
                : "fc-btn fc-btn-primary"
              : isMint
                ? course.status === "locked"
                  ? "mc-btn mc-btn-ghost opacity-50 cursor-not-allowed"
                  : "mc-btn mc-btn-primary"
                : course.status === "locked"
                  ? "btn btn-ghost opacity-50 cursor-not-allowed"
                  : "btn btn-primary"
            }
          `}
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

function LearningPathCard({
  path,
  index,
  isFestival,
  isMint,
}: {
  path: any;
  index: number;
  isFestival: boolean;
  isMint: boolean;
}) {
  const colorMap = {
    blue: {
      bg: isFestival ? "from-rose-500 to-rose-600" : isMint ? "from-teal-500 to-teal-600" : "from-blue-500 to-blue-600",
      text: isFestival ? "text-rose-600" : isMint ? "text-teal-600" : "text-blue-600",
    },
    purple: {
      bg: isFestival ? "from-blue-500 to-blue-600" : isMint ? "from-orange-500 to-orange-600" : "from-purple-500 to-purple-600",
      text: isFestival ? "text-blue-600" : isMint ? "text-orange-600" : "text-purple-600",
    },
    amber: {
      bg: isMint ? "from-orange-500 to-orange-600" : "from-amber-500 to-amber-600",
      text: isMint ? "text-orange-600" : "text-amber-600",
    },
  };

  const colors = colorMap[path.color as keyof typeof colorMap] || colorMap.blue;
  const Icon = path.icon;

  return (
    <div className={`
      p-8 text-center group transition-all duration-300
      ${isFestival
        ? `fc-card fc-animate-bounce fc-delay-${(index + 1) * 100}`
        : isMint
          ? `mc-card mc-animate-bounce mc-delay-${(index + 1) * 100}`
          : `card hover-lift animate-fadeInUp delay-${(index + 1) * 100}`
      }
    `}>
      <div className={`
        w-16 h-16 mx-auto rounded-2xl text-white flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110
        ${isFestival
          ? `bg-gradient-to-br ${colors.bg} group-hover:shadow-2xl fc-animate-glow`
          : isMint
            ? `bg-gradient-to-br ${colors.bg} group-hover:shadow-xl mc-animate-glow`
            : `bg-gradient-to-br ${colors.bg} group-hover:shadow-xl`
        }
      `}>
        <Icon className="h-8 w-8" />
      </div>

      <h3 className={`
        text-xl font-bold mb-3 transition-colors
        ${isFestival
          ? 'text-rose-800 group-hover:text-rose-600'
          : isMint
            ? 'text-teal-800 group-hover:text-teal-600'
            : 'text-gray-900 group-hover:text-blue-600'
        }
      `}>
        {path.title}
      </h3>

      <p className={`
        text-sm leading-relaxed mb-6
        ${isFestival ? 'text-rose-700' : isMint ? 'text-teal-700' : 'text-gray-600'}
      `}>
        {path.description}
      </p>

      <div className="grid grid-cols-3 gap-4 mb-6 text-center">
        <div>
          <div className={`
            text-lg font-bold
            ${isFestival ? 'text-rose-800' : isMint ? 'text-teal-800' : 'text-gray-900'}
          `}>
            {path.courses}
          </div>
          <div className={`
            font-mono text-xs uppercase tracking-wide
            ${isFestival ? 'text-rose-600' : isMint ? 'text-teal-600' : 'text-gray-500'}
          `}>
            门课程
          </div>
        </div>
        <div>
          <div className={`
            text-lg font-bold
            ${isFestival ? 'text-rose-800' : isMint ? 'text-teal-800' : 'text-gray-900'}
          `}>
            {path.duration}
          </div>
          <div className={`
            font-mono text-xs uppercase tracking-wide
            ${isFestival ? 'text-rose-600' : isMint ? 'text-teal-600' : 'text-gray-500'}
          `}>
            总时长
          </div>
        </div>
        <div>
          <div className={`text-lg font-bold ${colors.text}`}>{path.difficulty}</div>
          <div className={`
            font-mono text-xs uppercase tracking-wide
            ${isFestival ? 'text-rose-600' : isMint ? 'text-teal-600' : 'text-gray-500'}
          `}>
            难度
          </div>
        </div>
      </div>

      <button className={`
        w-full group
        ${isFestival
          ? 'fc-btn fc-btn-primary'
          : isMint
            ? 'mc-btn mc-btn-primary'
            : 'btn btn-primary'
        }
      `}>
        <Zap className="h-4 w-4 transition-transform group-hover:scale-110" />
        <span>{isFestival ? '开始节庆学习' : isMint ? '开始行动学习' : '开始学习'}</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </button>
    </div>
  );
}
