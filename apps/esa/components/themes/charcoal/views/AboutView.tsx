"use client";

import AboutView, { AboutThemeConfig } from "@/components/pages/about/AboutView";
import { ABOUT_COPY } from "@/components/pages/about/about-content";
import styles from "./charcoal.module.css";

const config: AboutThemeConfig = {
  ...ABOUT_COPY["charcoal-grid"],
  rootClass: styles.charcoal_root,
  textStrongClass: "text-gray-900",
  textBodyClass: "text-gray-700",
  textMutedClass: "text-gray-600",
  iconClass: "text-gray-800",
  valueCardClass: `${styles.cg_card} ${styles.cg_animate_snap}`,
  useValueCardDelay: true,
  contactMailBgClass: "bg-gradient-to-br from-gray-800 to-gray-700",
  contactMapBgClass: "bg-gradient-to-br from-emerald-600 to-emerald-500",
  contactIconClass: "text-white",
  linkClass: "text-emerald-700 hover:text-emerald-600",
  ctaContainerClass: `${styles.cg_page_hero} ${styles.cg_pattern} border-gray-700`,
  ctaCardClass: `${styles.cg_card} ${styles.cg_animate_snap} hover:shadow-lg`,
};

export default function CharcoalAboutView() {
  return <AboutView config={config} />;
}
