"use client";

import ReadingView, { ReadingThemeConfig } from "@/components/pages/reading/ReadingView";
import styles from "./mint.module.css";

const config: ReadingThemeConfig = {
  rootClass: styles.mint_root,
  heroClass: `${styles.mc_hero} ${styles.mc_pattern}`,
  badgeClass: styles.mc_badge,
  titleClass: styles.mc_title_hero,
  titleAccentClass: "text-teal-700",
  subtitleClass: "text-lg text-teal-800",
  primaryButtonClass: `${styles.mc_btn} ${styles.mc_btn_primary}`,
  secondaryButtonClass: `${styles.mc_btn} ${styles.mc_btn_ghost}`,
};

export default function MintReadingView() {
  return <ReadingView config={config} />;
}
