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
import { useTheme } from "@/components/theme-provider";

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
        {/* 节庆背景元素 */}
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
          {/* 节庆徽章 */}
          {isFestival && (
            <div className="fc-badge fc-animate-slide mb-8">
              <Flag className="h-4 w-4" />
              <span>公民节庆 · 议事盛典</span>
              <Sparkles className="h-4 w-4" />
            </div>
          )}

          {/* 炭黑徽章 */}
          {isCharcoal && (
            <div className="cg-badge cg-animate-slide mb-8">
              <Grid3X3 className="h-4 w-4" />
              <span>炭黑栅格 · 结构议事</span>
              <Crown className="h-4 w-4" />
            </div>
          )}

          {isCopper && (
            <div className="cl-badge cl-animate-slide mb-8">
              <BookOpen className="h-4 w-4" />
              <span>铜色讲堂 · 深度议事</span>
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
                  成为行动公民
                  <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-rose-600 via-blue-600 to-rose-600 rounded-full opacity-40 fc-animate-glow"></div>
                </span>
              </>
            ) : isMint ? (
              <>
                清新议事行动<br />
                <span className="relative">
                  激活公民力量
                  <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-teal-600 via-orange-500 to-teal-600 rounded-full opacity-40 mc-animate-glow"></div>
                </span>
              </>
            ) : isCharcoal ? (
              <>
                结构化议事<br />
                <span className="relative">
                  精准公民参与
                  <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-gray-700 via-emerald-500 to-gray-700 opacity-60"></div>
                </span>
              </>
            ) : isCopper ? (
              <>
                铜色讲堂议事<br />
                <span className="relative">
                  沉淀公民表达力
                  <div className="absolute -bottom-2 left-0 right-0 h-2 bg-gradient-to-r from-orange-900 via-amber-700 to-blue-700 rounded-full opacity-50 cl-animate-glow"></div>
                </span>
              </>
            ) : (
              <>
                掌握公共议事规则 <br className="hidden sm:block" />
                <span className="text-gradient-political relative">
                  提升公民核心素养
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
                加入这场公民议事的盛大节庆！从理论到实践，在充满活力的学习氛围中
                <br className="hidden md:block" />
                掌握罗伯特议事规则，成为积极参与的行动公民。
              </>
            ) : isMint ? (
              <>
                启动清新的议事行动！在薄荷般清爽的学习环境中，从基础到进阶
                <br className="hidden md:block" />
                系统掌握议事技能，激发你的公民参与热情。
              </>
            ) : isCharcoal ? (
              <>
                构建结构化的议事框架！在清晰明确的学习体系中，从基础理论到实战应用
                <br className="hidden md:block" />
                精准掌握议事规则，成为高效的公民参与者。
              </>
            ) : isCopper ? (
              <>
                走进铜色讲堂的深度学习场域！在层层递进的课程与案例中，从概念到表达
                <br className="hidden md:block" />
                系统训练规则思维、会议发言与共识构建能力。
              </>
            ) : (
              <>
                从理论学习到模拟议事，全方位掌握罗伯特议事规则。
                <br className="hidden md:block" />
                加入我们，在实践中学会表达、倾听与决策，成为合格的公民参与者。
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
              <span>{isFestival ? '立即参与' : isMint ? '开始行动' : isCharcoal ? '开始构建' : isCopper ? '进入讲堂' : '开始学习'}</span>
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
              <span>{isFestival ? '了解节庆' : isMint ? '了解行动' : isCharcoal ? '了解结构' : isCopper ? '了解讲堂' : '了解更多'}</span>
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
                label: isFestival ? "节庆参与者" : isMint ? "行动参与者" : isCharcoal ? "结构参与者" : isCopper ? "讲堂学员" : "活跃学员",
                color: isFestival ? "text-rose-600" : isMint ? "text-teal-600" : isCharcoal ? "text-gray-700" : isCopper ? "text-orange-700" : "text-blue-600"
              },
              {
                icon: BookOpen,
                value: "12+",
                label: isFestival ? "节庆课程" : isMint ? "行动课程" : isCharcoal ? "结构课程" : isCopper ? "讲堂课程" : "精品课程",
                color: isFestival ? "text-blue-600" : isMint ? "text-orange-600" : isCharcoal ? "text-emerald-600" : isCopper ? "text-blue-700" : "text-purple-600"
              },
              {
                icon: Vote,
                value: "50+",
                label: isFestival ? "议事庆典" : isMint ? "行动会议" : isCharcoal ? "结构会议" : isCopper ? "讲堂研讨" : "模拟会议",
                color: isFestival ? "text-rose-500" : isMint ? "text-teal-500" : isCharcoal ? "text-gray-600" : isCopper ? "text-amber-700" : "text-amber-600"
              },
              {
                icon: Award,
                value: "98%",
                label: isFestival ? "节庆好评" : isMint ? "行动好评" : isCharcoal ? "结构好评" : isCopper ? "讲堂好评" : "好评率",
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
                {isFestival ? '节庆亮点' : isCharcoal ? '结构亮点' : isCopper ? '讲堂亮点' : '核心优势'}
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
              {isFestival ? '为什么加入这场节庆？' : isCharcoal ? '为什么选择炭黑栅格？' : isCopper ? '为什么选择铜色讲堂？' : '为什么选择议起读？'}
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
                ? '在充满活力的节庆氛围中，体验前所未有的议事规则学习之旅'
                : isCopper
                  ? '在讲堂化的知识脉络中，系统建立可表达、可协作、可复盘的议事能力'
                : isCharcoal
                  ? '在结构化栅格框架中，建立清晰、可执行的议事规则学习路径'
                : '理论与实践相结合的系统化学习方案，让每个人都能成为合格的公民参与者'
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Scale,
                title: isFestival ? "节庆课程体系" : isCopper ? "讲堂课程体系" : "系统课程",
                description: isFestival
                  ? "在节庆般的学习氛围中，从基础到高阶全面掌握议事规则，让学习成为一场盛大的知识庆典。"
                  : isCopper
                    ? "围绕规则原理、案例拆解与表达训练构建讲堂体系，让学习者在内容层次中稳步建立议事框架。"
                  : isCharcoal
                    ? "模块化课程体系，从规则拆解到场景应用分层推进，帮助你形成可复用的议事框架。"
                    : "由浅入深的课程体系，从基础概念到高阶应用全覆盖，建立完整的议事规则知识框架。",
                color: "blue",
                gradient: isFestival ? "from-rose-500 to-rose-600" : isCharcoal ? "from-gray-700 to-gray-800" : isCopper ? "from-orange-800 to-amber-700" : "from-blue-500 to-blue-600"
              },
              {
                icon: Zap,
                title: isFestival ? "互动庆典" : isCopper ? "讲堂研讨" : "互动课堂",
                description: isFestival
                  ? "实时投票、激情发言，在节庆般的互动中体验真实议事场景，让每次参与都充满仪式感。"
                  : isCopper
                    ? "从讲解到提问再到观点陈述，形成节奏清晰的课堂互动，让每次发言都更有依据与逻辑。"
                  : isCharcoal
                    ? "流程化互动、规则化发言，还原真实议事会议中的节奏与边界，在实践中提升表达质量。"
                    : "实时投票、举手发言，还原真实的议事会议场景，在实践中掌握规则精髓。",
                color: "amber",
                gradient: isFestival ? "from-blue-500 to-blue-600" : isCharcoal ? "from-emerald-600 to-emerald-500" : isCopper ? "from-blue-700 to-blue-600" : "from-amber-500 to-orange-500"
              },
              {
                icon: Users,
                title: isFestival ? "公民节庆社群" : isCopper ? "讲堂共学社群" : "社群共学",
                description: isFestival
                  ? "与志同道合的节庆参与者一起庆祝学习，在充满活力的社群中共同成长为行动公民。"
                  : isCopper
                    ? "与同伴在阅读、讨论与复盘中共同打磨表达能力，形成兼具深度与温度的讲堂学习共同体。"
                  : isCharcoal
                    ? "与伙伴在统一结构下协同练习，在复盘中持续优化规则运用，形成高质量学习共同体。"
                    : "与志同道合的伙伴一起练习，在讨论中共同进步，形成学习共同体。",
                color: "emerald",
                gradient: isFestival ? "from-rose-400 to-rose-500" : isCharcoal ? "from-gray-600 to-gray-700" : isCopper ? "from-orange-700 to-blue-700" : "from-emerald-500 to-green-500"
              },
              {
                icon: Crown,
                title: isFestival ? "节庆荣誉认证" : isCopper ? "讲堂能力认证" : "能力认证",
                description: isFestival
                ? "完成节庆挑战，获得专属的公民议事荣誉徽章，证明你在这场知识盛典中的卓越表现。"
                  : isCopper
                    ? "完成讲堂任务与专题答辩，获得学习档案与能力认证，清晰展示你的议事表达进阶成果。"
                  : isCharcoal
                    ? "完成结构化挑战，获得能力认证与过程证据，清晰展示你的议事能力水平。"
                    : "完成课程与挑战，获得官方认证的结业证书，证明你的议事能力水平。",
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
                {isFestival ? '节庆导航' : isCharcoal ? '结构导航' : isCopper ? '讲堂导航' : '快速导航'}
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
              {isFestival ? '节庆入口' : isCharcoal ? '结构入口' : isCopper ? '讲堂入口' : '快速入口'}
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
                ? '从这里开始你的公民议事节庆之旅'
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
                {isFestival ? '节庆路径' : isCharcoal ? '结构路径' : isCopper ? '讲堂路径' : '学习路径'}
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
              {isFestival ? '你的节庆之旅' : isCharcoal ? '你的结构之旅' : isCopper ? '你的讲堂之旅' : '你的学习路径'}
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
                ? '三步开启公民议事节庆，从新手到行动公民的激情成长之路'
                : isCharcoal
                  ? '三步开启结构化议事学习，从新手到高效参与者的清晰成长路径'
                  : isCopper
                    ? '三步开启讲堂式议事学习，从入门理解到表达实践的沉浸成长路径'
                : '三步开启议事规则学习之旅，从新手到专家的完整成长路径'
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
                title: isFestival ? "加入节庆" : isCopper ? "进入讲堂" : "注册加入",
                desc: isFestival
                  ? "创建账号并输入邀请码，立即加入这场盛大的公民议事节庆，开启你的行动公民之旅。"
                  : isCopper
                    ? "创建账号并输入邀请码，立即进入讲堂学习空间，开启你的规则表达与公共协作训练。"
                  : isCharcoal
                    ? "创建账号并输入邀请码，立即进入结构化学习体系，开启你的清晰成长路径。"
                    : "创建账号并输入邀请码，立即解锁全部课程内容，开始你的学习之旅。",
                icon: Shield,
                color: isFestival ? "rose" : isCharcoal ? "emerald" : isCopper ? "orange" : "blue"
              },
              {
                step: "02",
                title: isFestival ? "节庆学习" : isCopper ? "讲堂学习" : "系统学习",
                desc: isFestival
                  ? "在充满活力的节庆氛围中系统学习，从基础原则到高阶应用，在庆典中建立完整知识体系。"
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
                title: isFestival ? "议事庆典" : isCopper ? "讲堂实战" : "模拟实战",
                desc: isFestival
                  ? "参与激动人心的议事庆典，在节庆般的模拟会议中真实演练，成为充满激情的行动公民。"
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

        {/* 节庆浮动元素 */}
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
                {isFestival ? '加入节庆' : isCharcoal ? '加入结构行动' : isCopper ? '加入讲堂' : '立即开始'}
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
              {isFestival ? '准备好参加这场盛典了吗？' : isCharcoal ? '准备好构建你的议事框架了吗？' : isCopper ? '准备好进入铜色讲堂了吗？' : '准备好开始了吗？'}
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
                  注册账号并输入邀请码，即可加入这场盛大的公民议事节庆。
                  <br className="hidden md:block" />
                  与数百名节庆参与者一同庆祝学习，成为充满激情的行动公民。
                </>
              ) : (
                <>
                  {isCharcoal ? '注册账号并输入邀请码，即可进入结构化课程与互动训练体系。' : isCopper ? '注册账号并输入邀请码，即可进入讲堂课程与专题研讨体系。' : '注册账号并输入邀请码，即可解锁全部课程内容与互动功能。'}
                  <br className="hidden md:block" />
                  {isCharcoal ? '加入议起读，在清晰规则和流程中与同伴协作成长。' : isCopper ? '加入议起读，在讲解、练习与复盘中与同伴协作成长。' : '加入议起读，与数百名同学一同成长，成为合格的公民参与者。'}
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
                <span>{isFestival ? '立即加入节庆' : isCharcoal ? '立即加入结构行动' : isCopper ? '立即加入讲堂' : '立即注册'}</span>
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
                <span>{isFestival ? '浏览节庆课程' : isCharcoal ? '浏览结构课程' : isCopper ? '浏览讲堂课程' : '浏览课程'}</span>
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
                {isFestival ? '已有 500+ 公民加入节庆' : isCharcoal ? '已有 500+ 学员加入结构体系' : isCopper ? '已有 500+ 学员加入讲堂体系' : '已有 500+ 学员加入我们'}
              </p>
              <div className="flex justify-center items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 fill-current ${isFestival ? 'text-yellow-300' : isCopper ? 'text-orange-200' : 'text-amber-300'}`} />
                ))}
                <span className={`ml-2 font-semibold ${isFestival ? 'text-rose-100' : isCharcoal ? 'text-emerald-100' : isCopper ? 'text-orange-100' : 'text-blue-100'}`}>
                  4.9/5.0 {isFestival ? '节庆评分' : isCharcoal ? '结构评分' : isCopper ? '讲堂评分' : '学员评分'}
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
