"use client";

import { useRef, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { nanoid } from "nanoid";
import { ChevronLeft, ChevronRight, CircleHelp } from "lucide-react";
import styles from "./allComponents.module.css";

type Theme = "formal" | "friend" | "sweet";

const THEMES: { value: Theme; label: string; emoji: string }[] = [
  { value: "formal", label: "정중", emoji: "🎩" },
  { value: "friend", label: "친근", emoji: "🤝🏻" },
  { value: "sweet", label: "스윗", emoji: "💕" },
];

const THEME_STYLE: Record<
  Theme,
  {
    bg: string;
    accent: string;
    text: string;
    subText: string;
    cardBg: string;
    font: string;
  }
> = {
  formal: {
    bg: "#1C1C1C",
    accent: "#FFFFFF",
    text: "#FFFFFF",
    subText: "#888",
    cardBg: "#2A2A2A",
    font: "Georgia, serif",
  },
  friend: {
    bg: "#EDE9F8",
    accent: "#7C5CBF",
    text: "#2D1F5E",
    subText: "#9B8EC4",
    cardBg: "#FFFFFF",
    font: "inherit",
  },
  sweet: {
    bg: "#FFF0F5",
    accent: "#E8639A",
    text: "#8B2252",
    subText: "#D4879E",
    cardBg: "#FFFFFF",
    font: "inherit",
  },
};

const TRAIT_SUFFIX: Record<Theme, string[]> = {
  formal: ["으시며", "시고", "신"],
  friend: ["하고", "하며", "한"],
  sweet: ["하고", "하며", "한"],
};

const TOOLTIPS: Record<string, string> = {
  CONCEPT: "컨셉 : 받는분에게 보여질 링크 말투와 분위기에요.",
  TO: "받는분 이름/애칭: 링크 첫 화면 타이틀에 사용돼요.",
  WHO: "받는분 특징 3가지: 설문 결과 화면에 적용돼요.",
};

type Props = {
  userId: string;
  credits: number;
  onClose: () => void;
  onFetched: () => void;
};

export default function ModalCreateTicket({
  userId,
  credits,
  onClose,
  onFetched,
}: Props) {
  const [theme, setTheme] = useState<Theme>("formal");
  const [toName, setToName] = useState("");
  const [traits, setTraits] = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const setTrait = (i: number, v: string) =>
    setTraits((prev) => prev.map((t, idx) => (idx === i ? v : t)));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node))
        setTooltip(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSubmit = async () => {
    if (!toName.trim()) return alert("받는분 이름을 입력해주세요.");
    if (traits.some((t) => !t.trim()))
      return alert("특징 3가지를 모두 입력해주세요.");
    if (credits < 1) return alert("크레딧이 부족해요. 충전 후 이용해주세요.");
    setLoading(true);
    try {
      const ticketId = nanoid(8);
      const { error: ticketError } = await supabase!.from("Ticket").insert({
        ticket_id: ticketId,
        user_id: userId,
        theme,
        receiver_name: toName.trim(),
        comment: traits.map((t) => t.trim()).join(" / "),
        status: "init",
      });
      if (ticketError) throw ticketError;

      const { error: creditError } = await supabase!
        .from("User")
        .update({ credits: credits - 1 })
        .eq("id", userId);
      if (creditError) throw creditError;

      onFetched();
    } catch (e) {
      console.error(e);
      alert("티켓 생성 중 오류가 발생했어요.");
    } finally {
      setLoading(false);
    }
  };

  const sectionLabel = (key: string) => (
    <div className={styles["modal-section-label"]}>
      <span className={styles["modal-section-label-text"]}>{key}</span>
      <span
        onClick={(e) => {
          e.stopPropagation();
          setTooltip((prev) => (prev === key ? null : key));
        }}
        style={{ cursor: "pointer" }}
      >
        <CircleHelp size={18} color="#1C1C1C" />
      </span>
      {tooltip === key && (
        <div className={styles["modal-tooltip-box"]}>{TOOLTIPS[key]}</div>
      )}
    </div>
  );

  const ts = THEME_STYLE[theme];

  return (
    <div
      className={styles["modal-overlay"]}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div ref={tooltipRef} className={styles["modal-sheet"]}>
        <div className={styles["modal-handle"]} />
        <div className={styles["modal-title"]}>티켓 상세보기</div>

        {/* TO */}
        <div className={styles["modal-section"]}>
          {sectionLabel("TO")}
          <div className={styles["modal-input-wrap"]}>
            <input
              className={styles["modal-input"]}
              placeholder="이름 또는 닉네임"
              value={toName}
              onChange={(e) => setToName(e.target.value)}
              maxLength={24}
            />
            <span className={styles["modal-input-suffix"]}>에게</span>
          </div>
        </div>

        {/* WHO */}
        <div className={styles["modal-section"]}>
          {sectionLabel("WHO")}
          <div className={styles["modal-trait-list"]}>
            {traits.map((trait, i) => (
              <div key={i} className={styles["modal-trait-item"]}>
                <span className={styles["modal-trait-num"]}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <input
                  className={styles["modal-input"]}
                  style={{ fontSize: 15, fontWeight: 400 }}
                  placeholder={
                    ["ex) 솔직하고", "ex) 센스있는", "ex) 집순이"][i]
                  }
                  value={trait}
                  onChange={(e) => setTrait(i, e.target.value)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* CONCEPT */}
        <div className={styles["modal-section"]}>
          {sectionLabel("CONCEPT")}
          <div className={styles["modal-theme-row"]}>
            {THEMES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={`${styles["modal-theme-btn"]} ${theme === t.value ? styles["modal-theme-btn-active"] : ""}`}
              >
                <div className={styles["modal-theme-emoji"]}>{t.emoji}</div>
                <div
                  className={`${styles["modal-theme-label"]} ${theme === t.value ? styles["modal-theme-label-active"] : ""}`}
                >
                  {t.label}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 버튼 */}
        <div className={styles["modal-btn-group"]}>
          {!showPreview && (
            <button
              className={styles["modal-btn-preview"]}
              onClick={() => {
                setShowPreview(true);
                setPreviewPage(0);
              }}
            >
              티켓 수정하기
            </button>
          )}
          {showPreview && (
            <button
              className={styles["modal-btn-submit"]}
              onClick={handleSubmit}
              disabled={loading}
              style={{
                background: loading ? "#CCC" : "#F9B233",
                color: "#1C1C1C",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <span
                  style={{
                    display: "inline-block",
                    width: 16,
                    height: 16,
                    border: "2px solid #191919",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "loading-spinner 0.9s linear infinite",
                  }}
                />
              ) : (
                "티켓 생성하기"
              )}
            </button>
          )}
          <button className={styles["modal-btn-cancel"]} onClick={onClose}>
            취소하기
          </button>
        </div>
      </div>
    </div>
  );
}
