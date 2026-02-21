"use client";

import RulesView, { RulesThemeConfig } from "@/components/pages/rules/RulesView";
import { RULES_COPY } from "@/components/pages/rules/rules-content";
import { Gavel } from "lucide-react";
import styles from "./charcoal.module.css";

const config: RulesThemeConfig = {
  ...RULES_COPY["charcoal-grid"],
  rootClass: styles.charcoal_root,
  contentClass: "space-y-12",
  gridClass: "grid gap-8 md:grid-cols-2 lg:grid-cols-3",
  introBadgeLabel: "议事协议 / PROTOCOL",
  introBadgeClass: `${styles.cg_badge} ${styles.cg_animate_glow}`,
  introBadgeIcon: Gavel,
  introBadgeIconClass: "h-4 w-4",
  cardIndexLabels: ["01", "02", "03"],
  cardIndexClass: "text-xs uppercase tracking-[0.35em] text-emerald-500 mb-0 font-mono",
  cardMetaLabels: ["CORE PRINCIPLES", "MOTION STACK", "MEETING FLOW"],
  cardMetaClass: "text-xs uppercase tracking-[0.3em] text-slate-600 mb-3 font-mono",
  cardHeaderClass: "flex items-start justify-between gap-4",
  cardHeaderDividerClass: "h-px bg-slate-800/80 my-4",
  cardDividerClass: "h-px bg-slate-800 my-4",
  cardClass: styles.cg_card,
  cardIconClass: "rounded-none border-2 border-slate-800 bg-slate-900 text-emerald-400 mb-0",
  cardTitleClass: "text-gray-900 group-hover:text-emerald-600 uppercase tracking-wide",
  cardDescClass: "text-gray-600 font-mono",
  cardLinkClass: "text-emerald-700 uppercase tracking-widest font-mono",
  cardLinkIconClass: "transition-transform duration-200 group-hover:translate-x-1",
  cardFooterClass: "flex items-center justify-between",
  cardColorMap: {
    blue: { border: "border-l-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-400" },
    indigo: { border: "border-l-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-400" },
    emerald: { border: "border-l-emerald-500", bg: "bg-emerald-500/10", text: "text-emerald-400" },
  },
  heroContainerClass: `${styles.cg_page_hero} ${styles.cg_pattern}`,
  heroIconClass: `text-emerald-400 ${styles.cg_animate_glow}`,
  heroTitleClass: "text-gray-900 uppercase tracking-widest",
  heroTextClass: "text-gray-600 font-mono",
};

export default function CharcoalRulesView() {
  return <RulesView config={config} />;
}
