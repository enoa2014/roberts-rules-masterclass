"use client";

import type { ReactNode } from "react";
import { useTheme } from "./theme-provider";

type Props = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageShell({ title, description, children }: Props) {
  const { theme } = useTheme();
  const isFestival = theme === "festival-civic";
  const isMint = theme === "mint-campaign";
  const isCharcoal = theme === "charcoal-grid";
  const isCopper = theme === "copper-lecture";

  return (
    <>
      <section
        className={`
        page-hero pt-28 md:pt-32 pb-6 md:pb-8
        ${isFestival ? "fc-page-hero fc-pattern" : isMint ? "mc-page-hero mc-pattern" : isCharcoal ? "cg-page-hero cg-pattern" : isCopper ? "cl-page-hero cl-pattern" : ""}
      `}
      >
        <div className="container max-w-6xl">
          <h1
            className={`
            text-3xl md:text-4xl font-extrabold tracking-tight animate-fadeInUp
            ${isFestival ? "text-rose-800" : isMint ? "text-teal-800" : isCharcoal ? "text-gray-900" : isCopper ? "text-orange-900" : "text-gray-900"}
          `}
          >
            {title}
          </h1>
          <p
            className={`
            mt-3 text-lg max-w-2xl animate-fadeInUp delay-100
            ${isFestival ? "text-rose-600" : isMint ? "text-teal-600" : isCharcoal ? "text-gray-600" : isCopper ? "text-orange-700" : "text-gray-500"}
          `}
          >
            {description}
          </p>
        </div>
      </section>

      <section className="container max-w-6xl py-8 md:py-12 animate-fadeIn delay-200">{children}</section>
    </>
  );
}
