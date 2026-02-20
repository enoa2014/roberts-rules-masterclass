"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, LayoutTemplate, MousePointerClick, Sparkles, Type, X } from "lucide-react";

type LayoutKind = "center" | "split" | "bento" | "editorial" | "poster";
type NavKind = "glass" | "underline" | "boxed" | "compact";
type SurfaceKind = "soft" | "glass" | "outline" | "paper" | "brutal";
type MotionKind = "none" | "gentle" | "snappy" | "dramatic";
type InteractionKind = "lift" | "glow" | "slide" | "pulse";

type Preset = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
    surface: string;
    text: string;
  };
  typography: {
    heading: string;
    body: string;
    mono: string;
    label: string;
  };
  layout: LayoutKind;
  nav: NavKind;
  surface: SurfaceKind;
  motion: MotionKind;
  interaction: InteractionKind;
};

const PRESETS: Preset[] = [
  {
    id: "civic-glass",
    name: "课堂玻璃态",
    subtitle: "Classroom Glass",
    description: "玻璃导航 + 中央英雄区，强调现代课堂讨论氛围。",
    palette: {
      primary: "#1d4ed8",
      secondary: "#2563eb",
      accent: "#d97706",
      bg: "#eef4ff",
      surface: "#ffffff",
      text: "#0f172a",
    },
    typography: {
      heading: "'Crimson Text', 'Noto Serif SC', serif",
      body: "'Noto Sans SC', 'PingFang SC', sans-serif",
      mono: "'JetBrains Mono', monospace",
      label: "'Noto Sans SC', sans-serif",
    },
    layout: "center",
    nav: "glass",
    surface: "glass",
    motion: "gentle",
    interaction: "lift",
  },
  {
    id: "academy-editorial",
    name: "学院社论风",
    subtitle: "Academic Editorial",
    description: "社论式排版 + 纵向信息流，强调内容权重。",
    palette: {
      primary: "#1e3a8a",
      secondary: "#334155",
      accent: "#b45309",
      bg: "#f8fafc",
      surface: "#ffffff",
      text: "#111827",
    },
    typography: {
      heading: "'Georgia', 'Times New Roman', serif",
      body: "'Noto Serif SC', serif",
      mono: "'JetBrains Mono', monospace",
      label: "'Noto Sans SC', sans-serif",
    },
    layout: "editorial",
    nav: "underline",
    surface: "paper",
    motion: "none",
    interaction: "slide",
  },
  {
    id: "neo-bento",
    name: "新课堂 Bento",
    subtitle: "Neo Bento",
    description: "模块化卡片编排，适合首页快速导流。",
    palette: {
      primary: "#312e81",
      secondary: "#4338ca",
      accent: "#14b8a6",
      bg: "#eef2ff",
      surface: "#ffffff",
      text: "#1e1b4b",
    },
    typography: {
      heading: "'Noto Sans SC', 'Microsoft YaHei', sans-serif",
      body: "'Noto Sans SC', sans-serif",
      mono: "'IBM Plex Mono', 'JetBrains Mono', monospace",
      label: "'Noto Sans SC', sans-serif",
    },
    layout: "bento",
    nav: "boxed",
    surface: "soft",
    motion: "snappy",
    interaction: "glow",
  },
  {
    id: "warm-seminar",
    name: "暖色研讨会",
    subtitle: "Warm Seminar",
    description: "暖色纸感 + 分栏英雄区，亲和且有教育感。",
    palette: {
      primary: "#9a3412",
      secondary: "#c2410c",
      accent: "#0f766e",
      bg: "#fff7ed",
      surface: "#fffaf3",
      text: "#431407",
    },
    typography: {
      heading: "'Noto Serif SC', serif",
      body: "'Noto Sans SC', sans-serif",
      mono: "'JetBrains Mono', monospace",
      label: "'Noto Sans SC', sans-serif",
    },
    layout: "split",
    nav: "compact",
    surface: "paper",
    motion: "gentle",
    interaction: "lift",
  },
  {
    id: "nordic-clean",
    name: "北欧清朗",
    subtitle: "Nordic Clean",
    description: "简洁网格 + 低噪声视觉，长期使用不疲劳。",
    palette: {
      primary: "#0f766e",
      secondary: "#155e75",
      accent: "#ea580c",
      bg: "#f8fafc",
      surface: "#ffffff",
      text: "#0f172a",
    },
    typography: {
      heading: "'Trebuchet MS', 'Noto Sans SC', sans-serif",
      body: "'Noto Sans SC', sans-serif",
      mono: "'Consolas', monospace",
      label: "'Noto Sans SC', sans-serif",
    },
    layout: "center",
    nav: "underline",
    surface: "outline",
    motion: "none",
    interaction: "slide",
  },
  {
    id: "ink-forum",
    name: "墨色论坛",
    subtitle: "Ink Forum",
    description: "高对比黑白主导 + 强边框交互。",
    palette: {
      primary: "#111827",
      secondary: "#374151",
      accent: "#7c3aed",
      bg: "#f3f4f6",
      surface: "#ffffff",
      text: "#111827",
    },
    typography: {
      heading: "'Helvetica Neue', 'Noto Sans SC', sans-serif",
      body: "'Noto Sans SC', sans-serif",
      mono: "'JetBrains Mono', monospace",
      label: "'Arial', sans-serif",
    },
    layout: "poster",
    nav: "boxed",
    surface: "brutal",
    motion: "snappy",
    interaction: "pulse",
  },
  {
    id: "ocean-policy",
    name: "海洋政策风",
    subtitle: "Ocean Policy",
    description: "冷色政策感 + 分栏信息墙，适合规则学习站。",
    palette: {
      primary: "#0c4a6e",
      secondary: "#0369a1",
      accent: "#22c55e",
      bg: "#f0f9ff",
      surface: "#ffffff",
      text: "#082f49",
    },
    typography: {
      heading: "'Noto Sans SC', sans-serif",
      body: "'Noto Sans SC', sans-serif",
      mono: "'IBM Plex Mono', monospace",
      label: "'Noto Sans SC', sans-serif",
    },
    layout: "split",
    nav: "glass",
    surface: "soft",
    motion: "dramatic",
    interaction: "glow",
  },
  {
    id: "forest-academy",
    name: "林地学院",
    subtitle: "Forest Academy",
    description: "绿色成长语义 + 柔和卡片组。",
    palette: {
      primary: "#166534",
      secondary: "#15803d",
      accent: "#0ea5e9",
      bg: "#f0fdf4",
      surface: "#ffffff",
      text: "#052e16",
    },
    typography: {
      heading: "'Palatino Linotype', 'Noto Serif SC', serif",
      body: "'Noto Sans SC', sans-serif",
      mono: "'Courier New', monospace",
      label: "'Noto Sans SC', sans-serif",
    },
    layout: "bento",
    nav: "compact",
    surface: "soft",
    motion: "gentle",
    interaction: "lift",
  },
  {
    id: "sunrise-workshop",
    name: "日出工作坊",
    subtitle: "Sunrise Workshop",
    description: "高活力橙蓝配 + 明确行动按钮。",
    palette: {
      primary: "#f97316",
      secondary: "#ea580c",
      accent: "#2563eb",
      bg: "#fff7ed",
      surface: "#ffffff",
      text: "#431407",
    },
    typography: {
      heading: "'Segoe UI', 'Noto Sans SC', sans-serif",
      body: "'Noto Sans SC', sans-serif",
      mono: "'JetBrains Mono', monospace",
      label: "'Segoe UI', sans-serif",
    },
    layout: "poster",
    nav: "underline",
    surface: "outline",
    motion: "snappy",
    interaction: "pulse",
  },
  {
    id: "heritage-library",
    name: "典籍图书馆",
    subtitle: "Heritage Library",
    description: "纸质感纹理 + 经典衬线，适合阅读模块。",
    palette: {
      primary: "#4b5563",
      secondary: "#6b7280",
      accent: "#a16207",
      bg: "#fffbeb",
      surface: "#fffefc",
      text: "#1f2937",
    },
    typography: {
      heading: "'Times New Roman', 'Noto Serif SC', serif",
      body: "'Noto Serif SC', serif",
      mono: "'Courier New', monospace",
      label: "'Noto Sans SC', sans-serif",
    },
    layout: "editorial",
    nav: "compact",
    surface: "paper",
    motion: "none",
    interaction: "slide",
  },
  {
    id: "charcoal-grid",
    name: "炭黑栅格",
    subtitle: "Charcoal Grid",
    description: "深灰结构化布局，信息块边界更明确。",
    palette: {
      primary: "#1f2937",
      secondary: "#374151",
      accent: "#10b981",
      bg: "#f9fafb",
      surface: "#ffffff",
      text: "#111827",
    },
    typography: {
      heading: "'Arial Black', 'Noto Sans SC', sans-serif",
      body: "'Noto Sans SC', sans-serif",
      mono: "'Consolas', monospace",
      label: "'Arial', sans-serif",
    },
    layout: "bento",
    nav: "boxed",
    surface: "brutal",
    motion: "snappy",
    interaction: "glow",
  },
  {
    id: "festival-civic",
    name: "活力课堂",
    subtitle: "Vibrant Classroom",
    description: "高饱和点缀 + 海报式主视觉，适合活动期。",
    palette: {
      primary: "#be123c",
      secondary: "#e11d48",
      accent: "#2563eb",
      bg: "#fff1f2",
      surface: "#ffffff",
      text: "#500724",
    },
    typography: {
      heading: "'Impact', 'Noto Sans SC', sans-serif",
      body: "'Noto Sans SC', sans-serif",
      mono: "'JetBrains Mono', monospace",
      label: "'Noto Sans SC', sans-serif",
    },
    layout: "poster",
    nav: "glass",
    surface: "soft",
    motion: "dramatic",
    interaction: "pulse",
  },
  {
    id: "cobalt-debate",
    name: "钴蓝辩论场",
    subtitle: "Cobalt Debate",
    description: "大标题 + 强按钮主导，转化导向明确。",
    palette: {
      primary: "#1d4ed8",
      secondary: "#1e40af",
      accent: "#f97316",
      bg: "#eff6ff",
      surface: "#ffffff",
      text: "#1e3a8a",
    },
    typography: {
      heading: "'Verdana', 'Noto Sans SC', sans-serif",
      body: "'Noto Sans SC', sans-serif",
      mono: "'IBM Plex Mono', monospace",
      label: "'Verdana', sans-serif",
    },
    layout: "center",
    nav: "compact",
    surface: "glass",
    motion: "dramatic",
    interaction: "lift",
  },
  {
    id: "rosewood-forum",
    name: "红木论坛",
    subtitle: "Rosewood Forum",
    description: "暖深色对比 + 论坛感导航，沉稳讨论气质。",
    palette: {
      primary: "#7c2d12",
      secondary: "#9a3412",
      accent: "#2563eb",
      bg: "#fff7ed",
      surface: "#ffffff",
      text: "#431407",
    },
    typography: {
      heading: "'Cambria', 'Noto Serif SC', serif",
      body: "'Noto Sans SC', sans-serif",
      mono: "'JetBrains Mono', monospace",
      label: "'Noto Sans SC', sans-serif",
    },
    layout: "split",
    nav: "underline",
    surface: "paper",
    motion: "gentle",
    interaction: "slide",
  },
  {
    id: "tech-deliberation",
    name: "科技议事",
    subtitle: "Tech Deliberation",
    description: "冷感科技排版 + 快速交互反馈。",
    palette: {
      primary: "#4338ca",
      secondary: "#3730a3",
      accent: "#06b6d4",
      bg: "#eef2ff",
      surface: "#ffffff",
      text: "#1e1b4b",
    },
    typography: {
      heading: "'Tahoma', 'Noto Sans SC', sans-serif",
      body: "'Noto Sans SC', sans-serif",
      mono: "'Consolas', monospace",
      label: "'Tahoma', sans-serif",
    },
    layout: "bento",
    nav: "glass",
    surface: "outline",
    motion: "dramatic",
    interaction: "glow",
  },
  {
    id: "calm-slate",
    name: "静谧石板",
    subtitle: "Calm Slate",
    description: "中性蓝灰 + 低刺激交互，长期阅读友好。",
    palette: {
      primary: "#334155",
      secondary: "#475569",
      accent: "#0ea5e9",
      bg: "#f8fafc",
      surface: "#ffffff",
      text: "#0f172a",
    },
    typography: {
      heading: "'Noto Sans SC', sans-serif",
      body: "'Noto Sans SC', sans-serif",
      mono: "'JetBrains Mono', monospace",
      label: "'Noto Sans SC', sans-serif",
    },
    layout: "center",
    nav: "boxed",
    surface: "soft",
    motion: "none",
    interaction: "slide",
  },
  {
    id: "mono-zen",
    name: "黑白禅意",
    subtitle: "Monochrome Zen",
    description: "单色近似 + 强排版，极简而克制。",
    palette: {
      primary: "#111827",
      secondary: "#374151",
      accent: "#6b7280",
      bg: "#f9fafb",
      surface: "#ffffff",
      text: "#111827",
    },
    typography: {
      heading: "'Noto Serif SC', serif",
      body: "'Noto Sans SC', sans-serif",
      mono: "'Courier New', monospace",
      label: "'Noto Sans SC', sans-serif",
    },
    layout: "editorial",
    nav: "compact",
    surface: "outline",
    motion: "none",
    interaction: "lift",
  },
  {
    id: "indigo-grid",
    name: "靛蓝栅格",
    subtitle: "Indigo Grid",
    description: "仪表盘式版面 + 清晰模块边界。",
    palette: {
      primary: "#312e81",
      secondary: "#4338ca",
      accent: "#22d3ee",
      bg: "#eef2ff",
      surface: "#ffffff",
      text: "#1e1b4b",
    },
    typography: {
      heading: "'Segoe UI', 'Noto Sans SC', sans-serif",
      body: "'Noto Sans SC', sans-serif",
      mono: "'IBM Plex Mono', monospace",
      label: "'Segoe UI', sans-serif",
    },
    layout: "split",
    nav: "boxed",
    surface: "glass",
    motion: "snappy",
    interaction: "glow",
  },
  {
    id: "copper-lecture",
    name: "铜色讲堂",
    subtitle: "Copper Lecture",
    description: "讲座页质感，标题和摘要权重更大。",
    palette: {
      primary: "#9a3412",
      secondary: "#b45309",
      accent: "#1d4ed8",
      bg: "#fff7ed",
      surface: "#ffffff",
      text: "#451a03",
    },
    typography: {
      heading: "'Book Antiqua', 'Noto Serif SC', serif",
      body: "'Noto Sans SC', sans-serif",
      mono: "'JetBrains Mono', monospace",
      label: "'Noto Sans SC', sans-serif",
    },
    layout: "editorial",
    nav: "underline",
    surface: "paper",
    motion: "gentle",
    interaction: "slide",
  },
  {
    id: "mint-campaign",
    name: "薄荷行动",
    subtitle: "Mint Campaign",
    description: "清亮色块 + 强 CTA，适合招募与活动页。",
    palette: {
      primary: "#0f766e",
      secondary: "#14b8a6",
      accent: "#f97316",
      bg: "#ecfeff",
      surface: "#ffffff",
      text: "#134e4a",
    },
    typography: {
      heading: "'Franklin Gothic Medium', 'Noto Sans SC', sans-serif",
      body: "'Noto Sans SC', sans-serif",
      mono: "'Consolas', monospace",
      label: "'Noto Sans SC', sans-serif",
    },
    layout: "poster",
    nav: "glass",
    surface: "soft",
    motion: "dramatic",
    interaction: "pulse",
  },
];

