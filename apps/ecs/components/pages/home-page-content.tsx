"use client";

import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Users,
  Award,
  Zap,
  Star,
  LibraryBig,
  Wrench,
  FolderOpen,
  MessageSquare,
  FileText,
  KeyRound,
  Info,
  HelpCircle,
  LayoutDashboard,
  Vote,
  Scale,
  Gavel,
  Crown,
  Target,
  TrendingUp,
  Sparkles,
  Globe,
  Shield,
  UserPlus,
  Palette,
  Flag,
  Heart,
  Flame,
  Grid3X3,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "@yiqidu/ui";

export default function HomePage() {
  const { theme } = useTheme();
  const isFestival = theme === 'festival-civic';
  const isMint = theme === 'mint-campaign';
  const isCharcoal = theme === 'charcoal-grid';
  const isCopper = theme === 'copper-lecture';

  return (
    <div className="flex flex-col pt-20">
      {/* ===== 英雄区 ===== */}
      <section className={`
        relative overflow-hidden py-20 md:py-28
        ${isFestival
          ? 'fc-hero fc-pattern'
          : isMint
            ? 'mc-hero mc-pattern'
            : isCharcoal
              ? 'cg-hero cg-pattern'
              : isCopper
                ? 'cl-hero cl-pattern'
              : 'gradient-hero'
        }
      `}>
        {/* 活力背景元素 */}
        {isFestival && (
          <>
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-rose-600/20 to-rose-500/10 rounded-full blur-3xl fc-animate-float" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-blue-600/15 to-blue-500/10 rounded-full blur-3xl fc-animate-float fc-delay-300" />
            <div className="absolute top-1/2 left-1/4 w-6 h-6 bg-rose-400 rounded-full fc-animate-bounce fc-delay-500" />
            <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-blue-400 rounded-full fc-animate-bounce fc-delay-200" />
          </>
        )}

        {/* 薄荷背景元素 */}
        {isMint && (
          <>
            <div className="absolute top-10 left-10 w-28 h-28 bg-gradient-to-r from-teal-600/20 to-teal-500/10 rounded-full blur-3xl mc-animate-float" />
            <div className="absolute bottom-10 right-10 w-36 h-36 bg-gradient-to-r from-orange-500/15 to-orange-400/10 rounded-full blur-3xl mc-animate-float mc-delay-300" />
            <div className="absolute top-1/2 left-1/4 w-5 h-5 bg-teal-400 rounded-full mc-animate-bounce mc-delay-400" />
            <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-orange-400 rounded-full mc-animate-bounce mc-delay-200" />
          </>
        )}

        {/* 炭黑背景元素 */}
        {isCharcoal && (
          <>
            <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-r from-gray-700/20 to-gray-600/10 rounded-none blur-2xl" />
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-gradient-to-r from-emerald-500/15 to-emerald-400/10 rounded-none blur-2xl" />
            <div className="absolute top-1/2 left-1/4 w-4 h-4 bg-gray-700 rounded-none cg-animate-snap cg-delay-300" />
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-emerald-500 rounded-none cg-animate-snap cg-delay-100" />
          </>
        )}

        {isCopper && (
          <>
            <div className="absolute top-10 left-10 w-28 h-28 bg-gradient-to-r from-orange-900/20 to-amber-700/10 rounded-2xl blur-3xl cl-animate-float" />
            <div className="absolute bottom-10 right-10 w-36 h-36 bg-gradient-to-r from-blue-700/15 to-orange-700/10 rounded-2xl blur-3xl cl-animate-float cl-delay-300" />
            <div className="absolute top-1/2 left-1/4 w-5 h-5 bg-amber-700/80 rounded-full cl-animate-bounce cl-delay-200" />
            <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-blue-700/80 rounded-full cl-animate-bounce cl-delay-400" />
          </>
        )}

        {/* 传统背景元素 */}
        {!isFestival && !isMint && !isCharcoal && !isCopper && (
          <>
            <div className="absolute inset-0 parliament-pattern"></div>
            <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          </>
        )}

        <div className="container max-w-6xl text-center relative z-10">
          {/* 活力徽章 */}
          {isFestival && (
            <div className="fc-badge fc-animate-slide mb-8">
              <Flag className="h-4 w-4" />
              <span>活力课堂 · 规则研修</span>
              <Sparkles className="h-4 w-4" />
            </div>
          )}

          {/* 炭黑徽章 */}
          {isCharcoal && (
            <div className="cg-badge cg-animate-slide mb-8">
              <Grid3X3 className="h-4 w-4" />
              <span>炭黑栅格 · 结构研修</span>
              <Crown className="h-4 w-4" />
            </div>
          )}

          {isCopper && (
            <div className="cl-badge cl-animate-slide mb-8">
              <BookOpen className="h-4 w-4" />
              <span>铜色讲堂 · 深度研修</span>
              <Sparkles className="h-4 w-4" />
            </div>
          )}

          {/* 主标题 */}
          <h1 className={`
            tracking-tight leading-[1.1] mb-6
            ${isFestival
              ? 'fc-title-hero fc-animate-slide fc-delay-100'
              : isMint
                ? 'mc-title-hero mc-animate-slide mc-delay-100'
                : isCharcoal
                  ? 'cg-title-hero cg-animate-slide cg-delay-100'
                  : isCopper
                    ? 'cl-title-hero cl-animate-slide cl-delay-100'
                  : 'text-hero text-gray-900 animate-fadeInUp delay-100'
            }
          `}>
            {isFestival ? (
              <>
                掌握议事规则<br />
                <span className="relative">
                  提升课堂沟通力
                  <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-rose-600 via-blue-600 to-rose-600 rounded-full opacity-40 fc-animate-glow"></div>
                </span>
              </>
            ) : isMint ? (
              <>
                清新实践训练<br />
                <span className="relative">
                  激发协作意识
                  <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-teal-600 via-orange-500 to-teal-600 rounded-full opacity-40 mc-animate-glow"></div>
                </span>
              </>
            ) : isCharcoal ? (
              <>
                结构化议事<br />
                <span className="relative">
                  提升协作效率
                  <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-gray-700 via-emerald-500 to-gray-700 opacity-60"></div>
                </span>
              </>
            ) : isCopper ? (
              <>
                铜色讲堂议事<br />
                <span className="relative">
                  沉淀表达能力
                  <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-orange-900 via-amber-700 to-blue-700 rounded-full opacity-50 cl-animate-glow"></div>
                </span>
              </>
            ) : (
              <>
                掌握议事规则 <br className="hidden sm:block" />
                <span className="text-gradient-political relative">
                  提升课堂沟通素养
                  <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 rounded-full opacity-30"></div>
                </span>
              </>
            )}
          </h1>

          {/* 副标题 */}
          <p className={`
            max-w-3xl mx-auto leading-relaxed mb-10
            ${isFestival
              ? 'text-xl text-rose-800 fc-animate-slide fc-delay-200'
              : isMint
                ? 'text-xl text-teal-800 mc-animate-slide mc-delay-200'
                : isCharcoal
                  ? 'text-xl text-gray-700 cg-animate-slide cg-delay-200'
                  : isCopper
                    ? 'text-xl text-orange-800 cl-animate-slide cl-delay-200'
                  : 'text-body text-gray-600 animate-fadeInUp delay-200'
            }
          `}>
            {isFestival ? (
              <>
                加入面向教师与家长的活力课堂培训！在轻松的学习氛围中
                <br className="hidden md:block" />
                掌握罗伯特议事规则，提升课堂讨论的组织与协作能力。
              </>
            ) : isMint ? (
              <>
                开启清新的实践训练！在清爽的学习节奏中，从基础到进阶
                <br className="hidden md:block" />
                系统掌握议事技能，强化课堂表达与协作热情。
              </>
            ) : isCharcoal ? (
              <>
                构建结构化的议事框架！在清晰明确的学习体系中，从基础理论到实战应用
                <br className="hidden md:block" />
                精准掌握议事规则，提升课堂协作效率。
              </>
            ) : isCopper ? (
              <>
                走进铜色讲堂的深度学习场域！在层层递进的课程与案例中，从概念到表达
                <br className="hidden md:block" />
                系统训练规则思维、课堂发言与共识构建能力。
              </>
            ) : (
              <>
                从理论学习到模拟演练，全方位掌握罗伯特议事规则。
                <br className="hidden md:block" />
                面向教师与家长的系统培训，支持更清晰的表达与协作。
              </>
            )}
          </p>

          {/* CTA 按钮 */}
          <div className={`
            flex flex-col sm:flex-row gap-6 justify-center mb-12
            ${isFestival
              ? 'fc-animate-slide fc-delay-300'
              : isMint
                ? 'mc-animate-slide mc-delay-300'
                : isCharcoal
                  ? 'cg-animate-slide cg-delay-300'
                  : isCopper
                    ? 'cl-animate-slide cl-delay-300'
                  : 'animate-fadeInUp delay-300'
            }
          `}>
            <Link href="/course" className={`
              group inline-flex items-center gap-3
              ${isFestival
                ? 'fc-btn fc-btn-primary'
                : isMint
                  ? 'mc-btn mc-btn-primary'
                  : isCharcoal
                    ? 'cg-btn cg-btn-primary'
                    : isCopper
                      ? 'cl-btn cl-btn-primary'
                    : 'btn btn-primary'
              }
            `}>
              {isFestival ? <Flame className="h-5 w-5" /> : isMint ? <Sparkles className="h-5 w-5" /> : isCharcoal ? <Grid3X3 className="h-5 w-5" /> : isCopper ? <BookOpen className="h-5 w-5" /> : <BookOpen className="h-5 w-5" />}
              <span>{isFestival ? '立即参与' : isMint ? '开始实践' : isCharcoal ? '开始构建' : isCopper ? '进入讲堂' : '开始学习'}</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/about" className={`
              group inline-flex items-center gap-3
              ${isFestival
                ? 'fc-btn fc-btn-ghost'
                : isMint
                  ? 'mc-btn mc-btn-ghost'
                  : isCharcoal
                    ? 'cg-btn cg-btn-ghost'
                    : isCopper
                      ? 'cl-btn cl-btn-ghost'
                    : 'btn btn-ghost'
              }
            `}>
              {isFestival ? <Heart className="h-5 w-5" /> : isMint ? <Flag className="h-5 w-5" /> : isCharcoal ? <Crown className="h-5 w-5" /> : isCopper ? <Info className="h-5 w-5" /> : <Info className="h-5 w-5" />}
              <span>{isFestival ? '了解活力课堂' : isMint ? '了解实践' : isCharcoal ? '了解结构' : isCopper ? '了解讲堂' : '了解更多'}</span>
            </Link>
          </div>

          {/* 统计指标 */}
          <div className={`
            grid grid-cols-2 md:grid-cols-4 gap-7
            ${isFestival
              ? 'fc-animate-slide fc-delay-400'
              : isMint
                ? 'mc-animate-slide mc-delay-400'
                : isCharcoal
                  ? 'cg-animate-slide cg-delay-400'
                  : isCopper
                    ? 'cl-animate-slide cl-delay-400'
                  : 'animate-fadeInUp delay-400'
            }
          `}>
            {[
              {
                icon: Users,
                value: "500+",
                label: isFestival ? "活力学员" : isMint ? "实践学员" : isCharcoal ? "结构学员" : isCopper ? "讲堂学员" : "活跃学员",
                color: isFestival ? "text-rose-600" : isMint ? "text-teal-600" : isCharcoal ? "text-gray-700" : isCopper ? "text-orange-700" : "text-blue-600"
              },
              {
                icon: BookOpen,
                value: "12+",
                label: isFestival ? "活力课程" : isMint ? "实践课程" : isCharcoal ? "结构课程" : isCopper ? "讲堂课程" : "精品课程",
                color: isFestival ? "text-blue-600" : isMint ? "text-orange-600" : isCharcoal ? "text-emerald-600" : isCopper ? "text-blue-700" : "text-purple-600"
              },
              {
                icon: Vote,
                value: "50+",
                label: isFestival ? "课堂演练" : isMint ? "实践演练" : isCharcoal ? "结构演练" : isCopper ? "讲堂研讨" : "模拟会议",
                color: isFestival ? "text-rose-500" : isMint ? "text-teal-500" : isCharcoal ? "text-gray-600" : isCopper ? "text-amber-700" : "text-amber-600"
              },
              {
                icon: Award,
                value: "98%",
                label: isFestival ? "学员好评" : isMint ? "实践好评" : isCharcoal ? "结构好评" : isCopper ? "讲堂好评" : "好评率",
                color: "text-green-600"
              },
            ].map((stat, i) => (
              <div key={stat.label} className={`
                text-center
                ${isFestival
                  ? `fc-stat-card fc-animate-bounce fc-delay-${(i + 5) * 100}`
                  : isMint
                    ? `mc-stat-card mc-animate-bounce mc-delay-${(i + 5) * 100}`
                    : isCharcoal
                      ? `cg-stat-card cg-animate-snap cg-delay-${(i + 5) * 100}`
                      : isCopper
                        ? `cl-stat-card cl-animate-bounce cl-delay-${(i + 5) * 100}`
                      : `animate-scaleIn delay-${(i + 5) * 100}`
                }
              `}>
                <div className="flex items-center justify-center mb-3">
                  <div className={`
                    p-3 shadow-lg
                    ${isFestival
                      ? 'bg-gradient-to-br from-rose-500 to-rose-600 text-white rounded-2xl'
                      : isMint
                        ? 'bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-2xl'
                        : isCharcoal
                          ? 'bg-gradient-to-br from-gray-700 to-gray-800 text-white rounded-none border-2 border-gray-700'
                        : isCopper
                          ? 'bg-gradient-to-br from-orange-800 to-amber-700 text-white rounded-2xl'
                          : `bg-white ${stat.color} rounded-2xl`
                    }
                  `}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className={`
                  text-3xl md:text-4xl font-bold mb-1
                  ${isFestival ? 'fc-stat-value' : isMint ? 'mc-stat-value' : isCharcoal ? 'cg-stat-value' : isCopper ? 'cl-stat-value' : 'text-gray-900'}
                `}>
                  {stat.value}
                </div>
                <div className={`
                  font-mono text-sm uppercase tracking-wide
                  ${isFestival ? 'fc-stat-label' : isMint ? 'mc-stat-label' : isCharcoal ? 'cg-stat-label' : isCopper ? 'cl-stat-label' : 'text-gray-500'}
                `}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== 特色功能区 ===== */}
      <section className={`
        py-24 md:py-32 relative
        ${isFestival ? 'bg-white' : 'bg-white'}
      `}>
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-white"></div>
        <div className="container max-w-7xl relative z-10">
          <div className="text-center mb-20">
            <div className={`
              inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-mono font-semibold mb-6
              ${isFestival
                ? 'fc-badge fc-animate-glow'
                : isCopper
                  ? 'cl-badge cl-animate-glow'
                : isCharcoal
                  ? 'cg-badge cg-animate-glow'
                : 'bg-blue-50 border border-blue-200 text-blue-700 animate-fadeInUp'
              }
            `}>
              <Sparkles className="h-4 w-4" />
              <span className="uppercase tracking-wide">
                {isFestival ? '活力亮点' : isMint ? '实践亮点' : isCharcoal ? '结构亮点' : isCopper ? '讲堂亮点' : '核心优势'}
              </span>
            </div>
            <h2 className={`
              mb-6
              ${isFestival
                ? 'fc-title-section fc-animate-slide fc-delay-100'
                : isCopper
                  ? 'cl-title-section cl-animate-slide cl-delay-100'
                : isCharcoal
                  ? 'cg-title-section cg-animate-slide cg-delay-100'
                : 'text-display text-gray-900 animate-fadeInUp delay-100'
              }
            `}>
              {isFestival ? '为什么选择活力课堂？' : isMint ? '为什么选择薄荷实践？' : isCharcoal ? '为什么选择炭黑栅格？' : isCopper ? '为什么选择铜色讲堂？' : '为什么选择议起读？'}
            </h2>
            <p className={`
              max-w-2xl mx-auto
              ${isFestival
                ? 'text-lg text-rose-800 fc-animate-slide fc-delay-200'
                : isCopper
                  ? 'text-lg text-orange-800 cl-animate-slide cl-delay-200'
                : isCharcoal
                  ? 'text-lg text-gray-700 cg-animate-slide cg-delay-200'
                : 'text-body text-gray-600 animate-fadeInUp delay-200'
              }
            `}>
              {isFestival
                ? '在活力课堂氛围中，体验规则化沟通与协作训练'
                : isMint
                  ? '在清新实践节奏中，建立可执行的课堂沟通方法'
                : isCopper
                  ? '在讲堂化的知识脉络中，系统建立可表达、可协作、可复盘的议事能力'
                : isCharcoal
                  ? '在结构化栅格框架中，建立清晰、可执行的议事规则学习路径'
                : '理论与实践相结合的系统化学习方案，帮助教师与家长形成可落地的课堂沟通方法'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Scale,
                title: isFestival ? "活力课程体系" : isMint ? "实践课程体系" : isCopper ? "讲堂课程体系" : "系统课程",
                description: isFestival
                  ? "在活力课堂氛围中，从基础到高阶系统掌握议事规则，让学习更有节奏与目标。"
                  : isMint
                    ? "围绕实践任务与案例演练推进学习，让规则理解逐步转化为课堂应用。"
                  : isCopper
                    ? "围绕规则原理、案例拆解与表达训练构建讲堂体系，让学习者稳步建立课堂表达框架。"
                  : isCharcoal
                    ? "模块化课程体系，从规则拆解到场景应用分层推进，帮助你形成可复用的课堂讨论框架。"
                    : "由浅入深的课程体系，从基础概念到高阶应用全覆盖，建立完整的课堂规则框架。",
                color: "blue",
                gradient: isFestival ? "from-rose-500 to-rose-600" : isCharcoal ? "from-gray-700 to-gray-800" : isCopper ? "from-orange-800 to-amber-700" : "from-blue-500 to-blue-600"
              },
              {
                icon: Zap,
                title: isFestival ? "互动课堂" : isMint ? "实践互动" : isCopper ? "讲堂研讨" : "互动课堂",
                description: isFestival
                  ? "实时投票、举手发言，在课堂互动中体验规则化讨论，让每次参与更有秩序。"
                  : isMint
                    ? "以任务驱动的课堂互动，强化表达、倾听与反馈的闭环。"
                  : isCopper
                    ? "从讲解到提问再到观点陈述，形成节奏清晰的课堂互动，让每次发言都更有依据与逻辑。"
                  : isCharcoal
                    ? "流程化互动、规则化发言，还原课堂讨论的节奏与边界，在实践中提升表达质量。"
                    : "实时投票、举手发言，还原课堂讨论场景，在实践中掌握规则精髓。",
                color: "amber",
                gradient: isFestival ? "from-blue-500 to-blue-600" : isCharcoal ? "from-emerald-600 to-emerald-500" : isCopper ? "from-blue-700 to-blue-600" : "from-amber-500 to-orange-500"
              },
              {
                icon: Users,
                title: isFestival ? "共学社群" : isMint ? "实践共学" : isCopper ? "讲堂共学社群" : "社群共学",
                description: isFestival
                  ? "与同行教师与家长一起共学，在讨论与复盘中提升表达与协作能力。"
                  : isMint
                    ? "在实践任务与案例讨论中协同练习，形成稳定的课堂协作方法。"
                  : isCopper
                    ? "与同伴在阅读、讨论与复盘中共同打磨表达能力，形成兼具深度与温度的讲堂学习共同体。"
                  : isCharcoal
                    ? "与伙伴在统一结构下协同练习，在复盘中持续优化规则运用，形成高质量学习共同体。"
                    : "与同行教师与家长一起练习，在讨论中共同进步，形成学习共同体。",
                color: "emerald",
                gradient: isFestival ? "from-rose-400 to-rose-500" : isCharcoal ? "from-gray-600 to-gray-700" : isCopper ? "from-orange-700 to-blue-700" : "from-emerald-500 to-green-500"
              },
              {
                icon: Crown,
                title: isFestival ? "课程认证" : isMint ? "实践认证" : isCopper ? "讲堂能力认证" : "能力认证",
                description: isFestival
                ? "完成课程与实践挑战，获得学习档案与能力认证，展示课堂协作与表达进阶成果。"
                  : isMint
                    ? "完成实践任务与展示，获得学习档案与能力认证，沉淀可复用的课堂方法。"
                  : isCopper
                    ? "完成讲堂任务与专题答辩，获得学习档案与能力认证，清晰展示你的课堂表达进阶成果。"
                  : isCharcoal
                    ? "完成结构化挑战，获得能力认证与过程证据，清晰展示你的课堂协作能力水平。"
                    : "完成课程与挑战，获得官方认证的结业证书，证明你的课堂沟通能力水平。",
                color: "violet",
                gradient: isFestival ? "from-blue-400 to-blue-500" : isCharcoal ? "from-emerald-500 to-emerald-600" : isCopper ? "from-amber-700 to-orange-800" : "from-violet-500 to-purple-500"
              },
            ].map((feature, i) => (
              <FeatureCard key={feature.title} feature={feature} index={i} isFestival={isFestival} isCharcoal={isCharcoal} isCopper={isCopper} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== 快速导航区 ===== */}
      <section className={`
        py-20 md:py-24 relative
        ${isFestival
          ? 'bg-gradient-to-br from-rose-50 to-blue-50/30 fc-pattern'
          : isCharcoal
            ? 'bg-gradient-to-br from-gray-100 to-emerald-50/40 cg-pattern'
            : isCopper
              ? 'bg-gradient-to-br from-orange-50 to-blue-50/40 cl-pattern'
          : 'bg-gradient-to-br from-gray-50 to-blue-50/30'
        }
      `}>
        {!isFestival && !isCharcoal && !isCopper && (
          <div className="absolute inset-0 parliament-pattern opacity-30"></div>
        )}
        <div className="container max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <div className={`
              inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-mono font-semibold mb-6
              ${isFestival
                ? 'bg-white/80 backdrop-blur-sm border border-rose-200 text-rose-700 fc-animate-glow'
                : isCharcoal
                  ? 'bg-white/90 border border-gray-400 text-gray-800 cg-animate-glow'
                  : isCopper
                    ? 'bg-white/90 border border-orange-200 text-orange-800 cl-animate-glow'
                : 'bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 animate-fadeInUp'
              }
            `}>
              <Target className="h-4 w-4" />
              <span className="uppercase tracking-wide">
                {isFestival ? '活力导航' : isMint ? '实践导航' : isCharcoal ? '结构导航' : isCopper ? '讲堂导航' : '快速导航'}
              </span>
            </div>
            <h2 className={`
              mb-4
              ${isFestival
                ? 'fc-title-section fc-animate-slide fc-delay-100'
                : isCharcoal
                  ? 'cg-title-section cg-animate-slide cg-delay-100'
                  : isCopper
                    ? 'cl-title-section cl-animate-slide cl-delay-100'
                : 'text-display text-gray-900 animate-fadeInUp delay-100'
              }
            `}>
              {isFestival ? '活力入口' : isMint ? '实践入口' : isCharcoal ? '结构入口' : isCopper ? '讲堂入口' : '快速入口'}
            </h2>
            <p className={`
              ${isFestival
                ? 'text-lg text-rose-800 fc-animate-slide fc-delay-200'
                : isCharcoal
                  ? 'text-lg text-gray-700 cg-animate-slide cg-delay-200'
                  : isCopper
                    ? 'text-lg text-orange-800 cl-animate-slide cl-delay-200'
                : 'text-body text-gray-600 animate-fadeInUp delay-200'
              }
            `}>
              {isFestival
                ? '从这里开启你的课堂协作训练之旅'
                : isMint
                  ? '从这里进入实践训练与课堂协作页面'
                : isCharcoal
                  ? '从这里进入结构化学习、互动与管理页面'
                  : isCopper
                    ? '从这里进入讲堂课程、阅读研讨与实践训练页面'
                : '从首页直接进入学习、互动与管理相关页面'
              }
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {quickEntries.map((entry, index) => (
              <QuickEntryCard key={entry.href} entry={entry} index={index} isFestival={isFestival} isCharcoal={isCharcoal} isCopper={isCopper} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== 学习路径区 ===== */}
      <section className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent"></div>
        <div className="container max-w-6xl relative z-10">
          <div className="text-center mb-20">
            <div className={`
              inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-mono font-semibold mb-6
              ${isFestival
                ? 'fc-badge fc-animate-glow'
                : isCopper
                  ? 'cl-badge cl-animate-glow'
                : isCharcoal
                  ? 'cg-badge cg-animate-glow'
                : 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700 animate-fadeInUp'
              }
            `}>
              <TrendingUp className="h-4 w-4" />
              <span className="uppercase tracking-wide">
                {isFestival ? '活力路径' : isMint ? '实践路径' : isCharcoal ? '结构路径' : isCopper ? '讲堂路径' : '学习路径'}
              </span>
            </div>
            <h2 className={`
              mb-6
              ${isFestival
                ? 'fc-title-section fc-animate-slide fc-delay-100'
                : isCharcoal
                  ? 'cg-title-section cg-animate-slide cg-delay-100'
                  : isCopper
                    ? 'cl-title-section cl-animate-slide cl-delay-100'
                : 'text-display text-gray-900 animate-fadeInUp delay-100'
              }
            `}>
              {isFestival ? '你的活力之旅' : isMint ? '你的实践之旅' : isCharcoal ? '你的结构之旅' : isCopper ? '你的讲堂之旅' : '你的学习路径'}
       </h2>
            <p className={`
              max-w-2xl mx-auto
              ${isFestival
                ? 'text-lg text-rose-800 fc-animate-slide fc-delay-200'
                : isCharcoal
                  ? 'text-lg text-gray-700 cg-animate-slide cg-delay-200'
                  : isCopper
                    ? 'text-lg text-orange-800 cl-animate-slide cl-delay-200'
                : 'text-body text-gray-600 animate-fadeInUp delay-200'
              }
            `}>
              {isFestival
                ? '三步开启课堂协作训练，从入门到熟练的清晰成长路径'
                : isMint
                  ? '三步开启实践训练，从新手到熟练的稳步成长路径'
                  : isCharcoal
                    ? '三步开启结构化议事学习，从新手到高效协作者的清晰成长路径'
                    : isCopper
                      ? '三步开启讲堂式议事学习，从入门理解到表达实践的沉浸成长路径'
                : '三步开启议事规则学习之旅，从新手到熟练的完整成长路径'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* 连接线 */}
            {!isFestival && !isCharcoal && !isCopper && (
              <div className="hidden md:block absolute top-1/2 left-1/3 right-1/3 h-px bg-gradient-to-r from-blue-200 via-purple-200 to-amber-200 transform -translate-y-1/2 z-0"></div>
            )}

            {[
              {
                step: "01",
                title: isFestival ? "加入课程" : isMint ? "开始实践" : isCopper ? "进入讲堂" : "注册加入",
                desc: isFestival
                  ? "创建账号并输入邀请码，立即进入活力课堂学习，开启你的课堂沟通与协作之旅。"
                  : isMint
                    ? "创建账号并输入邀请码，立即进入实践训练空间，开启你的课堂表达与协作之旅。"
                  : isCopper
                    ? "创建账号并输入邀请码，立即进入讲堂学习空间，开启你的规则表达与课堂协作训练。"
                  : isCharcoal
                    ? "创建账号并输入邀请码，立即进入结构化学习体系，开启你的清晰成长路径。"
                    : "创建账号并输入邀请码，立即解锁全部课程内容，开始你的学习之旅。",
                icon: Shield,
                color: isFestival ? "rose" : isCharcoal ? "emerald" : isCopper ? "orange" : "blue"
              },
              {
                step: "02",
                title: isFestival ? "课程学习" : isMint ? "实践学习" : isCopper ? "讲堂学习" : "系统学习",
                desc: isFestival
                  ? "在活力课堂节奏中系统学习，从基础原则到高阶应用，建立可执行的课堂规则体系。"
                  : isMint
                    ? "在实践节奏中完成规则学习与案例拆解，强化课堂应用能力。"
                  : isCopper
                    ? "在讲堂节奏中完成规则学习与案例拆解，从基础原则到高阶应用稳步建立知识体系。"
                  : isCharcoal
                    ? "在统一结构和清晰模块中学习，从基础原则到高阶应用稳步推进，建立可执行知识体系。"
                    : "跟随课程体系，从基础原则到高阶应用循序渐进，建立完整知识体系。",
                icon: BookOpen,
                color: isFestival ? "blue" : isCharcoal ? "gray" : isCopper ? "blue" : "purple"
              },
              {
                step: "03",
                title: isFestival ? "课堂演练" : isMint ? "实践演练" : isCopper ? "讲堂实战" : "模拟实战",
                desc: isFestival
                  ? "参与模拟课堂与讨论演练，在规则化流程中真实练习，提升协作与表达能力。"
                  : isMint
                    ? "参与实践任务与模拟会议，在观点表达和规则运用中持续复盘，形成稳定实践能力。"
                  : isCopper
                    ? "参与讲堂研讨与模拟会议，在观点表达和规则运用中持续复盘，形成稳定实践能力。"
                  : isCharcoal
                    ? "参与结构化模拟会议，在标准流程中演练规则应用，持续提升协作与决策质量。"
                    : "参与互动课堂，在模拟会议中真实演练所学规则，提升实践能力。",
                icon: Gavel,
                color: isFestival ? "rose" : isCharcoal ? "emerald" : isCopper ? "amber" : "amber"
              },
            ].map((item, i) => (
              <div key={item.step} className={`
                relative z-10
                ${isFestival
                  ? `fc-animate-bounce fc-delay-${(i + 1) * 100}`
                  : isCharcoal
                    ? `cg-animate-snap cg-delay-${(i + 1) * 100}`
                    : isCopper
                      ? `cl-animate-bounce cl-delay-${(i + 1) * 100}`
                  : `animate-fadeInUp delay-${(i + 1) * 100}`
                }
              `}>
                <div className={`
                  p-8 text-center group
                  ${isFestival
                    ? 'fc-card'
                    : isCharcoal
                      ? 'cg-card'
                      : isCopper
                        ? 'cl-card'
                    : 'card hover-lift'
                  }
                `}>
                  {/* 步骤图标 */}
                  <div className="relative mb-6">
                    <div className={`
                      w-16 h-16 mx-auto rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300
                      ${item.color === 'blue' ? 'bg-gradient-to-br from-blue-500 to-blue-600' :
                        item.color === 'purple' ? 'bg-gradient-to-br from-purple-500 to-purple-600' :
                        item.color === 'gray' ? 'bg-gradient-to-br from-gray-700 to-gray-800' :
                        item.color === 'orange' ? 'bg-gradient-to-br from-orange-800 to-amber-700' :
                        item.color === 'emerald' ? 'bg-gradient-to-br from-emerald-500 to-emerald-600' :
                        item.color === 'rose' ? 'bg-gradient-to-br from-rose-500 to-rose-600' :
                        'bg-gradient-to-br from-amber-500 to-orange-500'
                      }
                    `}>
                      <item.icon className="h-8 w-8 text-white" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full border-2 border-gray-200 flex items-center justify-center">
                      <span className="font-mono text-xs font-bold text-gray-600">{item.step}</span>
                    </div>
                  </div>

                  <h3 className={`
                    text-xl font-bold mb-4
                    ${isFestival ? 'text-rose-800' : isCharcoal ? 'text-gray-900' : isCopper ? 'text-orange-900' : 'text-gray-900'}
                  `}>
                    {item.title}
                  </h3>
                  <p className={`
                    text-sm leading-relaxed
                    ${isFestival ? 'text-rose-700' : isCharcoal ? 'text-gray-700' : isCopper ? 'text-orange-800' : 'text-gray-600'}
                  `}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA 区域 ===== */}
      <section className={`
        py-24 md:py-32 relative overflow-hidden
        ${isFestival
          ? 'bg-gradient-to-br from-rose-600 via-rose-500 to-blue-600'
          : isCharcoal
            ? 'bg-gradient-to-br from-gray-800 via-gray-700 to-emerald-600'
            : isCopper
              ? 'bg-gradient-to-br from-orange-900 via-amber-700 to-blue-700'
          : 'gradient-political'
        }
      `}>
        {!isFestival && !isCharcoal && !isCopper && (
          <div className="absolute inset-0 parliament-pattern opacity-10"></div>
        )}

        {/* 活力浮动元素 */}
        {isFestival && (
          <>
            <div className="absolute top-20 left-20 w-32 h-32 bg-white/10 rounded-full blur-2xl fc-animate-float" />
            <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-400/20 rounded-full blur-2xl fc-animate-float fc-delay-300" />
            <div className="absolute top-1/4 left-1/2 w-8 h-8 bg-white/20 rounded-full fc-animate-bounce fc-delay-500" />
          </>
        )}

        <div className="container max-w-5xl relative z-10">
          <div className="text-center text-white">
            <div className={`
              inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-mono font-semibold mb-8
              ${isFestival
                ? 'bg-white/20 backdrop-blur-sm border border-white/30 fc-animate-glow'
                : isCharcoal
                  ? 'bg-white/10 border border-white/30 cg-animate-glow'
                  : isCopper
                    ? 'bg-white/15 border border-white/30 cl-animate-glow'
                : 'bg-white/10 backdrop-blur-sm border border-white/20 animate-fadeInUp'
              }
            `}>
              <Star className={`h-4 w-4 ${isFestival ? 'text-yellow-300' : isCopper ? 'text-orange-200' : 'text-amber-300'}`} />
              <span className="uppercase tracking-wide">
                {isFestival ? '加入课程' : isMint ? '加入实践' : isCharcoal ? '加入结构训练' : isCopper ? '加入讲堂' : '立即开始'}
              </span>
            </div>

            <h2 className={`
              mb-6
              ${isFestival
                ? 'fc-title-section text-white fc-animate-slide fc-delay-100'
                : isCharcoal
                  ? 'cg-title-section text-white cg-animate-slide cg-delay-100'
                  : isCopper
                    ? 'cl-title-section text-white cl-animate-slide cl-delay-100'
                : 'text-display animate-fadeInUp delay-100'
              }
            `}>
              {isFestival ? '准备好开始培训了吗？' : isMint ? '准备好开始实践了吗？' : isCharcoal ? '准备好构建课堂框架了吗？' : isCopper ? '准备好进入铜色讲堂了吗？' : '准备好开始了吗？'}
            </h2>

            <p className={`
              max-w-2xl mx-auto mb-12 leading-relaxed
              ${isFestival
                ? 'text-xl text-rose-100 fc-animate-slide fc-delay-200'
                : isCharcoal
                  ? 'text-xl text-gray-100 cg-animate-slide cg-delay-200'
                  : isCopper
                    ? 'text-xl text-orange-100 cl-animate-slide cl-delay-200'
                : 'text-body text-blue-100 animate-fadeInUp delay-200'
              }
            `}>
              {isFestival ? (
                <>
                  注册账号并输入邀请码，即可加入教师与家长培训课程。
                  <br className="hidden md:block" />
                  与更多教师与家长一同学习，形成可落地的课堂协作方法。
                </>
              ) : (
                <>
                  {isCharcoal ? '注册账号并输入邀请码，即可进入结构化课程与互动训练体系。' : isCopper ? '注册账号并输入邀请码，即可进入讲堂课程与专题研讨体系。' : isMint ? '注册账号并输入邀请码，即可进入实践课程与训练体系。' : '注册账号并输入邀请码，即可解锁全部课程内容与互动功能。'}
                  <br className="hidden md:block" />
                  {isCharcoal ? '加入议起读，在清晰规则和流程中与同伴协作成长。' : isCopper ? '加入议起读，在讲解、练习与复盘中与同伴协作成长。' : isMint ? '加入议起读，在实践训练与复盘中与同伴协作成长。' : '加入议起读，与更多教师与家长共同成长，形成可落地的课堂协作方法。'}
                </>
              )}
            </p>

            <div className={`
              flex flex-col sm:flex-row gap-6 justify-center
              ${isFestival
                ? 'fc-animate-slide fc-delay-300'
                : isCharcoal
                  ? 'cg-animate-slide cg-delay-300'
                  : isCopper
                    ? 'cl-animate-slide cl-delay-300'
                : 'animate-fadeInUp delay-300'
              }
            `}>
              <Link href="/register" className={`
                group inline-flex items-center gap-3
                ${isFestival
                  ? 'fc-btn fc-btn-accent shadow-2xl'
                  : isCharcoal
                    ? 'cg-btn cg-btn-accent shadow-2xl'
                    : isCopper
                      ? 'cl-btn cl-btn-accent shadow-2xl'
                  : 'btn btn-accent shadow-accent'
                }
              `}>
                <UserPlus className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span>{isFestival ? '立即加入课程' : isMint ? '立即加入实践' : isCharcoal ? '立即加入结构训练' : isCopper ? '立即加入讲堂' : '立即注册'}</span>
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link href="/course" className={`
                group inline-flex items-center gap-3
                ${isFestival
                  ? 'fc-btn fc-btn-ghost border-white/30 text-white hover:bg-white/10'
                  : isCharcoal
                    ? 'cg-btn cg-btn-ghost border-white/30 text-white hover:bg-white/10'
                    : isCopper
                      ? 'cl-btn cl-btn-ghost border-white/30 text-white hover:bg-white/10'
                  : 'btn btn-ghost border-white/30 text-white hover:bg-white/10'
                }
              `}>
                <Globe className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span>{isFestival ? '浏览活力课程' : isMint ? '浏览实践课程' : isCharcoal ? '浏览结构课程' : isCopper ? '浏览讲堂课程' : '浏览课程'}</span>
              </Link>
            </div>

            {/* 社会证明 */}
            <div className={`
              mt-16 pt-8 border-t border-white/20
              ${isFestival
                ? 'fc-animate-slide fc-delay-400'
                : isCharcoal
                  ? 'cg-animate-slide cg-delay-400'
                  : isCopper
                    ? 'cl-animate-slide cl-delay-400'
                : 'animate-fadeInUp delay-400'
              }
            `}>
              <p className="font-mono text-sm text-blue-200 mb-4 uppercase tracking-wide">
                {isFestival ? '已有 500+ 学员加入课程' : isMint ? '已有 500+ 学员加入实践体系' : isCharcoal ? '已有 500+ 学员加入结构体系' : isCopper ? '已有 500+ 学员加入讲堂体系' : '已有 500+ 学员加入我们'}
              </p>
              <div className="flex justify-center items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 fill-current ${isFestival ? 'text-yellow-300' : isCopper ? 'text-orange-200' : 'text-amber-300'}`} />
                ))}
                <span className={`ml-2 font-semibold ${isFestival ? 'text-rose-100' : isCharcoal ? 'text-emerald-100' : isCopper ? 'text-orange-100' : 'text-blue-100'}`}>
                  4.9/5.0 {isFestival ? '学员评分' : isMint ? '实践评分' : isCharcoal ? '结构评分' : isCopper ? '讲堂评分' : '学员评分'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

type QuickEntry = {
  title: string;
  href: string;
  icon: LucideIcon;
  description?: string;
};

type HomeFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  gradient: string;
};

