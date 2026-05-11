import type { Metadata } from "next";
import "./globals.css";
import CrispChat from "@/components/crisp-chat";
import { Navbar } from "@/components/navbar";

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
      <body className="min-h-full flex flex-col">
        <Navbar />
        {children}
        <CrispChat />
      </body>
    </html>
  );
}
