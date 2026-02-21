"use client";

import RulesView, { RulesThemeConfig } from "@/components/pages/rules/RulesView";
import { RULES_COPY } from "@/components/pages/rules/rules-content";
import styles from "./festival.module.css";

const config: RulesThemeConfig = {
  ...RULES_COPY["festival-civic"],
  rootClass: styles.fc_root,
  cardClass: `${styles.fc_card} border-rose-100`,
  cardTitleClass: "text-rose-800 group-hover:text-rose-600",
  cardDescClass: "text-rose-700",
  cardLinkClass: "text-rose-600",
  heroContainerClass: `${styles.fc_hero} ${styles.fc_pattern} border-rose-200`,
  heroIconClass: `text-rose-400 ${styles.fc_animate_pulse}`,
  heroTitleClass: "text-rose-800",
  heroTextClass: "text-rose-600",
};

export default function FestivalRulesView() {
  return <RulesView config={config} />;
}
