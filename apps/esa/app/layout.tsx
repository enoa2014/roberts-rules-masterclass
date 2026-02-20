import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@yiqidu/ui/theme-provider";
import { ProvidersEsa } from "@yiqidu/ui/providers-esa";
import { SiteNavEsa } from "@yiqidu/ui/site-nav-esa";
import { SiteFooter } from "@yiqidu/ui/site-footer";

export const metadata: Metadata = {
  title: "议起读学习平台",
  description: "议事规则学习与阅读探索平台",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body>
        <ThemeProvider>
          <ProvidersEsa>
            <SiteNavEsa />
            <main className="pt-20">{children}</main>
            <SiteFooter />
          </ProvidersEsa>
        </ThemeProvider>
      </body>
    </html>
  );
}
