import type { Metadata } from "next";
import Script from "next/script";
import "../globals.css";
import { SiteNavEcs, SiteFooter, ProvidersEcs, ThemeProvider } from "@yiqidu/ui";

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
        <Script src="/theme-init.js" strategy="beforeInteractive" />
      </head>
      <body className="font-sans">
        <ThemeProvider>
          <ProvidersEcs>
            <div className="flex min-h-screen flex-col">
              <SiteNavEcs />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </ProvidersEcs>
        </ThemeProvider>
      </body>
    </html>
  );
}
