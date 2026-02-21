"use client";

import RulesView, { RulesThemeConfig } from "@/components/pages/rules/RulesView";
import { RULES_COPY } from "@/components/pages/rules/rules-content";
import styles from "./mint.module.css";

const config: RulesThemeConfig = {
  ...RULES_COPY["mint-campaign"],
  rootClass: styles.mint_root,
  cardClass: `${styles.mc_card} border-teal-100`,
  cardTitleClass: "text-teal-800 group-hover:text-teal-600",
  cardDescClass: "text-teal-700",
  cardLinkClass: "text-teal-600",
  heroContainerClass: `${styles.mc_hero} ${styles.mc_pattern} border-teal-200`,
  heroIconClass: `text-teal-500 ${styles.mc_animate_pulse}`,
  heroTitleClass: "text-teal-800",
  heroTextClass: "text-teal-600",
};

export default function MintRulesView() {
  return <RulesView config={config} />;
}
