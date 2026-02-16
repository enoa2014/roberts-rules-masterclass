import type { Metadata } from "next";
import "../globals.css";

import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "议起读 — 课程学习与互动平台",
  description: "掌握公共议事规则，提升公民核心素养。课程学习、课堂互动、课后复盘一体化平台。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <script src="/theme-init.js" />
      </head>
      <body className="font-sans">
        <ThemeProvider>
          <Providers>
            <div className="flex min-h-screen flex-col">
              <SiteNav />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
