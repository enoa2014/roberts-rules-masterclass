"use client";

import ReadingView, { ReadingThemeConfig } from "@/components/pages/reading/ReadingView";
import { Flower, Leaf, TreePine } from "lucide-react";
import styles from "./copper.module.css";

const bookColorMap = {
  blue: { bg: "from-amber-500 to-orange-600", badge: "bg-orange-50 text-orange-700 border-orange-200" },
  red: { bg: "from-orange-500 to-amber-600", badge: "bg-orange-50 text-orange-700 border-orange-200" },
  purple: { bg: "from-amber-400 to-orange-500", badge: "bg-orange-50 text-orange-700 border-orange-200" },
  green: { bg: "from-amber-500 to-orange-500", badge: "bg-orange-50 text-orange-700 border-orange-200" },
  cyan: { bg: "from-amber-500 to-orange-600", badge: "bg-orange-50 text-orange-700 border-orange-200" },
  amber: { bg: "from-amber-500 to-orange-600", badge: "bg-orange-50 text-orange-700 border-orange-200" },
};

const libraryColorMap = {
  blue: "from-amber-500 to-orange-600",
  red: "from-orange-500 to-amber-600",
  purple: "from-amber-400 to-orange-500",
  green: "from-amber-500 to-orange-500",
  cyan: "from-amber-500 to-orange-600",
  amber: "from-amber-500 to-orange-600",
  gray: "from-orange-300 to-amber-400",
};

const featureGradientMap = {
  blue: "from-orange-500 to-amber-500",
  purple: "from-amber-500 to-orange-400",
  green: "from-orange-400 to-amber-500",
  red: "from-orange-600 to-amber-500",
};

const config: ReadingThemeConfig = {
  rootClass: styles.copper_root,
  heroClass: `${styles.cl_hero} ${styles.cl_pattern}`,
  badgeClass: styles.cl_badge,
  heroBadgeTitle: "讲堂阅读开放",
  heroBadgeSubtitle: "LECTURE READING",
  heroBadgeDotClass: "bg-orange-400 shadow-[0_0_12px_rgba(251,146,60,0.5)]",
  heroBadgeDividerClass: "h-4 w-px bg-orange-300/60",
  heroGlows: [
    {
      className:
        "absolute top-8 left-12 w-96 h-96 bg-gradient-to-r from-orange-400/15 to-amber-500/10 rounded-full blur-3xl animate-float",
    },
    {
      className:
        "absolute bottom-12 right-10 w-80 h-80 bg-gradient-to-r from-amber-400/12 to-orange-500/10 rounded-full blur-3xl animate-float",
      style: { animationDelay: "2s" },
    },
  ],
  heroDecorations: [
    {
      icon: Leaf,
      wrapperClass: "absolute top-20 right-20 text-orange-400/20 animate-float",
      iconClass: "h-16 w-16",
    },
    {
      icon: Flower,
      wrapperClass: "absolute bottom-32 left-32 text-amber-400/20 animate-float",
      iconClass: "h-12 w-12",
      style: { animationDelay: "1s" },
    },
    {
      icon: TreePine,
      wrapperClass: "absolute top-1/2 right-1/4 text-orange-400/15 animate-float",
      iconClass: "h-20 w-20",
      style: { animationDelay: "3s" },
    },
  ],
  titleClass: styles.cl_title_hero,
  titleHighlightClass: "text-orange-700 relative mx-4",
  titleAccentClass: "text-orange-800",
  subtitleClass: "text-lg text-orange-800",
  primaryButtonClass: `${styles.cl_btn} ${styles.cl_btn_primary}`,
  secondaryButtonClass: `${styles.cl_btn} ${styles.cl_btn_ghost}`,
  statCardClass: styles.cl_stat_card,
  statIconWrapClass: "bg-orange-50 text-orange-700 border border-orange-200",
  statIconClass: "text-orange-700",
  statValueClass: styles.cl_stat_value,
  statLabelClass: styles.cl_stat_label,
  featuredSectionClass: "py-20 md:py-24 bg-[#fffaf3] relative",
  featuredBackdropClass: `absolute inset-0 ${styles.cl_pattern} opacity-20`,
  featuredBadgeClass: `${styles.cl_badge} mb-6 animate-fadeInUp`,
  featuredTitleClass: `${styles.cl_title_section} mb-6`,
  featuredDescClass: "text-sm text-orange-700 max-w-2xl mx-auto",
  librarySectionClass: "py-20 md:py-24 bg-white relative",
  libraryBackdropClass: `absolute inset-0 ${styles.cl_pattern} opacity-15`,
  libraryBadgeClass: `${styles.cl_badge} mb-6`,
  libraryTitleClass: `${styles.cl_title_section} mb-4`,
  libraryDescClass: "text-sm text-orange-700",
  featuresSectionClass: "py-20 md:py-24 bg-[#fffaf6]",
  featuresBadgeClass: `${styles.cl_badge} mb-6`,
  featuresTitleClass: `${styles.cl_title_section} mb-6`,
  featuresDescClass: "text-sm text-orange-700 max-w-2xl mx-auto",
  bookCardClass: `${styles.cl_card} p-6`,
  bookCoverClass: "relative w-full h-48 rounded-2xl overflow-hidden mb-6 border border-orange-200 group-hover:shadow-xl transition-all duration-300",
  bookCoverOverlayClass:
    "absolute inset-0 bg-gradient-to-tr from-orange-100/50 via-transparent to-transparent pointer-events-none",
  bookColorMap,
  bookMetaWrapClass: "flex items-center justify-between gap-3",
  bookMetaDividerClass: "h-4 w-px bg-orange-200",
  bookMetaClass: "text-orange-600",
  bookTitleClass: "text-lg font-bold text-orange-900 mb-2 group-hover:text-orange-700 transition-colors",
  bookAuthorClass: "text-sm text-orange-700 mb-3",
  bookDescClass: "text-orange-700 text-sm leading-relaxed mb-4",
  bookModuleTagClass: "px-2 py-1 text-xs rounded-full bg-orange-50 text-orange-700 border border-orange-200 uppercase tracking-wide",
  bookModuleMoreTagClass: "px-2 py-1 text-xs rounded-full bg-orange-50 text-orange-700 border border-orange-200 uppercase tracking-wide",
  bookButtonClass: `${styles.cl_btn} ${styles.cl_btn_primary} w-full group`,
  libraryCardClass: `${styles.cl_card} p-4 cursor-pointer`,
  libraryCoverClass: "relative w-full h-32 rounded-xl overflow-hidden mb-3 border border-orange-200 group-hover:shadow-lg transition-all duration-300",
  libraryCoverOverlayClass:
    "absolute inset-0 bg-gradient-to-tr from-orange-100/40 via-transparent to-transparent pointer-events-none",
  libraryColorMap,
  libraryTitleClass: "font-semibold text-orange-900 text-sm mb-1 group-hover:text-orange-700 transition-colors",
  libraryAuthorClass: "font-mono text-xs text-orange-700 uppercase tracking-wide",
  featureCardClass: `${styles.cl_card} p-8 text-center`,
  featureGradientMap,
  featureIconClass: styles.cl_animate_pulse,
  featureTitleClass: "text-xl font-bold text-orange-900 mb-3 group-hover:text-orange-700 transition-colors",
  featureDescClass: "text-orange-700 text-sm leading-relaxed",
};

export default function CopperReadingView() {
  return <ReadingView config={config} />;
}
