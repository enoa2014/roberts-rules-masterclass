"use client";

import RulesView, { RulesThemeConfig } from "@/components/pages/rules/RulesView";
import { RULES_COPY } from "@/components/pages/rules/rules-content";
import { BookOpen } from "lucide-react";
import styles from "./copper.module.css";

const config: RulesThemeConfig = {
  ...RULES_COPY["copper-lecture"],
  rootClass: styles.copper_root,
  contentClass: "space-y-12",
  gridClass: "grid gap-8 md:grid-cols-2 lg:grid-cols-3",
  introBadgeLabel: "讲堂议事纲要 / LECTURE NOTES",
  introBadgeClass: `${styles.cl_badge}`,
  introBadgeIcon: BookOpen,
  introBadgeIconClass: "h-4 w-4",
  cardIndexLabels: ["I", "II", "III"],
  cardIndexClass: "text-xs uppercase tracking-[0.25em] text-orange-600 mb-0",
  cardMetaLabels: ["原则篇", "动议篇", "流程篇"],
  cardMetaClass: "text-xs tracking-[0.3em] text-orange-700 mb-3",
  cardHeaderClass: "flex items-start justify-between gap-4",
  cardHeaderDividerClass: "h-px bg-orange-200/80 my-4",
  cardDividerClass: "h-px bg-orange-200 my-4",
  cardClass: styles.cl_card,
  cardIconClass: "bg-orange-50 text-orange-700 ring-1 ring-orange-200 shadow-sm mb-0",
  cardTitleClass: "text-orange-900 group-hover:text-orange-700 tracking-wide",
  cardDescClass: "text-orange-700 leading-relaxed",
  cardLinkClass: "text-orange-800 uppercase tracking-[0.25em]",
  cardLinkIconClass: "transition-transform duration-200 group-hover:translate-x-1",
  cardFooterClass: "flex items-center justify-between",
  cardColorMap: {
    blue: { border: "border-l-orange-400", bg: "bg-orange-50", text: "text-orange-600" },
    indigo: { border: "border-l-orange-400", bg: "bg-orange-50", text: "text-orange-600" },
    emerald: { border: "border-l-orange-400", bg: "bg-orange-50", text: "text-orange-600" },
  },
  heroContainerClass: `${styles.cl_page_hero} ${styles.cl_pattern}`,
  heroIconClass: `text-orange-500 ${styles.cl_animate_pulse}`,
  heroTitleClass: "text-orange-900 tracking-wide",
  heroTextClass: "text-orange-700",
};

export default function CopperRulesView() {
  return <RulesView config={config} />;
}
