"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import styles from "./allComponents.module.css";

export default function CreditNotice() {
  const [showExamples, setShowExamples] = useState(false);

  return (
    <div className={styles["pay-notice"]}>
      <div className={`${styles["pay-notice-main"]} break-keep break-words`}>
        💡 미사용 크레딧은 구매 후 7일 이내 환불 가능해요.
        <br />
        ⚠️ 크레딧의 유효기간은 결제일로부터 12개월이며, 만료시 잔여 크레딧은 소멸됩니다.
        <br />❌ 1회 이상 사용된 크레딧은 부분환불이 불가능해요.
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
        ( 구매 즉시 서버·서비스 운영 비용이 발생하기 때문이에요 )
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
