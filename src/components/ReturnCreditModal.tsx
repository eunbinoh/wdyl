"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./allComponents.module.css";
import SwipeableSheet from "./SwipeableSheet";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import CreditNotice from "./CreditNotice";
import { showToast } from "./ToastAlert";

type Payment = {
  pay_id: string;
  user_id: string;
  amount: number;
  credit: number;
  paid_at: string;
  status?: string;
};

type Props = {
  userId: string;
  credits: number;
  onClose: () => void;
};

const formatPaidAt = (dateStr: string): string => {
  const d = new Date(dateStr);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yy}-${mm}-${dd} ${hh}:${min}`;
};

const getDaysLeft = (paidAt: string): number => {
  const elapsed = Date.now() - new Date(paidAt).getTime();
  const left = 7 - Math.floor(elapsed / (24 * 60 * 60 * 1000));
  return Math.max(0, left);
};

const isExpired = (paidAt: string): boolean => {
  return getDaysLeft(paidAt) === 0;
};

const isRefundStatus = (status?: string): boolean => {
  return status ? status === "refund_req" || status === "refund_done" : false;
};

export default function ReturnCreditModal({ userId, credits, onClose }: Props) {
  useLockBodyScroll();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const selectedPayments = payments.filter((p) => selectedIds.has(p.pay_id));
  const totalAmount = selectedPayments.reduce((sum, p) => sum + p.amount, 0);
  const totalCredits = selectedPayments.reduce((sum, p) => sum + p.credit, 0);

  const fetchPayments = useCallback(async () => {
    const { data, error } = await supabase!
      .from("Payment")
      .select("pay_id, user_id, amount, credit, paid_at, status")
      .eq("user_id", userId)
      .not("pay_id", "is", null)
      .order("paid_at", { ascending: false });

    if (error) {
      console.error("[ReturnCreditModal] fetch error:", error);
    }
    setPayments(data ?? []);
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleToggle = (payId: string, expired: boolean) => {
    if (expired) return; // 7일 경과건은 선택 불가

    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(payId)) {
        next.delete(payId);
      } else {
        next.add(payId);
      }
      return next;
    });
  };

  const handleRefundRequest = async () => {
    if (selectedPayments.length === 0) return;

    if (totalCredits > credits) {
      alert(
        `보유 크레딧(${credits})보다 환불 요청 크레딧(${totalCredits})이 많아요. 사용한 크레딧은 환불할 수 없어요.`
      );
      return;
    }

    const payIds = selectedPayments.map((p) => p.pay_id);
    const res = await fetch("/api/payments/refund-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, payIds }),
    });

    const result = await res.json().catch(() => null);

    if (!res.ok) {
      console.error("[ReturnCreditModal] refund-request error:", result);
      alert("환불 요청 처리 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
      return;
    }

    setSelectedIds(new Set());
    await fetchPayments();
    showToast("환불요청이 접수되었어요.");
  };

  return (
    <div
      className={styles["modal-overlay"]}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <SwipeableSheet
        onClose={onClose}
        title="크레딧 환불 요청"
      >
        {loading ? (
          <div className={styles["pay-empty"]}>결제 내역을 불러오는 중...</div>
        ) : payments.length === 0 ? (
          <div className={styles["pay-empty"]}>결제 내역이 없어요.</div>
        ) : (
          <div className={styles["pay-list"]}>
            {payments.map((p) => {
              const expired = isExpired(p.paid_at);
              const isRefunded = isRefundStatus(p.status);
              const daysLeft = getDaysLeft(p.paid_at);
              const isSelected = selectedIds.has(p.pay_id);
              return (
                <div
                  key={p.pay_id}
                  onClick={() => handleToggle(p.pay_id, expired || isRefunded)}
                  className={`${styles["pay-item"]} ${isSelected ? styles["selected"] : ""} ${expired ? styles["expired"] : ""} ${isRefunded ? styles["expired"] : ""}`}
                >
                  <div className={styles["pay-item-left"]}>
                    <div className={styles["pay-checkbox"]}>
                      <span className={styles["pay-checkbox-mark"]}>✓</span>
                    </div>
                    <div>
                      <div className={styles["pay-item-label"]}>{p.amount.toLocaleString()}원</div>
                      <div className={styles["pay-item-date"]}>
                        {formatPaidAt(p.paid_at)}
                        {isRefunded || expired ? (
                          <span className={`${styles["pay-item-badge"]} ${styles["expired"]}`}>
                            {p.status === "refund_req"
                              ? "환불 접수"
                              : p.status === "refund_done"
                                ? "환불 완료"
                                : "환불 기간 만료"}
                          </span>
                        ) : (
                          <span className={`${styles["pay-item-badge"]} ${styles["active"]}`}>D-{daysLeft}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={styles["pay-item-right"]}>
                    <div className={styles["pay-item-credit"]}>{p.credit}크레딧</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <CreditNotice />

        <button
          onClick={handleRefundRequest}
          disabled={selectedPayments.length === 0}
          className={`${styles["pay-submit-btn"]} ${selectedPayments.length > 0 ? styles["active"] : ""}`}
        >
          {selectedPayments.length > 0
            ? `${totalAmount.toLocaleString()}원 환불 요청하기 (${selectedPayments.length}건)`
            : "환불 요청하기"}
        </button>
      </SwipeableSheet>
    </div>
  );
}
