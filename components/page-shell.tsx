"use client";

import type { ReactNode } from "react";
import { useTheme } from "@/components/theme-provider";

type Props = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageShell({ title, description, children }: Props) {
  const { theme } = useTheme();
  const isFestival = theme === "festival-civic";
  const isMint = theme === "mint-campaign";

  return (
    <>
      <section
        className={`
        page-hero pt-28 md:pt-32 pb-6 md:pb-8
        ${isFestival ? "fc-hero fc-pattern" : isMint ? "mc-hero mc-pattern" : ""}
      `}
      >
        <div className="container max-w-6xl">
          <h1
            className={`
            text-3xl md:text-4xl font-extrabold tracking-tight animate-fadeInUp
            ${isFestival ? "text-rose-800" : isMint ? "text-teal-800" : "text-gray-900"}
          `}
          >
            {title}
          </h1>
          <p
            className={`
            mt-3 text-lg max-w-2xl animate-fadeInUp delay-100
            ${isFestival ? "text-rose-600" : isMint ? "text-teal-600" : "text-gray-500"}
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
