"use client";

import { useEffect } from "react";

export function CrispChat() {
  const websiteId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID;

  useEffect(() => {
    if (!websiteId) return;

    // 初始化 Crisp
    (window as unknown as Record<string, unknown>).$crisp = [];
    (window as unknown as Record<string, unknown>).CRISP_WEBSITE_ID = websiteId;

    const script = document.createElement("script");
    script.src = "https://client.crisp.chat/l.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // 组件卸载时移除脚本（页面路由切换时不常见，但保持干净）
      document.head.removeChild(script);
    };
  }, [websiteId]);

  return null;
}
