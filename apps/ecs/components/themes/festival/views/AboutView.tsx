"use client";

import AboutView, { AboutThemeConfig } from "@/components/pages/about/AboutView";
import { ABOUT_COPY } from "@/components/pages/about/about-content";
import styles from "./festival.module.css";

const config: AboutThemeConfig = {
  ...ABOUT_COPY["festival-civic"],
  rootClass: styles.fc_root,
  textStrongClass: "text-rose-800",
  textBodyClass: "text-rose-700",
  textMutedClass: "text-rose-600",
  iconClass: "text-rose-600",
  valueCardClass: `${styles.fc_card} ${styles.fc_animate_bounce}`,
  useValueCardDelay: true,
  contactMailBgClass: "bg-gradient-to-br from-rose-500 to-rose-600",
  contactMapBgClass: "bg-gradient-to-br from-blue-500 to-blue-600",
  contactIconClass: "text-white",
  linkClass: "text-rose-600 hover:text-rose-500",
  ctaContainerClass: `${styles.fc_hero} ${styles.fc_pattern} border-rose-200`,
  ctaCardClass: `${styles.fc_card} ${styles.fc_animate_bounce} hover:shadow-lg`,
};

export default function FestivalAboutView() {
  return <AboutView config={config} />;
}
