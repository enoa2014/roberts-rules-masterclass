"use client";

import FaqView, { FaqThemeConfig } from "@/components/pages/faq/FaqView";
import { FAQ_COPY } from "@/components/pages/faq/faq-content";
import styles from "./copper.module.css";

const config: FaqThemeConfig = {
  ...FAQ_COPY["copper-lecture"],
  rootClass: styles.copper_root,
  cardClass: `${styles.cl_card} border-orange-200`,
  summaryClass: "text-orange-900 hover:bg-orange-50/80",
  indexBadgeClass: "bg-orange-100 text-orange-800",
  answerBorderClass: "border-orange-100",
  answerAccentClass: "border-orange-300",
  answerTextClass: "text-orange-800",
  calloutClass: "bg-orange-50 border-orange-200",
  calloutIconClass: "text-orange-400",
  calloutTextClass: "text-orange-700",
  calloutLinkClass: "text-orange-800 hover:text-orange-700",
};

export default function CopperFaqView() {
  return <FaqView config={config} />;
}
