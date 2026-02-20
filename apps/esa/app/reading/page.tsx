"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  BookOpen,
  Leaf,
  ArrowRight,
  Star,
  Clock,
  Users,
  Play,
  Library,
  Sparkles,
  TreePine,
  Flower,
  Heart,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTheme } from "@yiqidu/ui/theme-provider";

export default function ReadingGardenPage() {
  const { theme } = useTheme();
  const isFestival = theme === "festival-civic";
  const isMint = theme === "mint-campaign";

  return (
    <div className="flex flex-col pt-20 min-h-screen">
      {/* Enhanced Hero Section */}
      <section
        className={`
        relative overflow-hidden py-24 md:py-32
        ${isFestival ? "fc-hero fc-pattern" : isMint ? "mc-hero mc-pattern" : "gradient-hero"}
      `}
      >
        {/* Botanical Background Elements */}
        {!isFestival && !isMint && <div className="absolute inset-0 parliament-pattern opacity-20"></div>}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

        {/* Floating Botanical Elements */}
        <div className="absolute top-20 right-20 text-green-500/20 animate-float">
          <Leaf className="h-16 w-16" />
        </div>
        <div className="absolute bottom-32 left-32 text-amber-500/20 animate-float" style={{ animationDelay: '1s' }}>
          <Flower className="h-12 w-12" />
        </div>
        <div className="absolute top-1/2 right-1/4 text-emerald-500/20 animate-float" style={{ animationDelay: '3s' }}>
          <TreePine className="h-20 w-20" />
        </div>

        <div className="container max-w-6xl text-center relative z-10">
          {/* Garden Status Badge */}
          <div
            className={`
              inline-flex items-center gap-3 rounded-full px-6 py-3 text-sm font-mono font-semibold mb-12 animate-fadeInUp hover-lift
              ${isFestival
                ? "fc-badge"
                : isMint
                  ? "mc-badge"
                  : "glass-card text-green-700"}
            `}
          >
            <div className="flex h-3 w-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 animate-pulse shadow-glow"></div>
            <span className="uppercase tracking-wider">阅读花园正在盛开</span>
            <div className="h-4 w-px bg-green-200"></div>
            <span className="text-xs opacity-70">GARDEN BLOOMING</span>
          </div>

          {/* Main Title */}
          <h1
            className={`
              tracking-tight leading-[1.1] animate-fadeInUp delay-100 mb-8
              ${isFestival ? "fc-title-hero" : isMint ? "mc-title-hero" : "text-hero text-gray-900"}
            `}
          >
            阅读<span className="text-gradient-political relative mx-4">花园</span>
            <br className="hidden sm:block" />
            <span className={isFestival ? "text-rose-700" : isMint ? "text-teal-700" : "text-display text-green-700"}>Reading Garden</span>
          </h1>

          {/* Subtitle */}
          <p
            className={`
              max-w-3xl mx-auto leading-relaxed animate-fadeInUp delay-200 mb-12
              ${isFestival ? "text-lg text-rose-800" : isMint ? "text-lg text-teal-800" : "text-body text-gray-600"}
            `}
          >
            在故事中播种思考，在互动中收获感悟。
            <br className="hidden md:block" />
            通过沉浸式阅读体验，培养深度思维与文学素养。
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fadeInUp delay-300 mb-16">
            <Link href="#featured-books" className={`group ${isFestival ? "fc-btn fc-btn-primary" : isMint ? "mc-btn mc-btn-primary" : "btn btn-primary"}`}>
              <BookOpen className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span>开始阅读</span>
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="#library" className={`group ${isFestival ? "fc-btn fc-btn-ghost" : isMint ? "mc-btn mc-btn-ghost" : "btn btn-ghost"}`}>
              <Library className="h-5 w-5 transition-transform group-hover:scale-110" />
              <span>浏览书库</span>
            </Link>
          </div>

          {/* Garden Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-fadeInUp delay-400">
            {[
              { icon: BookOpen, value: "12", label: "精选作品", color: "text-green-600" },
              { icon: Users, value: "500+", label: "阅读者", color: "text-blue-600" },
              { icon: Sparkles, value: "50+", label: "互动模块", color: "text-purple-600" },
              { icon: Heart, value: "98%", label: "推荐率", color: "text-red-500" },
            ].map((stat, i) => (
              <div key={stat.label} className={`text-center animate-scaleIn delay-${(i + 5) * 100}`}>
                <div className="flex items-center justify-center mb-3">
                  <div className={`p-3 rounded-2xl bg-white shadow-lg ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="font-mono text-sm text-gray-500 uppercase tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section id="featured-books" className="py-20 md:py-24 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/30 to-white"></div>
        <div className="container max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 border border-green-200 px-4 py-2 text-sm font-mono font-semibold text-green-700 mb-6 animate-fadeInUp">
              <Star className="h-4 w-4" />
              <span className="uppercase tracking-wide">精选阅读</span>
            </div>
            <h2 className="text-display text-gray-900 mb-6 animate-fadeInUp delay-100">
              当前推荐作品
            </h2>
            <p className="text-body text-gray-600 max-w-2xl mx-auto animate-fadeInUp delay-200">
              精心挑选的文学作品，配备丰富的互动模块和深度思考引导
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredBooks.map((book, index) => (
              <BookCard key={book.id} book={book} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Library Section */}
      <section id="library" className="py-20 md:py-24 bg-gradient-to-br from-gray-50 to-green-50/30 relative">
        <div className="absolute inset-0 parliament-pattern opacity-20"></div>
        <div className="container max-w-7xl relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 px-4 py-2 text-sm font-mono font-semibold text-gray-700 mb-6 animate-fadeInUp">
              <Library className="h-4 w-4" />
              <span className="uppercase tracking-wide">完整书库</span>
            </div>
            <h2 className="text-display text-gray-900 mb-4 animate-fadeInUp delay-100">
              所有收藏
            </h2>
            <p className="text-body text-gray-600 animate-fadeInUp delay-200">
              探索我们完整的文学作品收藏，每本书都经过精心设计
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {allBooks.map((book, index) => (
              <LibraryBookCard key={book.id} book={book} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Reading Features Section */}
      <section className="py-20 md:py-24 bg-white">
        <div className="container max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 px-4 py-2 text-sm font-mono font-semibold text-green-700 mb-6">
              <Sparkles className="h-4 w-4" />
              <span className="uppercase tracking-wide">阅读体验</span>
            </div>
            <h2 className="text-display text-gray-900 mb-6">
              沉浸式阅读功能
            </h2>
            <p className="text-body text-gray-600 max-w-2xl mx-auto">
              独特的互动式阅读体验，让文学作品焕发新的生命力
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {readingFeatures.map((feature, index) => (
              <FeatureCard key={feature.title} feature={feature} index={index} />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

// Featured Books Data
type FeaturedBook = {
  id: string;
  title: string;
  author: string;
  description: string;
  cover: string;
  readingTime: string;
  difficulty: string;
  modules: string[];
  status: string;
  color: "blue" | "red" | "purple" | "green" | "cyan" | "amber";
};

type LibraryBook = {
  id: string;
  title: string;
  author: string;
  color: "blue" | "red" | "purple" | "green" | "cyan" | "amber" | "gray";
  cover?: string;
};

type ReadingFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  gradient: string;
};

const featuredBooks: FeaturedBook[] = [
  {
    id: "a-man-called-ove",
    title: "一个叫欧维的男人决定去死",
    author: "弗雷德里克·巴克曼",
    description: "一个关于爱、失去和重新找到生活意义的温暖故事",
    cover: "/reading-legacy/assets/images/a-man-called-ove/covers/cover_main.webp",
    readingTime: "4小时",
    difficulty: "中级",
    modules: ["人物分析", "主题探讨", "情感共鸣"],
    status: "featured",
    color: "blue",
  },
  {
    id: "lord-of-the-flies",
    title: "蝇王",
    author: "威廉·戈尔丁",
    description: "探讨人性善恶的经典寓言小说",
    cover: "/reading-legacy/assets/images/lord-of-the-flies/covers/cover.webp",
    readingTime: "3小时",
    difficulty: "高级",
    modules: ["象征分析", "社会批判", "哲学思辨"],
    status: "popular",
    color: "red",
  },
  {
    id: "story-of-your-life",
    title: "你一生的故事",
    author: "特德·姜",
    description: "科幻与哲学的完美结合，思考生命的意义",
    cover: "/reading-legacy/assets/images/story-of-your-life/covers/cover.webp",
    readingTime: "2小时",
    difficulty: "高级",
    modules: ["科幻元素", "哲学思考", "语言学习"],
    status: "new",
    color: "purple",
  },
  {
    id: "totto-chan",
    title: "窗边的小豆豆",
    author: "黑柳彻子",
    description: "童年回忆与教育理念的温馨故事",
    cover: "/reading-legacy/assets/images/totto-chan/covers/totto_cover.webp",
    readingTime: "3小时",
    difficulty: "初级",
    modules: ["教育思考", "童年回忆", "成长感悟"],
    status: "classic",
    color: "green",
  },
  {
    id: "wave",
    title: "浪潮",
    author: "索尼娅·沙阿",
    description: "关于海洋、生命与环境的深度思考",
    cover: "/reading-legacy/assets/images/wave/covers/wave-cover.webp",
    readingTime: "5小时",
    difficulty: "中级",
    modules: ["环境意识", "科学知识", "生态思维"],
    status: "trending",
    color: "cyan",
  },
  {
    id: "wonder",
    title: "奇迹男孩",
    author: "R.J. 帕拉西奥",
    description: "关于接纳、友谊和勇气的感人故事",
    cover: "/reading-legacy/assets/images/wonder/covers/cover.webp",
    readingTime: "4小时",
    difficulty: "中级",
    modules: ["品格教育", "同理心", "社会包容"],
    status: "recommended",
    color: "amber",
  },
];

// All Books Data (simplified)
const allBooks: LibraryBook[] = [
  {
    id: "a-man-called-ove",
    title: "欧维",
    author: "巴克曼",
    color: "blue",
    cover: "/reading-legacy/assets/images/a-man-called-ove/covers/cover_main.webp",
  },
  {
    id: "lord-of-the-flies",
    title: "蝇王",
    author: "戈尔丁",
    color: "red",
    cover: "/reading-legacy/assets/images/lord-of-the-flies/covers/cover.webp",
  },
  {
    id: "story-of-your-life",
    title: "你一生的故事",
    author: "特德·姜",
    color: "purple",
    cover: "/reading-legacy/assets/images/story-of-your-life/covers/cover.webp",
  },
  {
    id: "totto-chan",
    title: "窗边的小豆豆",
    author: "黑柳彻子",
    color: "green",
    cover: "/reading-legacy/assets/images/totto-chan/covers/totto_cover.webp",
  },
  {
    id: "wave",
    title: "浪潮",
    author: "索尼娅",
    color: "cyan",
    cover: "/reading-legacy/assets/images/wave/covers/wave-cover.webp",
  },
  {
    id: "wonder",
    title: "奇迹男孩",
    author: "帕拉西奥",
    color: "amber",
    cover: "/reading-legacy/assets/images/wonder/covers/cover.webp",
  },
  { id: "more-1", title: "更多作品", author: "敬请期待", color: "gray" },
  { id: "more-2", title: "持续更新", author: "精彩继续", color: "gray" },
];

// Reading Features Data
const readingFeatures: ReadingFeature[] = [
  {
    icon: BookOpen,
    title: "互动阅读",
    description: "在阅读过程中加入思考提示和互动元素，提升理解深度。",
    color: "blue",
    gradient: "from-blue-500 to-blue-600"
  },
  {
    icon: Users,
    title: "角色分析",
    description: "深入分析人物性格、动机和发展轨迹，理解作者的创作意图。",
    color: "purple",
    gradient: "from-purple-500 to-purple-600"
  },
  {
    icon: Sparkles,
    title: "主题探讨",
    description: "引导读者思考作品的深层主题和现实意义。",
    color: "green",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    icon: Heart,
    title: "情感共鸣",
    description: "通过情感引导帮助读者与作品产生深层次的共鸣。",
    color: "red",
    gradient: "from-red-500 to-pink-500"
  },
];

function BookCard({ book, index }: { book: FeaturedBook; index: number }) {
  const [coverLoadFailed, setCoverLoadFailed] = useState(false);

  const colorMap = {
    blue: { bg: "from-blue-500 to-blue-600", badge: "bg-blue-50 text-blue-700 border-blue-200" },
    red: { bg: "from-red-500 to-red-600", badge: "bg-red-50 text-red-700 border-red-200" },
    purple: { bg: "from-purple-500 to-purple-600", badge: "bg-purple-50 text-purple-700 border-purple-200" },
    green: { bg: "from-green-500 to-green-600", badge: "bg-green-50 text-green-700 border-green-200" },
    cyan: { bg: "from-cyan-500 to-cyan-600", badge: "bg-cyan-50 text-cyan-700 border-cyan-200" },
    amber: { bg: "from-amber-500 to-amber-600", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  };

  const colors = colorMap[book.color as keyof typeof colorMap] || colorMap.blue;

  return (
    <div className={`card p-6 hover-lift group animate-fadeInUp delay-${(index % 3 + 1) * 100}`}>
      {/* Book Cover */}
      <div className="relative w-full h-48 rounded-lg overflow-hidden mb-6 group-hover:shadow-xl transition-all duration-300">
        {!coverLoadFailed ? (
          <Image
            src={book.cover}
            alt={`${book.title}封面`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
            onError={() => setCoverLoadFailed(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${colors.bg} flex items-center justify-center`}>
            <BookOpen className="h-12 w-12 text-white" />
          </div>
        )}
      </div>

      {/* Book Info */}
      <div className="flex items-start justify-between mb-3">
        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-semibold uppercase tracking-wide ${colors.badge}`}>
          {book.difficulty}
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <Clock className="h-4 w-4" />
          <span>{book.readingTime}</span>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
        {book.title}
      </h3>
      <p className="text-sm text-gray-500 mb-3">{book.author}</p>
      <p className="text-gray-600 text-sm leading-relaxed mb-4">
        {book.description}
      </p>

      {/* Modules */}
      <div className="flex flex-wrap gap-2 mb-4">
        {book.modules.slice(0, 2).map((module: string) => (
          <span key={module} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            {module}
          </span>
        ))}
        {book.modules.length > 2 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
            +{book.modules.length - 2}
          </span>
        )}
      </div>

      {/* Action Button */}
      <Link href={`/reading-legacy/book.html?book=${book.id}`} className="btn btn-primary w-full group">
        <Play className="h-4 w-4 transition-transform group-hover:scale-110" />
        <span>开始阅读</span>
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  );
}

function LibraryBookCard({ book, index }: { book: LibraryBook; index: number }) {
  const [coverLoadFailed, setCoverLoadFailed] = useState(false);

  const colorMap = {
    blue: "from-blue-500 to-blue-600",
    red: "from-red-500 to-red-600",
    purple: "from-purple-500 to-purple-600",
    green: "from-green-500 to-green-600",
    cyan: "from-cyan-500 to-cyan-600",
    amber: "from-amber-500 to-amber-600",
    gray: "from-gray-400 to-gray-500",
  };

  const gradient = colorMap[book.color as keyof typeof colorMap] || colorMap.blue;
  const showCover = Boolean(book.cover) && !coverLoadFailed;

  return (
    <Link
      href={book.color === 'gray' ? '#' : `/reading-legacy/book.html?book=${book.id}`}
      className={`group card p-4 hover-lift cursor-pointer animate-scaleIn delay-${(index % 6 + 1) * 50} ${book.color === 'gray' ? 'opacity-60' : ''}`}
    >
      <div className="relative w-full h-32 rounded-lg overflow-hidden mb-3 group-hover:shadow-lg transition-all duration-300">
        {showCover && book.cover ? (
          <Image
            src={book.cover}
            alt={`${book.title}封面`}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 16vw"
            className="object-cover"
            onError={() => setCoverLoadFailed(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <BookOpen className="h-8 w-8 text-white" />
          </div>
        )}
      </div>
      <h4 className="font-semibold text-gray-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
        {book.title}
      </h4>
      <p className="font-mono text-xs text-gray-500 uppercase tracking-wide">
        {book.author}
      </p>
    </Link>
  );
}

function FeatureCard({ feature, index }: { feature: ReadingFeature; index: number }) {
  const Icon = feature.icon;

  return (
    <div className={`card p-8 text-center hover-lift group animate-fadeInUp delay-${(index + 1) * 100}`}>
      <div className={`w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br ${feature.gradient} text-white flex items-center justify-center mb-6 group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
        <Icon className="h-8 w-8" />
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
        {feature.title}
      </h3>

      <p className="text-gray-600 text-sm leading-relaxed">
        {feature.description}
      </p>
    </div>
  );
}
