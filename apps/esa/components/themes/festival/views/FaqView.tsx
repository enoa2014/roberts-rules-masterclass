"use client";

import FaqView, { FaqThemeConfig } from "@/components/pages/faq/FaqView";
import { FAQ_COPY } from "@/components/pages/faq/faq-content";
import styles from "./festival.module.css";

const config: FaqThemeConfig = {
  ...FAQ_COPY["festival-civic"],
  rootClass: styles.fc_root,
  cardClass: `${styles.fc_card} border-rose-100`,
  summaryClass: "text-rose-900 hover:bg-rose-50/80",
  indexBadgeClass: "bg-rose-100 text-rose-700",
  answerBorderClass: "border-rose-50",
  answerAccentClass: "border-rose-200",
  answerTextClass: "text-rose-700",
  calloutClass: "bg-rose-50 border-rose-100",
  calloutIconClass: "text-rose-300",
  calloutTextClass: "text-rose-600",
  calloutLinkClass: "text-rose-600 hover:text-rose-500",
};

export default function FestivalFaqView() {
  return <FaqView config={config} />;
}
