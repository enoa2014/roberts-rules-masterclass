"use client";

import { PageShell } from "@yiqidu/ui";
import { ArrowRight, Mail, MapPin } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type AboutValueCard = {
  icon: LucideIcon;
  label: string;
  desc: string;
};

export type AboutCtaCard = {
  title: string;
  desc: string;
  linkLabel: string;
  href: string;
  delayMs?: number;
};

export type AboutThemeConfig = {
  rootClass?: string;
  pageTitle: string;
  pageDescription: string;
  brandName: string;
  intro1: string;
  intro2: string;
  valueCards: AboutValueCard[];
  textStrongClass: string;
  textBodyClass: string;
  textMutedClass: string;
  iconClass: string;
  valueCardClass: string;
  useValueCardDelay?: boolean;
  contactMailBgClass: string;
  contactMapBgClass: string;
  contactIconClass: string;
  linkClass: string;
  ctaContainerClass: string;
  ctaTitle: string;
  ctaCards: AboutCtaCard[];
  ctaCardClass: string;
};

export default function AboutView({ config }: { config: AboutThemeConfig }) {
  return (
    <div className={config.rootClass || ""}>
      <PageShell title={config.pageTitle} description={config.pageDescription}>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className={`space-y-5 leading-relaxed ${config.textBodyClass}`}>
              <p>
                <strong className={config.textStrongClass}>{config.brandName}</strong>
                {config.intro1}
              </p>
              <p>{config.intro2}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              {config.valueCards.map((v, i) => (
                <div
                  key={v.label}
                  className={`
                    text-center p-4 rounded-xl border transition-all duration-300
                    ${config.valueCardClass}
                  `}
                  style={
                    config.useValueCardDelay
                      ? { animationDelay: `${(i + 1) * 100}ms` }
                      : undefined
                  }
                >
                  <v.icon className={`h-6 w-6 mx-auto mb-2 ${config.iconClass}`} />
                  <div className={`font-bold text-sm ${config.textStrongClass}`}>{v.label}</div>
                  <div className={`text-xs mt-0.5 ${config.textMutedClass}`}>{v.desc}</div>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <h3 className={`text-lg font-bold mb-4 ${config.textStrongClass}`}>联系方式</h3>
              <ul className="space-y-3">
                <li className={`flex items-center gap-3 ${config.textBodyClass}`}>
                  <div
                    className={`
                      h-9 w-9 rounded-lg flex items-center justify-center
                      ${config.contactMailBgClass}
                    `}
                  >
                    <Mail className={`h-4.5 w-4.5 ${config.contactIconClass}`} />
                  </div>
                  <span className="text-sm">contact@yiqidu.com</span>
                </li>
                <li className={`flex items-center gap-3 ${config.textBodyClass}`}>
                  <div
                    className={`
                      h-9 w-9 rounded-lg flex items-center justify-center
                      ${config.contactMapBgClass}
                    `}
                  >
                    <MapPin className={`h-4.5 w-4.5 ${config.contactIconClass}`} />
                  </div>
                  <span className="text-sm">北京市海淀区中关村大街</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="space-y-5">
            <div
              className={`
                rounded-2xl p-8 border
                ${config.ctaContainerClass}
              `}
            >
              <h3 className={`text-xl font-bold mb-6 ${config.textStrongClass}`}>{config.ctaTitle}</h3>
              <div className="space-y-4">
                {config.ctaCards.map((card) => (
                  <div
                    key={card.title}
                    className={`
                      p-6 rounded-xl shadow-sm border transition-all duration-300 cursor-pointer
                      ${config.ctaCardClass}
                    `}
                    style={card.delayMs ? { animationDelay: `${card.delayMs}ms` } : undefined}
                  >
                    <h4 className={`font-bold mb-2 ${config.textStrongClass}`}>{card.title}</h4>
                    <p className={`text-sm mb-4 ${config.textMutedClass}`}>{card.desc}</p>
                    <a
                      href={card.href}
                      className={`inline-flex items-center text-sm font-semibold transition-colors ${config.linkClass}`}
                    >
                      {card.linkLabel} <ArrowRight className="ml-1 h-4 w-4" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageShell>
    </div>
  );
}
