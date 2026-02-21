"use client";

import FaqView, { FaqThemeConfig } from "@/components/pages/faq/FaqView";
import { FAQ_COPY } from "@/components/pages/faq/faq-content";

const config: FaqThemeConfig = {
  ...FAQ_COPY.classic,
  rootClass: "",
  cardClass: "bg-white border-gray-100",
  summaryClass: "text-gray-900 hover:bg-gray-50/80",
  indexBadgeClass: "bg-blue-50 text-primary",
  answerBorderClass: "border-gray-50",
  answerAccentClass: "border-blue-200",
  answerTextClass: "text-gray-600",
  calloutClass: "bg-gray-50 border-gray-100",
  calloutIconClass: "text-gray-300",
  calloutTextClass: "text-gray-500",
  calloutLinkClass: "text-primary hover:text-primary/80",
};

export default function ClassicFaqView() {
  return <FaqView config={config} />;
}
