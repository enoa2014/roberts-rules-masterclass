import type { Metadata } from "next";
import Script from "next/script";
import "../globals.css";
import { Providers } from "@/components/providers";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
    title: "Reading Garden | 阅读花园 - 议起读学习平台",
    description: "沉浸式阅读体验，深度探索文学作品的内涵与价值。",
};

export default function IndependentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="zh-CN" suppressHydrationWarning>
            <head>
                <Script src="/theme-init.js" strategy="beforeInteractive" />
            </head>
            <body className="font-serif">
                <ThemeProvider>
                    <Providers>
                        <main className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/20">
                            {children}
                        </main>
                    </Providers>
                </ThemeProvider>
            </body>
        </html>
    );
}
