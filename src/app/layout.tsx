import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import CrispChat from "@/components/crisp-chat";

export const metadata: Metadata = {
  title: "Paper Boyfriend",
  description: "A quiet AI companion web app with four stable characters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500;1,600&display=swap"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://plausible.io/js/pa-c8-6mAkcTc8_HTjNX_Hjh.js" defer />
      </head>
      <body className="min-h-full flex flex-col">
        {/* Plausible init —— Plausible 验证爬虫会搜索 "plausible.init" 字符串 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`,
          }}
        />
        {children}
        <CrispChat />
        <GoogleAnalytics gaId="G-8Z7DNN3KQ1" />
      </body>
    </html>
  );
}
