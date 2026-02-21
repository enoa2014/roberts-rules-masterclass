"use client";

import FaqView, { FaqThemeConfig } from "@/components/pages/faq/FaqView";
import { FAQ_COPY } from "@/components/pages/faq/faq-content";
import styles from "./mint.module.css";

const config: FaqThemeConfig = {
  ...FAQ_COPY["mint-campaign"],
  rootClass: styles.mint_root,
  cardClass: `${styles.mc_card} border-teal-100`,
  summaryClass: "text-teal-900 hover:bg-teal-50/80",
  indexBadgeClass: "bg-teal-100 text-teal-700",
  answerBorderClass: "border-teal-50",
  answerAccentClass: "border-teal-200",
  answerTextClass: "text-teal-700",
  calloutClass: "bg-teal-50 border-teal-100",
  calloutIconClass: "text-teal-300",
  calloutTextClass: "text-teal-600",
  calloutLinkClass: "text-teal-600 hover:text-teal-500",
};

export default function MintFaqView() {
  return <FaqView config={config} />;
}
