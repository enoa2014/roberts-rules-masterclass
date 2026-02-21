"use client";

import AboutView, { AboutThemeConfig } from "@/components/pages/about/AboutView";
import { ABOUT_COPY } from "@/components/pages/about/about-content";

const config: AboutThemeConfig = {
  ...ABOUT_COPY.classic,
  rootClass: "",
  textStrongClass: "text-gray-900",
  textBodyClass: "text-gray-600",
  textMutedClass: "text-gray-500",
  iconClass: "text-primary",
  valueCardClass: "bg-gray-50 border-gray-100 hover:shadow-md",
  contactMailBgClass: "bg-blue-50",
  contactMapBgClass: "bg-blue-50",
  contactIconClass: "text-primary",
  linkClass: "text-primary hover:text-primary/80",
  ctaContainerClass: "gradient-hero border-gray-100",
  ctaCardClass: "bg-white border-gray-50 hover:shadow-md hover:-translate-y-0.5",
};

export default function ClassicAboutView() {
  return <AboutView config={config} />;
}
