"use client";

import { useState } from "react";
import { nanoid } from "nanoid";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import styles from "./allComponents.module.css";
import SwipeableSheet from "./SwipeableSheet";
import CreditNotice from "./CreditNotice";

const CREDIT_PLANS = [
  { id: "plan_1", label: "1 크레딧", credits: 1, price: 990 },
  { id: "plan_5", label: "5 크레딧", credits: 5, price: 3500 },
  { id: "plan_10", label: "10 크레딧", credits: 10, price: 5000 },
];

type Props = {
  userId: string;
  onClose: () => void;
};

export default function CreditChargeModal({ userId, onClose }: Props) {
  useLockBodyScroll();
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedPlan = CREDIT_PLANS.find((p) => p.id === selected);

  const handlePayment = async () => {
    if (!selectedPlan || loading) return;
    setLoading(true);

    try {
      const orderNo = nanoid(20);

      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderNo,
          amount: selectedPlan.price,
          productDesc: `WDYL ${selectedPlan.label} 충전`,
          credits: selectedPlan.credits,
          userId,
        }),
      });

      const data = await response.json();
      if (data.code !== 0) {
        console.error("결제 생성 실패 응답:", data);
        throw new Error(data.detail || data.msg || data.message || "결제 생성 실패");
      }

      // 모바일/PC 분기: 토스페이는 retAppScheme 없으면 checkoutPage가 PC용 URL
      const ua = navigator.userAgent;
      const isAndroid = /Android/i.test(ua);
      const isIOS = /iPhone|iPad|iPod/i.test(ua);
      const payToken = data.payToken as string;

      if (isAndroid && payToken) {
        window.location.href = `intent://pay?payToken=${payToken}#Intent;scheme=supertoss;package=viva.republica.toss;end`;
      } else if (isIOS && payToken) {
        window.location.href = `https://ul.toss.im?scheme=${encodeURIComponent(`supertoss://pay?payToken=${payToken}`)}`;
      } else {
        window.location.href = data.checkoutPage;
      }
    } catch (e) {
      console.error(e);
      alert("결제 중 오류가 발생했어요.");
      setLoading(false);
    }
    // 성공 시에는 navigation으로 페이지가 떠나므로 loading 유지
  };

  return (
    <div
      className={styles["modal-overlay"]}
      onClick={(e) => {
        if (loading) return;
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <SwipeableSheet
        onClose={loading ? () => {} : onClose}
        title="크레딧 충전"
      >
        {/* 상품 목록 */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginBottom: 24,
            pointerEvents: loading ? "none" : "auto",
            opacity: loading ? 0.6 : 1,
          }}
        >
          {CREDIT_PLANS.map((plan, i) => {
            const isSelected = selected === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => !loading && setSelected(plan.id)}
                style={{
                  background: isSelected ? "#EFF6FF" : "#fff",
                  border: `1.5px solid ${isSelected ? "#0062CC" : "#EDE9E1"}`,
                  borderRadius: 14,
                  padding: "18px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: loading ? "not-allowed" : "pointer",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      border: `2px solid ${isSelected ? "#0062CC" : "#DDD"}`,
                      background: isSelected ? "#0062CC" : "transparent",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {isSelected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1C1C1C" }}>{plan.label}</div>
                    <div style={{ fontSize: 12, color: "#AAA", marginTop: 2 }}>
                      ( {i === 0 ? "티켓 1장" : i === 1 ? "티켓 5장" : "티켓 10장"} )
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: isSelected ? "#0062CC" : "#1C1C1C" }}>
                    {plan.price.toLocaleString()}원
                  </div>
                  {plan.credits >= 5 && (
                    <div style={{ fontSize: 11, color: "#F9B233", marginTop: 2, fontWeight: 600 }}>
                      {plan.credits === 5 ? "티켓당 700원" : "티켓당 500원"}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* 환불 안내 */}
        <CreditNotice />

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <button
            onClick={handlePayment}
            disabled={!selected || loading}
            style={{
              width: "100%",
              background: selected ? "#0062CC" : "#E2E8F0",
              color: selected ? "#fff" : "#94A3B8",
              border: "none",
              borderRadius: 14,
              padding: "14px 0",
              fontSize: 15,
              fontWeight: 700,
              cursor: loading ? "wait" : selected ? "pointer" : "not-allowed",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {loading ? (
              <>
                <span
                  aria-hidden
                  style={{
                    width: 16,
                    height: 16,
                    border: "2px solid rgba(255,255,255,0.4)",
                    borderTopColor: "#fff",
                    borderRadius: "50%",
                    display: "inline-block",
                    animation: "wdyl-spin 0.7s linear infinite",
                  }}
                />
                결제창 여는 중…
              </>
            ) : selectedPlan ? (
              `${selectedPlan.price.toLocaleString()}원 결제하기`
            ) : (
              "결제하기"
            )}
          </button>
          <style jsx global>{`
            @keyframes wdyl-spin {
              to {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      </SwipeableSheet>
    </div>
  );
}
