"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

const TOAST_MSG: Record<string, { msg: string; color: string }> = {
  success: { msg: "💳 크레딧 충전이 완료됐어요!", color: "#0062CC" },
  fail: { msg: "❌ 결제에 실패했어요.", color: "#ef4444" },
  error: { msg: "⚠️ 결제 승인 중 오류가 발생했어요.", color: "#F9B233" },
  cancel: { msg: "⚠️ 결제가 취소되었어요.", color: "#64748b" },
};

export default function ToastHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const payment = searchParams.get("payment");

  useEffect(() => {
    if (!payment || !TOAST_MSG[payment]) return;

    const { msg, color } = TOAST_MSG[payment];
    const el = document.createElement("div");
    el.innerText = msg;
    Object.assign(el.style, {
      position: "fixed",
      bottom: "32px",
      left: "50%",
      transform: "translateX(-50%)",
      background: color,
      color: "#fff",
      padding: "12px 20px",
      borderRadius: "12px",
      fontSize: "14px",
      fontWeight: "700",
      zIndex: "9999",
      whiteSpace: "nowrap",
      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
      transition: "opacity 0.3s",
    });
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
    router.replace("/main");
  }, [payment]);

  return null;
}
