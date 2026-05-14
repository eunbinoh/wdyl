"use client";

import { useState } from "react";
import { OctagonAlertIcon, ChevronDown } from "lucide-react";
import styles from "./allComponents.module.css";

export default function CreditNotice() {
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div className={styles["pay-notice"]}>
      <div className={`${styles["pay-notice-main"]} break-keep break-words`}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <OctagonAlertIcon
            size={12}
            color="#16a34a"
          />{" "}
          미사용 크레딧은 구매 후 7일 이내만 환불이 가능해요.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <OctagonAlertIcon
            size={12}
            color="#0062cc"
          />{" "}
          티켓에 사용된 결제크레딧은 부분환불이 불가능해요.
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <OctagonAlertIcon
            size={12}
            color="#ef4444"
          />{" "}
          크레딧의 유효기간은 결제일로부터 12개월이며,
        </div>
        <div style={{ marginLeft: 16, marginTop: -5 }}>만료시 잔여 크레딧은 소멸돼요.</div>
      </div>
      <div
        onClick={() => setShowExamples((prev) => !prev)}
        className={styles["pay-notice-toggle"]}
      >
        <ChevronDown
          size={14}
          style={{
            transform: showExamples ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s",
          }}
        />
        티켓 생성시 먼저 충전된 크레딧부터 순차 차감돼요.
      </div>
      {showExamples && (
        <div className={styles["pay-notice-examples"]}>
          · 1크레딧 구매 후 7일이내 미사용 → 전액환불 가능
          <br />
          · 5크레딧 구매 후 7일이내 2회 사용 → 부분환불 불가
          <br />· 10크레딧 구매 후 7일이내 미사용 → 전액환불 가능
        </div>
      )}
    </div>
  );
}
