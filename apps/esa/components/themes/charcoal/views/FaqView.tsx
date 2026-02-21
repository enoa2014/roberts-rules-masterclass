"use client";

import FaqView, { FaqThemeConfig } from "@/components/pages/faq/FaqView";
import { FAQ_COPY } from "@/components/pages/faq/faq-content";
import styles from "./charcoal.module.css";

const config: FaqThemeConfig = {
  ...FAQ_COPY["charcoal-grid"],
  rootClass: styles.charcoal_root,
  cardClass: `${styles.cg_card} border-gray-700`,
  summaryClass: "text-gray-900 hover:bg-gray-100/80",
  indexBadgeClass: "bg-gray-200 text-gray-800",
  answerBorderClass: "border-gray-200",
  answerAccentClass: "border-gray-400",
  answerTextClass: "text-gray-700",
  calloutClass: "bg-gray-100 border-gray-300",
  calloutIconClass: "text-gray-500",
  calloutTextClass: "text-gray-700",
  calloutLinkClass: "text-emerald-700 hover:text-emerald-600",
};

export default function CharcoalFaqView() {
  return <FaqView config={config} />;
}
