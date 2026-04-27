"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import styles from "./allComponents.module.css";
import SwipeableSheet from "./SwipeableSheet";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import CreditNotice from "./CreditNotice";

type Payment = {
  pay_id: string;
  user_id: string;
  amount: number;
  credit: number;
  paid_at: string;
};

type Props = {
  userId: string;
  onClose: () => void;
};

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function formatPaidAt(dateStr: string) {
  const d = new Date(dateStr);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yy}-${mm}-${dd} ${hh}:${min}`;
}

function getDaysLeft(paidAt: string): number {
  const elapsed = Date.now() - new Date(paidAt).getTime();
  const left = 7 - Math.floor(elapsed / (24 * 60 * 60 * 1000));
  return Math.max(0, left);
}

function isExpired(paidAt: string): boolean {
  return getDaysLeft(paidAt) === 0;
}

export default function ReturnCreditModal({ userId, onClose }: Props) {
  useLockBodyScroll();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  const selectedPayments = payments.filter((p) => selectedIds.has(p.pay_id));
  const totalAmount = selectedPayments.reduce((sum, p) => sum + p.amount, 0);

  useEffect(() => {
    const fetchPayments = async () => {
      const { data, error } = await supabase!
        .from("Payment")
        .select("pay_id, user_id, amount, credit, paid_at")
        .eq("user_id", userId)
        .order("paid_at", { ascending: false });

      if (error) {
        console.error("[ReturnCreditModal] fetch error:", error);
      }
      setPayments(data ?? []);
      setLoading(false);
    };

    fetchPayments();
  }, [userId]);

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

  const handleRefundRequest = () => {
    if (selectedPayments.length === 0) return;

    const itemLines = selectedPayments
      .map(
        (p, i) =>
          `${i + 1}. 결제 ID: ${p.pay_id} / ${p.amount.toLocaleString()}원 / ${p.credit}크레딧 / ${formatPaidAt(p.paid_at)}`
      )
      .join("%0A");

    const body = [
      `사용자 ID: ${userId}`,
      `환불 요청 건수: ${selectedPayments.length}건`,
      `환불 요청 총액: ${totalAmount.toLocaleString()}원`,
      ``,
      `[환불 요청 내역]`,
      itemLines,
      ``,
      `환불 사유: `,
    ].join("%0A");

    window.location.href = `mailto:jeyunnie@gmail.com?subject=[WDYL] 크레딧 환불 요청&body=${body}`;
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
              const daysLeft = getDaysLeft(p.paid_at);
              const isSelected = selectedIds.has(p.pay_id);
              return (
                <div
                  key={p.pay_id}
                  onClick={() => handleToggle(p.pay_id, expired)}
                  className={`${styles["pay-item"]} ${isSelected ? styles["selected"] : ""} ${expired ? styles["expired"] : ""}`}
                >
                  <div className={styles["pay-item-left"]}>
                    <div className={styles["pay-checkbox"]}>
                      <span className={styles["pay-checkbox-mark"]}>✓</span>
                    </div>
                    <div>
                      <div className={styles["pay-item-label"]}>{p.amount.toLocaleString()}원</div>
                      <div className={styles["pay-item-date"]}>
                        {formatPaidAt(p.paid_at)}
                        {expired ? (
                          <span className={`${styles["pay-item-badge"]} ${styles["expired"]}`}>환불 기간 만료</span>
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
