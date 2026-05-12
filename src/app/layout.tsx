import type { Metadata } from "next";
import Script from "next/script";
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
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <CrispChat />
        <GoogleAnalytics gaId="G-8Z7DNN3KQ1" />

        {/*
          Plausible Analytics
          strategy="beforeInteractive" 会将脚本注入到服务端渲染的初始 HTML <head> 中，
          这是让 Plausible 验证爬虫能检测到脚本的唯一可靠方式。
          直接在 <head> JSX 里写 <script> 标签在 Next.js App Router 中会被过滤掉。
        */}
        <Script
          src="https://plausible.io/js/pa-AAS2hef9AL2c90ZVxYGuk.js"
          strategy="beforeInteractive"
        />
        <Script id="plausible-init" strategy="beforeInteractive">
          {`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init()`}
        </Script>
      </body>
    </html>
  );
}
