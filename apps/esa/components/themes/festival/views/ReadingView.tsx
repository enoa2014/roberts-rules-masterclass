"use client";

import ReadingView, { ReadingThemeConfig } from "@/components/pages/reading/ReadingView";
import styles from "./festival.module.css";

const config: ReadingThemeConfig = {
  rootClass: styles.fc_root,
  heroClass: `${styles.fc_hero} ${styles.fc_pattern}`,
  badgeClass: styles.fc_badge,
  titleClass: styles.fc_title_hero,
  titleAccentClass: "text-rose-700",
  subtitleClass: "text-lg text-rose-800",
  primaryButtonClass: `${styles.fc_btn} ${styles.fc_btn_primary}`,
  secondaryButtonClass: `${styles.fc_btn} ${styles.fc_btn_ghost}`,
};

export default function FestivalReadingView() {
  return <ReadingView config={config} />;
}