const LAYOUT_LABEL: Record<LayoutKind, string> = {
  center: "中心英雄",
  split: "左右分栏",
  bento: "Bento 拼贴",
  editorial: "社论排版",
  poster: "海报主视觉",
};

const INTERACTION_CLASS: Record<InteractionKind, string> = {
  lift: "transition-transform duration-300 hover:-translate-y-1",
  glow: "transition-shadow duration-300 hover:shadow-xl",
  slide: "transition-transform duration-300 hover:translate-x-1",
  pulse: "transition duration-300 hover:animate-pulse",
};

const MOTION_CLASS: Record<MotionKind, string> = {
  none: "",
  gentle: "demo-motion-gentle",
  snappy: "demo-motion-snappy",
  dramatic: "demo-motion-dramatic",
};

function surfaceStyles(kind: SurfaceKind): CSSProperties {
  switch (kind) {
    case "glass":
      return {
        border: "1px solid color-mix(in oklab, var(--demo-primary) 20%, #dbeafe)",
        boxShadow: "0 16px 34px rgba(15, 23, 42, 0.12)",
        backdropFilter: "blur(10px)",
      };
    case "outline":
      return {
        border: "2px solid color-mix(in oklab, var(--demo-primary) 30%, #cbd5e1)",
        boxShadow: "0 2px 0 rgba(15, 23, 42, 0.05)",
      };
    case "paper":
      return {
        border: "1px solid color-mix(in oklab, var(--demo-accent) 18%, #e5e7eb)",
        boxShadow: "0 10px 22px rgba(120, 53, 15, 0.08)",
      };
    case "brutal":
      return {
        border: "3px solid #0f172a",
        boxShadow: "6px 6px 0 #0f172a",
      };
    default:
      return {
        border: "1px solid color-mix(in oklab, var(--demo-secondary) 20%, #e2e8f0)",
        boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
      };
  }
}

