"use client";

import { useState } from "react";
import { Copy, Check, X } from "lucide-react";
import styles from "./allComponents.module.css";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

type Props = {
  onClose: () => void;
};

export default function KakaoShareModal({ onClose }: Props) {
  useLockBodyScroll();
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://wdyl.vercel.app`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = shareUrl;
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

        <h3 className={styles["resend-title"]}>너멀조몰 공유하기</h3>
        <p className={styles["resend-desc"]}>
          로그인 없이 URL공유시 무료 크레딧은 지급되지 않아요. <br />
          로그인하시면 카카오 친구목록으로 직접 공유하실 수 있어요.{" "}
        </p>

        <div className={styles["resend-link-box"]}>
          <span className={styles["resend-link-text"]}>{shareUrl}</span>
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
