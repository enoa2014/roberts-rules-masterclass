"use client";

import ReadingView, { ReadingThemeConfig } from "@/components/pages/reading/ReadingView";
import { BookOpen, Sparkles, Star } from "lucide-react";
import styles from "./charcoal.module.css";

const bookCoverGradient = "from-slate-800 to-slate-900";
const bookBadgeClass = "bg-slate-900 text-emerald-300 border-emerald-500 border-2 rounded-none";

const bookColorMap = {
  blue: { bg: bookCoverGradient, badge: bookBadgeClass },
  red: { bg: bookCoverGradient, badge: bookBadgeClass },
  purple: { bg: bookCoverGradient, badge: bookBadgeClass },
  green: { bg: bookCoverGradient, badge: bookBadgeClass },
  cyan: { bg: bookCoverGradient, badge: bookBadgeClass },
  amber: { bg: bookCoverGradient, badge: bookBadgeClass },
};

const libraryColorMap = {
  blue: bookCoverGradient,
  red: bookCoverGradient,
  purple: bookCoverGradient,
  green: bookCoverGradient,
  cyan: bookCoverGradient,
  amber: bookCoverGradient,
  gray: "from-slate-600 to-slate-700",
};

const featureGradientMap = {
  blue: "from-emerald-600 to-emerald-500",
  purple: "from-emerald-700 to-slate-700",
  green: "from-emerald-500 to-emerald-700",
  red: "from-emerald-600 to-slate-800",
};

const config: ReadingThemeConfig = {
  rootClass: styles.charcoal_root,
  gridOverlayClass: styles.grid_overlay,
  heroClass: `${styles.cg_hero} ${styles.cg_pattern}`,
  badgeClass: `${styles.cg_badge} ${styles.cg_animate_glow}`,
  heroBadgeTitle: "阅读协议激活",
  heroBadgeSubtitle: "READING PROTOCOL",
  heroBadgeDotClass: "bg-emerald-400 shadow-[0_0_14px_rgba(16,185,129,0.6)]",
  heroBadgeDividerClass: "h-4 w-px bg-emerald-400/50",
  showHeroGlows: false,
  heroDecorations: [
    {
      icon: BookOpen,
      wrapperClass: "absolute top-16 right-20 text-emerald-400/15 animate-float",
      iconClass: "h-14 w-14",
    },
    {
      icon: Sparkles,
      wrapperClass: "absolute bottom-28 left-24 text-emerald-500/20 animate-float",
      iconClass: "h-12 w-12",
      style: { animationDelay: "1.5s" },
    },
    {
      icon: Star,
      wrapperClass: "absolute top-1/2 right-1/4 text-emerald-400/10 animate-float",
      iconClass: "h-16 w-16",
      style: { animationDelay: "3s" },
    },
  ],
  titleClass: styles.cg_title_hero,
  titleHighlightClass: "text-emerald-500 relative mx-4",
  titleAccentClass: "text-emerald-600",
  subtitleClass: "text-lg text-slate-600",
  primaryButtonClass: `${styles.cg_btn} ${styles.cg_btn_primary}`,
  secondaryButtonClass: `${styles.cg_btn} ${styles.cg_btn_ghost}`,
  statCardClass: `${styles.cg_stat_card} ${styles.cg_animate_snap}`,
  statIconWrapClass: "border-2 border-slate-700 bg-slate-900/80 rounded-none",
  statIconClass: "text-emerald-400",
  statValueClass: styles.cg_stat_value,
  statLabelClass: styles.cg_stat_label,
  featuredSectionClass: "py-20 md:py-24 bg-slate-50/90 relative",
  featuredBackdropClass: `absolute inset-0 ${styles.cg_pattern} opacity-30`,
  featuredBadgeClass: `${styles.cg_badge} mb-6 ${styles.cg_animate_slide}`,
  featuredTitleClass: `${styles.cg_title_section} mb-6 ${styles.cg_animate_slide}`,
  featuredDescClass: "text-sm text-slate-600 max-w-2xl mx-auto",
  librarySectionClass: "py-20 md:py-24 bg-slate-100/80 relative",
  libraryBackdropClass: `absolute inset-0 ${styles.cg_pattern} opacity-25`,
  libraryBadgeClass: `${styles.cg_badge} mb-6`,
  libraryTitleClass: `${styles.cg_title_section} mb-4`,
  libraryDescClass: "text-sm text-slate-600",
  featuresSectionClass: "py-20 md:py-24 bg-slate-50",
  featuresBadgeClass: `${styles.cg_badge} mb-6`,
  featuresTitleClass: `${styles.cg_title_section} mb-6`,
  featuresDescClass: "text-sm text-slate-600 max-w-2xl mx-auto",
  bookCardClass: `${styles.cg_card} p-6`,
  bookCoverClass: "relative w-full h-48 overflow-hidden mb-6 border-2 border-slate-800 rounded-none",
  bookCoverOverlayClass:
    "absolute inset-0 bg-gradient-to-br from-slate-900/70 via-transparent to-slate-900/30 mix-blend-multiply pointer-events-none",
  bookBadgeClass: "rounded-none tracking-[0.25em]",
  bookColorMap,
  bookMetaWrapClass: "flex items-center justify-between gap-3",
  bookMetaDividerClass: "h-4 w-px bg-emerald-400/40",
  bookMetaClass: "text-slate-500 font-mono uppercase tracking-wide",
  bookTitleClass: "text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600 transition-colors tracking-wide uppercase",
  bookAuthorClass: "text-sm text-slate-500 mb-3",
  bookDescClass: "text-slate-600 text-sm leading-relaxed mb-4",
  bookModuleTagClass: "px-2 py-1 text-xs border-2 border-slate-300 text-slate-600 uppercase tracking-wide font-mono",
  bookModuleMoreTagClass: "px-2 py-1 text-xs border-2 border-slate-300 text-slate-600 uppercase tracking-wide font-mono",
  bookButtonClass: `${styles.cg_btn} ${styles.cg_btn_primary} w-full group`,
  libraryCardClass: `${styles.cg_card} p-4 cursor-pointer`,
  libraryCoverClass: "relative w-full h-32 overflow-hidden mb-3 border-2 border-slate-800 rounded-none",
  libraryCoverOverlayClass:
    "absolute inset-0 bg-gradient-to-br from-slate-900/60 via-transparent to-slate-900/20 mix-blend-multiply pointer-events-none",
  libraryColorMap,
  libraryTitleClass: "font-semibold text-slate-900 text-sm mb-1 group-hover:text-emerald-600 transition-colors uppercase tracking-wide",
  libraryAuthorClass: "font-mono text-xs text-slate-500 uppercase tracking-wide",
  featureCardClass: `${styles.cg_card} p-8 text-center`,
  featureGradientMap,
  featureIconClass: `ring-2 ring-emerald-500 rounded-none ${styles.cg_animate_glow}`,
  featureTitleClass: "text-xl font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors uppercase tracking-wide",
  featureDescClass: "text-slate-600 text-sm leading-relaxed",
};

export default function CharcoalReadingView() {
  return <ReadingView config={config} />;
}