export default function StyleLabPage() {
  const [selected, setSelected] = useState<Preset | null>(null);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelected(null);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const modalVars = useMemo(() => {
    if (!selected) {
      return {};
    }
    return {
      "--demo-primary": selected.palette.primary,
      "--demo-secondary": selected.palette.secondary,
      "--demo-accent": selected.palette.accent,
      "--demo-bg": selected.palette.bg,
      "--demo-surface": selected.palette.surface,
      "--demo-text": selected.palette.text,
    } as CSSProperties;
  }, [selected]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
              <Sparkles className="h-4 w-4" />
              UI/UX Pro Max · 风格提案
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              20 种首页完整设计方向
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 md:text-base">
              每套方案都同时调整：排版、字体、导航样式、卡片语言、交互动效与按钮反馈。点击卡片查看对应首页 demo。
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            返回首页
          </Link>
        </header>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PRESETS.map((preset, index) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => setSelected(preset)}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <MiniPreview preset={preset} />
              <div className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-slate-900">{preset.name}</div>
                    <div className="text-xs text-slate-500">{preset.subtitle}</div>
                  </div>
                  <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-600">
                    #{String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <p className="text-xs leading-5 text-slate-600">{preset.description}</p>

                <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                  <InfoBadge icon={<LayoutTemplate className="h-3 w-3" />} text={LAYOUT_LABEL[preset.layout]} />
                  <InfoBadge icon={<Type className="h-3 w-3" />} text={preset.typography.label} />
                  <InfoBadge icon={<MousePointerClick className="h-3 w-3" />} text={preset.interaction} />
                  <InfoBadge icon={<Sparkles className="h-3 w-3" />} text={preset.motion} />
                </div>

                <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700 transition group-hover:text-slate-900">
                  <Eye className="h-3.5 w-3.5" />
                  查看首页 Demo
                </div>
              </div>
            </button>
          ))}
        </section>
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-2xl bg-white shadow-2xl"
            style={modalVars}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <div>
                <div className="text-sm font-semibold text-slate-500">首页 Demo 预览</div>
                <div className="text-lg font-bold text-slate-900">
                  {selected.name} · {selected.subtitle}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-lg border border-slate-200 p-2 text-slate-600 transition hover:border-slate-300 hover:text-slate-900"
                aria-label="关闭预览"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[calc(92vh-76px)] overflow-auto bg-[var(--demo-bg)]">
              <HomeDemo preset={selected} />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .demo-motion-gentle {
          animation: demoFloat 5s ease-in-out infinite;
        }
        .demo-motion-snappy {
          animation: demoSnappy 1.8s ease-in-out infinite;
        }
        .demo-motion-dramatic {
          animation: demoDramatic 3.2s ease-in-out infinite;
        }
        @keyframes demoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes demoSnappy {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }
        @keyframes demoDramatic {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(-0.7deg); }
        }
      `}</style>
    </div>
  );
}

function InfoBadge({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
      {icon}
      <span className="truncate">{text}</span>
    </span>
  );
}

function MiniPreview({ preset }: { preset: Preset }) {
  const gradient = `linear-gradient(135deg, ${preset.palette.primary} 0%, ${preset.palette.secondary} 50%, ${preset.palette.accent} 100%)`;

  return (
    <div className="p-3" style={{ background: preset.palette.bg }}>
      <div className="h-28 rounded-xl p-2" style={{ background: gradient }}>
        <div className="h-full rounded-lg bg-white/90 p-2">
          <div className="mb-2 h-2 w-16 rounded bg-slate-300" />
          {preset.layout === "split" && (
            <div className="grid h-[70px] grid-cols-2 gap-2">
              <div className="rounded bg-slate-200" />
              <div className="rounded bg-slate-100" />
            </div>
          )}
          {preset.layout === "bento" && (
            <div className="grid h-[70px] grid-cols-3 gap-1">
              <div className="col-span-2 rounded bg-slate-200" />
              <div className="rounded bg-slate-100" />
              <div className="rounded bg-slate-100" />
              <div className="rounded bg-slate-200" />
              <div className="rounded bg-slate-100" />
            </div>
          )}
          {preset.layout === "editorial" && (
            <div className="space-y-1">
              <div className="h-2 w-full rounded bg-slate-200" />
              <div className="h-2 w-10/12 rounded bg-slate-200" />
              <div className="h-2 w-8/12 rounded bg-slate-100" />
            </div>
          )}
          {preset.layout === "poster" && (
            <div className="relative h-[70px] overflow-hidden rounded bg-slate-100">
              <div className="absolute -left-2 top-2 h-6 w-16 rounded bg-slate-300" />
              <div className="absolute right-1 bottom-2 h-5 w-12 rounded bg-slate-200" />
            </div>
          )}
          {preset.layout === "center" && (
            <div className="flex h-[70px] flex-col items-center justify-center gap-2">
              <div className="h-2 w-20 rounded bg-slate-300" />
              <div className="h-2 w-16 rounded bg-slate-200" />
              <div className="h-4 w-10 rounded bg-slate-100" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function HomeDemo({ preset }: { preset: Preset }) {
  const shellStyle: CSSProperties = {
    fontFamily: preset.typography.body,
    color: "var(--demo-text)",
  };

  const cardStyle = surfaceStyles(preset.surface);

  return (
    <div style={shellStyle} className="min-h-[820px] px-5 py-6 md:px-10 md:py-10">
      <DemoNav preset={preset} cardStyle={cardStyle} />
      <div className="mt-6">
        <DemoHero preset={preset} cardStyle={cardStyle} />
      </div>
      <DemoStats preset={preset} cardStyle={cardStyle} />
    </div>
  );
}

function DemoNav({ preset, cardStyle }: { preset: Preset; cardStyle: CSSProperties }) {
  const navItems = ["课程总览", "学习中心", "阅读探究", "互动课堂", "作业复盘"];

  if (preset.nav === "compact") {
    return (
      <div className="rounded-2xl bg-[var(--demo-surface)] px-5 py-4" style={cardStyle}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-lg"
              style={{ background: "linear-gradient(135deg, var(--demo-primary), var(--demo-secondary))" }}
            />
            <div>
              <div className="text-sm font-bold">议起读</div>
              <div className="text-[11px] text-slate-500">DELIBERATION</div>
            </div>
          </div>
          <div className="text-xs text-slate-500">{preset.subtitle}</div>
        </div>
      </div>
    );
  }

  if (preset.nav === "underline") {
    return (
      <div className="rounded-2xl bg-[var(--demo-surface)] px-5 py-4" style={cardStyle}>
        <div className="flex flex-wrap items-center gap-6">
          <div className="text-sm font-black">议起读</div>
          {navItems.map((item, idx) => (
            <span
              key={item}
              className="border-b-2 pb-1 text-sm"
              style={{
                borderColor: idx === 0 ? "var(--demo-primary)" : "transparent",
                color: idx === 0 ? "var(--demo-primary)" : "var(--demo-text)",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  if (preset.nav === "boxed") {
    return (
      <div className="rounded-2xl bg-[var(--demo-surface)] px-5 py-4" style={cardStyle}>
        <div className="flex flex-wrap items-center gap-2">
          <div className="mr-3 text-sm font-black">议起读</div>
          {navItems.map((item, idx) => (
            <span
              key={item}
              className="rounded-md border px-2.5 py-1 text-xs"
              style={{
                borderColor: idx === 0 ? "var(--demo-primary)" : "#cbd5e1",
                background: idx === 0 ? "color-mix(in oklab, var(--demo-primary) 10%, #fff)" : "#fff",
              }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl px-5 py-4 backdrop-blur-md"
      style={{
        ...cardStyle,
        background: "color-mix(in oklab, var(--demo-surface) 88%, #ffffff)",
      }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div
            className="h-9 w-9 rounded-lg"
            style={{ background: "linear-gradient(135deg, var(--demo-primary), var(--demo-secondary))" }}
          />
          <div className="text-sm font-black">议起读</div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {navItems.slice(0, 4).map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DemoHero({ preset, cardStyle }: { preset: Preset; cardStyle: CSSProperties }) {
  const headingStyle: CSSProperties = {
    fontFamily: preset.typography.heading,
    color: "var(--demo-text)",
  };

  const actionClass = `inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold ${INTERACTION_CLASS[preset.interaction]}`;

  const motionClass = MOTION_CLASS[preset.motion];

  if (preset.layout === "split") {
    return (
      <section className="grid gap-4 md:grid-cols-2">
        <div className={`rounded-3xl bg-[var(--demo-surface)] p-7 ${motionClass}`} style={cardStyle}>
          <h2 className="text-3xl font-black md:text-5xl" style={headingStyle}>
            掌握议事规则
            <br />
            提升课堂沟通与协作素养
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            当前方案重点变化：左右分栏、标题层级、按钮反馈与信息卡结构。
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              className={actionClass}
              style={{ background: "var(--demo-primary)", color: "#fff" }}
            >
              开始学习
            </button>
            <button
              className={actionClass}
              style={{
                border: "1px solid color-mix(in oklab, var(--demo-primary) 35%, #cbd5e1)",
                color: "var(--demo-primary)",
              }}
            >
              了解更多
            </button>
          </div>
        </div>
        <div className="grid gap-4">
          {["规则课程", "课堂互动", "作业复盘"].map((item) => (
            <article key={item} className={`rounded-2xl bg-[var(--demo-surface)] p-5 ${motionClass}`} style={cardStyle}>
              <div className="text-xs text-slate-500">模块</div>
              <div className="mt-1 text-lg font-bold" style={{ color: "var(--demo-primary)" }}>
                {item}
              </div>
              <p className="mt-1 text-sm text-slate-600">保留原业务流程，仅重设视觉与交互层。</p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (preset.layout === "bento") {
    return (
      <section className="grid gap-4 md:grid-cols-3">
        <article className={`rounded-3xl bg-[var(--demo-surface)] p-7 md:col-span-2 ${motionClass}`} style={cardStyle}>
          <h2 className="text-3xl font-black md:text-5xl" style={headingStyle}>
            议起读首页
            <br />
            Bento 风格提案
          </h2>
          <p className="mt-4 text-sm leading-7 text-slate-600">
            通过信息拼贴提高导航效率，适合用户快速分流到学习、互动和后台场景。
          </p>
          <div className="mt-6 flex gap-3">
            <button className={actionClass} style={{ background: "var(--demo-primary)", color: "#fff" }}>
              进入课程
            </button>
            <button className={actionClass} style={{ background: "var(--demo-accent)", color: "#fff" }}>
              进入互动
            </button>
          </div>
        </article>
        <article className={`rounded-3xl bg-[var(--demo-surface)] p-6 ${motionClass}`} style={cardStyle}>
          <div className="text-xs text-slate-500">活跃数据</div>
          <div className="mt-2 text-4xl font-black" style={{ color: "var(--demo-primary)" }}>
            500+
          </div>
          <div className="mt-2 text-sm text-slate-600">活跃学员参与训练</div>
        </article>
        {["阅读探究", "资源中心", "留言讨论"].map((item) => (
          <article key={item} className={`rounded-2xl bg-[var(--demo-surface)] p-5 ${motionClass}`} style={cardStyle}>
            <div className="text-sm font-semibold" style={{ color: "var(--demo-primary)" }}>
              {item}
            </div>
            <div className="mt-2 text-xs text-slate-500">点击后进入对应业务模块</div>
          </article>
        ))}
      </section>
    );
  }

  if (preset.layout === "editorial") {
    return (
      <section className="grid gap-4 md:grid-cols-12">
        <aside className={`rounded-2xl bg-[var(--demo-surface)] p-5 md:col-span-3 ${motionClass}`} style={cardStyle}>
          <div className="text-xs uppercase tracking-widest text-slate-500">Editorial</div>
          <div className="mt-4 text-sm leading-6 text-slate-600">
            以文字信息层级驱动阅读路径，适合课程介绍、规则说明与深度内容。
          </div>
        </aside>
        <article className={`rounded-2xl bg-[var(--demo-surface)] p-8 md:col-span-9 ${motionClass}`} style={cardStyle}>
          <h2 className="text-4xl font-black leading-tight md:text-6xl" style={headingStyle}>
            把公共议事规则
            <br />
            变成可执行能力
          </h2>
          <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600">
            这一方案强调排版、标题和摘要关系，减少视觉噪声，让内容本身成为主角。
          </p>
          <div className="mt-6 border-t border-slate-200 pt-5 text-xs text-slate-500">
            结构不变：课程、阅读、互动、作业、讨论、管理后台。
          </div>
        </article>
      </section>
    );
  }

  if (preset.layout === "poster") {
    return (
      <section
        className={`relative overflow-hidden rounded-3xl px-7 py-10 md:px-10 md:py-14 ${motionClass}`}
        style={{
          ...cardStyle,
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--demo-primary) 12%, #fff) 0%, color-mix(in oklab, var(--demo-secondary) 8%, #fff) 45%, color-mix(in oklab, var(--demo-accent) 14%, #fff) 100%)",
        }}
      >
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-20" style={{ background: "var(--demo-accent)" }} />
        <div className="absolute -left-8 bottom-4 h-24 w-24 rounded-full opacity-20" style={{ background: "var(--demo-secondary)" }} />
        <h2 className="relative text-4xl font-black leading-none md:text-7xl" style={headingStyle}>
          议事
          <br />
          学习
          <br />
          2.0
        </h2>
        <p className="relative mt-5 max-w-xl text-sm leading-7 text-slate-700">
          海报型布局，通过强视觉识别快速传达主张，适用于招新、活动、阶段发布。
        </p>
        <div className="relative mt-7 flex flex-wrap gap-3">
          <button className={actionClass} style={{ background: "var(--demo-primary)", color: "#fff" }}>
            立即加入
          </button>
          <button
            className={actionClass}
            style={{
              border: "1px solid color-mix(in oklab, var(--demo-primary) 35%, #cbd5e1)",
              background: "#fff",
              color: "var(--demo-primary)",
            }}
          >
            查看课程
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`rounded-3xl px-7 py-10 md:px-10 md:py-14 ${motionClass}`}
      style={{
        ...cardStyle,
        background:
          "linear-gradient(135deg, color-mix(in oklab, var(--demo-primary) 10%, #fff) 0%, color-mix(in oklab, var(--demo-secondary) 8%, #fff) 55%, color-mix(in oklab, var(--demo-accent) 9%, #fff) 100%)",
      }}
    >
      <div className="mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-black md:text-6xl" style={headingStyle}>
          掌握议事规则
          <br />
          提升课堂沟通与协作素养
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600">
          中心英雄区方案：强化主标题、保留核心 CTA，适配最广泛的用户入口场景。
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button className={actionClass} style={{ background: "var(--demo-primary)", color: "#fff" }}>
            开始学习
          </button>
          <button
            className={actionClass}
            style={{
              border: "1px solid color-mix(in oklab, var(--demo-primary) 35%, #cbd5e1)",
              color: "var(--demo-primary)",
              background: "#fff",
            }}
          >
            了解更多
          </button>
        </div>
      </div>
    </section>
  );
}

function DemoStats({ preset, cardStyle }: { preset: Preset; cardStyle: CSSProperties }) {
  const stats = [
    { label: "活跃学员", value: "500+" },
    { label: "精品课程", value: "12+" },
    { label: "模拟会议", value: "50+" },
    { label: "好评率", value: "98%" },
  ];

  return (
    <section className="mt-8 grid gap-4 md:grid-cols-4">
      {stats.map((item, idx) => (
        <article key={item.label} className={`rounded-2xl bg-[var(--demo-surface)] p-4 ${MOTION_CLASS[preset.motion]}`} style={cardStyle}>
          <div className="text-3xl font-black" style={{ color: idx % 2 === 0 ? "var(--demo-primary)" : "var(--demo-accent)" }}>
            {item.value}
          </div>
          <div className="mt-1 text-xs font-medium text-slate-500">{item.label}</div>
        </article>
      ))}
    </section>
  );
}
