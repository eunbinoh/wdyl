"use client";

import { useState } from "react";
import { Copy, Check, X } from "lucide-react";
import styles from "./allComponents.module.css";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

type Props = {
  ticketId: string;
  receiverName: string;
  onClose: () => void;
};

export default function TicketSendModal({ ticketId, receiverName, onClose }: Props) {
  useLockBodyScroll();
  const [copied, setCopied] = useState(false);
  const surveyUrl = `https://wdyl.vercel.app/survey/${ticketId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(surveyUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = surveyUrl;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={styles["modal-backdrop"]}
      onClick={onClose}
    >
      <div
        className={styles["modal-content"]}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={styles["modal-close"]}
          onClick={onClose}
        >
          <X size={18} />
        </button>

        <h3 className={styles["resend-title"]}>티켓 재발송</h3>
        <p className={styles["resend-desc"]}>발송에 실패했다면, {receiverName}님에게 아래 링크를 직접 전달해주세요.</p>

        <div className={styles["resend-link-box"]}>
          <span className={styles["resend-link-text"]}>{surveyUrl}</span>
          <button
            className={styles["resend-copy-btn"]}
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <Check size={13} /> COPIED!
              </>
            ) : (
              <>
                <Copy size={14} /> COPY
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