const quickEntries: QuickEntry[] = [
  { title: "课程总览", href: "/course", icon: BookOpen, description: "浏览所有课程" },
  { title: "学习中心", href: "/rules", icon: Scale, description: "议事规则学习" },
  { title: "阅读探究", href: "/reading", icon: LibraryBig, description: "深度阅读材料" },
  { title: "工具库", href: "/tools", icon: Wrench, description: "实用工具集合" },
  { title: "资源中心", href: "/resources", icon: FolderOpen, description: "学习资源下载" },
  { title: "互动课堂", href: "/interact", icon: Users, description: "实时互动学习" },
  { title: "作业复盘", href: "/homework", icon: FileText, description: "作业与反思" },
  { title: "留言讨论", href: "/discussion", icon: MessageSquare, description: "社区讨论" },
  { title: "输入邀请码", href: "/invite", icon: KeyRound, description: "激活学习权限" },
  { title: "风格实验室", href: "/style-lab", icon: Palette, description: "20种首页提案" },
  { title: "管理后台", href: "/admin", icon: LayoutDashboard, description: "系统管理" },
  { title: "关于课程", href: "/about", icon: Info, description: "了解更多信息" },
  { title: "常见问题", href: "/faq", icon: HelpCircle, description: "FAQ 帮助" },
];

