"use client";

import { useState } from "react";
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { nanoid } from "nanoid";
import styles from "./allComponents.module.css";
import { ChevronDown } from "lucide-react";

const CREDIT_PLANS = [
  { id: "plan_1", label: "1 크레딧", credits: 1, price: 990 },
  { id: "plan_5", label: "5 크레딧", credits: 5, price: 3500 },
  { id: "plan_10", label: "10 크레딧", credits: 10, price: 5000 },
];

type Props = {
  userId: string;
  isRefund: boolean;
  onClose: () => void;
};

export default function CreditChargeModal({ userId, isRefund, onClose }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedPlan = CREDIT_PLANS.find((p) => p.id === selected);

  const handlePayment = async () => {
    if (!selectedPlan) return;
    setLoading(true);

    try {
      const tossPayments = await loadTossPayments(process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY!);
      const orderId = nanoid(20);
      const payment = tossPayments.payment({ customerKey: "ANONYMOUS" });

      await payment.requestPayment({
        method: "CARD",
        amount: {
          currency: "KRW",
          value: selectedPlan.price,
        },
        orderId,
        orderName: `WDYL ${selectedPlan.label} 충전`,
        successUrl: `${window.location.origin}/api/payments/success?credits=${selectedPlan.credits}&userId=${userId}`,
        failUrl: `${window.location.origin}/main`,
      });
    } catch (e) {
      console.error(e);
      if ((e as any)?.code === "USER_CANCEL") {
        setLoading(false);
        return;
      }
      alert("결제 중 오류가 발생했어요.");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRefundRequest = () => {
    const creditText = selectedPlan ? `${selectedPlan.credits}크레딧 (${selectedPlan.price.toLocaleString()}원)` : "";
    window.location.href = `mailto:jeyunnie@gmail.com?subject=[WDYL] 크레딧 환불 요청&body=사용자 ID: ${userId}%0A환불 요청 크레딧: ${creditText}%0A구매일자 7일이내 확인여부:%0A환불 사유:`;
  };
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div
      className={styles["modal-overlay"]}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles["modal-sheet"]}>
        <div className={styles["modal-handle"]} />
        <div className={styles["modal-title"]}>크레딧 충전</div>

        {/* 상품 목록 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {CREDIT_PLANS.map((plan, i) => {
            const isSelected = selected === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelected(plan.id)}
                style={{
                  background: isSelected ? "#EFF6FF" : "#fff",
                  border: `1.5px solid ${isSelected ? "#0062CC" : "#EDE9E1"}`,
                  borderRadius: 14,
                  padding: "18px 20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
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
        <div
          style={{
            background: "#F8FAFC",
            borderRadius: 10,
            padding: "14px 16px",
            marginBottom: 24,
            fontSize: 12,
            lineHeight: 1.8,
          }}
        >
          <div style={{ color: "#475569", marginBottom: 6 }}>
            💡 미사용 크레딧은 구매 후 7일 이내 환불 가능해요.
            <br />
            ⚠️ 1회 이상 사용된 크레딧은 부분환불이 불가능해요.
          </div>
          <div
            onClick={() => setShowExamples((prev) => !prev)}
            style={{ color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}
          >
            <ChevronDown
              size={14}
              style={{ transform: showExamples ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
            />
            ( 구매 즉시 서버·서비스 운영 비용이 발생하기 때문이에요 )
          </div>
          {showExamples && (
            <div style={{ color: "#94A3B8", marginTop: 4, marginLeft: 16 }}>
              · 1크레딧 구매 후 7일이내 미사용 → 전액환불 가능
              <br />
              · 5크레딧 구매 후 7일이내 2회 사용 → 부분환불 불가
              <br />· 10크레딧 구매 후 7일이내 미사용 → 전액환불 가능
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {!isRefund && (
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
                cursor: selected ? "pointer" : "not-allowed",
                transition: "all 0.15s",
              }}
            >
              {loading ? "결제 중..." : selectedPlan ? `${selectedPlan.price.toLocaleString()}원 결제하기` : "결제하기"}
            </button>
          )}

          {isRefund && (
            <button
              onClick={handleRefundRequest}
              style={{
                width: "100%",
                background: selected ? "#000" : "#fff",
                color: selected ? "#fff" : "#94A3B8",
                border: "1.5px solid #EDE9E1",
                borderRadius: 14,
                padding: "13px 0",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              환불 요청하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
