"use client";

import ReadingView, { ReadingThemeConfig } from "@/components/pages/reading/ReadingView";

const config: ReadingThemeConfig = {
  rootClass: "",
  heroClass: "gradient-hero",
  parliamentPatternClass: "parliament-pattern opacity-20",
  badgeClass: "glass-card text-green-700",
  titleClass: "text-hero text-gray-900",
  titleAccentClass: "text-display text-green-700",
  subtitleClass: "text-body text-gray-600",
  primaryButtonClass: "btn btn-primary",
  secondaryButtonClass: "btn btn-ghost",
};

export default function ClassicReadingView() {
  return <ReadingView config={config} />;
}
