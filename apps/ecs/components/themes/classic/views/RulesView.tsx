"use client";

import RulesView, { RulesThemeConfig } from "@/components/pages/rules/RulesView";
import { RULES_COPY } from "@/components/pages/rules/rules-content";

const config: RulesThemeConfig = {
  ...RULES_COPY.classic,
  rootClass: "",
  cardClass: "bg-white border-gray-100",
  cardTitleClass: "text-gray-900 group-hover:text-primary",
  cardDescClass: "text-gray-500",
  cardLinkClass: "text-primary",
  heroContainerClass: "gradient-hero border-gray-100",
  heroIconClass: "text-amber-400 animate-pulseSoft",
  heroTitleClass: "text-gray-900",
  heroTextClass: "text-gray-500",
};

export default function ClassicRulesView() {
  return <RulesView config={config} />;
}