function QuickEntryCard({ entry, index, isFestival, isCharcoal, isCopper }: { entry: QuickEntry; index: number; isFestival: boolean; isCharcoal: boolean; isCopper: boolean }) {
  const Icon = entry.icon;

  return (
    <Link
      href={entry.href}
      className={`
        group cursor-pointer
        ${isFestival
          ? `fc-quick-entry fc-animate-bounce fc-delay-${(index % 6 + 1) * 50}`
          : isCharcoal
            ? `cg-quick-entry cg-animate-snap cg-delay-${(index % 6 + 1) * 50}`
            : isCopper
              ? `cl-quick-entry cl-animate-bounce cl-delay-${(index % 6 + 1) * 50}`
          : `card p-6 hover-lift animate-scaleIn delay-${(index % 6 + 1) * 50}`
        }
      `}
    >
      <div className="flex flex-col items-center text-center">
        <div className={`
          w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300
          ${isFestival
            ? 'fc-quick-icon'
            : isCharcoal
              ? 'cg-quick-icon'
              : isCopper
                ? 'cl-quick-icon'
            : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white group-hover:shadow-political group-hover:scale-110'
          }
        `}>
          <Icon className="h-6 w-6" />
        </div>
        <h3 className={`
          font-semibold mb-2 transition-colors
          ${isFestival
            ? 'text-rose-800 group-hover:text-rose-600'
            : isCharcoal
              ? 'text-gray-900 group-hover:text-emerald-700'
              : isCopper
                ? 'text-orange-900 group-hover:text-orange-700'
            : 'text-gray-900 group-hover:text-blue-600'
          }
        `}>
          {entry.title}
        </h3>
        {entry.description && (
          <p className={`
            font-mono text-xs uppercase tracking-wide
            ${isFestival ? 'text-rose-600' : isCharcoal ? 'text-gray-600' : isCopper ? 'text-orange-700' : 'text-gray-500'}
          `}>
            {entry.description}
          </p>
        )}
      </div>
    </Link>
  );
}

