"use client";

import AboutView, { AboutThemeConfig } from "@/components/pages/about/AboutView";
import { ABOUT_COPY } from "@/components/pages/about/about-content";
import styles from "./copper.module.css";

const config: AboutThemeConfig = {
  ...ABOUT_COPY["copper-lecture"],
  rootClass: styles.copper_root,
  textStrongClass: "text-orange-900",
  textBodyClass: "text-orange-800",
  textMutedClass: "text-orange-700",
  iconClass: "text-orange-800",
  valueCardClass: `${styles.cl_card} ${styles.cl_animate_bounce}`,
  useValueCardDelay: true,
  contactMailBgClass: "bg-gradient-to-br from-orange-800 to-amber-700",
  contactMapBgClass: "bg-gradient-to-br from-blue-700 to-blue-600",
  contactIconClass: "text-white",
  linkClass: "text-orange-800 hover:text-orange-700",
  ctaContainerClass: `${styles.cl_page_hero} ${styles.cl_pattern} border-orange-200`,
  ctaCardClass: `${styles.cl_card} ${styles.cl_animate_bounce} hover:shadow-lg`,
};

export default function CopperAboutView() {
  return <AboutView config={config} />;
}
