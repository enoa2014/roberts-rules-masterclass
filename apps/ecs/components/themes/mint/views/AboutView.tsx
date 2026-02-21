"use client";

import AboutView, { AboutThemeConfig } from "@/components/pages/about/AboutView";
import { ABOUT_COPY } from "@/components/pages/about/about-content";
import styles from "./mint.module.css";

const config: AboutThemeConfig = {
  ...ABOUT_COPY["mint-campaign"],
  rootClass: styles.mint_root,
  textStrongClass: "text-teal-800",
  textBodyClass: "text-teal-700",
  textMutedClass: "text-teal-600",
  iconClass: "text-teal-600",
  valueCardClass: `${styles.mc_card} ${styles.mc_animate_bounce}`,
  useValueCardDelay: true,
  contactMailBgClass: "bg-gradient-to-br from-teal-500 to-teal-600",
  contactMapBgClass: "bg-gradient-to-br from-orange-500 to-orange-600",
  contactIconClass: "text-white",
  linkClass: "text-teal-600 hover:text-teal-500",
  ctaContainerClass: `${styles.mc_hero} ${styles.mc_pattern} border-teal-200`,
  ctaCardClass: `${styles.mc_card} ${styles.mc_animate_bounce} hover:shadow-lg`,
};

export default function MintAboutView() {
  return <AboutView config={config} />;
}
