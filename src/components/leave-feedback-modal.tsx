"use client";

import { useState } from "react";

export function LeaveFeedbackModal({
  trigger,
}: {
  trigger: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  function handleSend() {
    const subject = encodeURIComponent("我想离开 DearMate —— 反馈原因");
    const body = encodeURIComponent(reason || "（未填写原因）");
    window.location.href = `mailto:support@dearmate.mom?subject=${subject}&body=${body}`;
    setOpen(false);
  }

  return (
    <>
      <span onClick={() => setOpen(true)} className="cursor-pointer">
        {trigger}
      </span>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="w-full max-w-md rounded-2xl bg-[#FDF8F4] p-6 shadow-2xl">
            <h2 className="text-lg font-semibold text-[#241C18]">
              能告诉我们你为什么离开吗？
            </h2>
            <p className="mt-1.5 text-xs text-[#A08C84]">
              你的反馈会直接发到我们的邮箱，帮助我们做得更好。
            </p>
            <textarea
              className="mt-4 w-full resize-none rounded-xl border border-[#D8C4B8] bg-white p-3 text-sm text-[#241C18] placeholder:text-[#C4B0A8] focus:outline-none focus:ring-2 focus:ring-[#C8553D]/40"
              rows={4}
              placeholder="功能不够用？遇到了 bug？还是有更好的替代品？随便说说～"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-full border border-[#D8C4B8] py-2.5 text-sm text-[#8A7168] transition hover:bg-[#EFE2D5]"
              >
                取消
              </button>
              <button
                onClick={handleSend}
                className="flex-1 rounded-full bg-[#C8553D] py-2.5 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(200,85,61,0.30)] transition hover:bg-[#b84834]"
              >
                发送反馈
              </button>
            </div>
            <p className="mt-3 text-center text-[10px] text-[#B0A09A]">
              反馈将发送至 support@dearmate.mom
            </p>
          </div>
        </div>
      )}
    </>
  );
}