function FeatureCard({
  feature,
  index,
  isFestival,
  isCharcoal,
  isCopper,
}: {
  feature: HomeFeature;
  index: number;
  isFestival: boolean;
  isCharcoal: boolean;
  isCopper: boolean;
}) {
  const Icon = feature.icon;

  return (
    <div className={`
      p-8 group
      ${isFestival
        ? `fc-card fc-animate-bounce fc-delay-${(index + 3) * 100}`
        : isCharcoal
          ? `cg-card cg-animate-snap cg-delay-${(index + 3) * 100}`
          : isCopper
            ? `cl-card cl-animate-bounce cl-delay-${(index + 3) * 100}`
        : `card hover-lift animate-fadeInUp delay-${(index + 3) * 100}`
      }
    `}>
      <div className="flex flex-col items-center text-center">
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300
          ${isFestival
            ? `bg-gradient-to-br ${feature.gradient} text-white group-hover:shadow-2xl group-hover:scale-110 fc-animate-glow`
            : isCharcoal
              ? `bg-gradient-to-br ${feature.gradient} text-white group-hover:shadow-2xl group-hover:scale-110 cg-animate-glow`
              : isCopper
                ? `bg-gradient-to-br ${feature.gradient} text-white group-hover:shadow-2xl group-hover:scale-110 cl-animate-glow`
            : `bg-gradient-to-br ${feature.gradient} text-white group-hover:shadow-xl group-hover:scale-110`
          }
        `}>
          <Icon className="h-8 w-8" />
        </div>
        <h3 className={`
          text-xl font-bold mb-4 transition-colors
          ${isFestival
            ? 'text-rose-800 group-hover:text-rose-600'
            : isCharcoal
              ? 'text-gray-900 group-hover:text-emerald-700'
              : isCopper
                ? 'text-orange-900 group-hover:text-orange-700'
            : 'text-gray-900 group-hover:text-blue-600'
          }
        `}>
          {feature.title}
        </h3>
        <p className={`
          text-sm leading-relaxed
          ${isFestival ? 'text-rose-700' : isCharcoal ? 'text-gray-700' : isCopper ? 'text-orange-800' : 'text-gray-600'}
        `}>
          {feature.description}
        </p>
      </div>
    </div>
  );
}
