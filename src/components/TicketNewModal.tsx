"use client";

import { useRef, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { nanoid } from "nanoid";
import { ChevronLeft, ChevronRight, CircleHelp } from "lucide-react";
import styles from "./allComponents.module.css";
import { TOOLTIPS, TRAIT_SUFFIX } from "@/lib/constants";
import { Theme } from "@/types";

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

type Props = {
  userId: string;
  credits: number;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateTicketModal({ userId, credits, onClose, onSuccess }: Props) {
  const [theme, setTheme] = useState<Theme>("formal");
  const [toName, setToName] = useState("");
  const [traits, setTraits] = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const setTrait = (i: number, v: string) => setTraits((prev) => prev.map((t, idx) => (idx === i ? v : t)));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) setTooltip(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!tooltip) return;
    const handleClickOutside = () => setTooltip(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [tooltip]);

  const handleSubmit = async () => {
    if (!toName.trim()) return alert("받는분 이름을 입력해주세요.");
    if (traits.some((t) => !t.trim())) return alert("특징 3가지를 모두 입력해주세요.");
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

      onSuccess();
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
        <CircleHelp
          size={18}
          color="#1C1C1C"
        />
      </span>
      {tooltip === key && <div className={styles["modal-tooltip-box"]}>{TOOLTIPS[key]}</div>}
    </div>
  );

  const ts = THEME_STYLE[theme];
  const suffix = TRAIT_SUFFIX[theme];
  const displayName = toName.trim() || "OO";
  const filledTraits = traits.map((t, i) => t.trim() || `특징${i + 1}`);

  const previewScreens = [
    <div
      key="intro"
      style={{
        width: "100%",
        height: "100%",
        background: ts.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 28,
        fontFamily: ts.font,
      }}
    >
      <div
        style={{
          fontSize: 12,
          color: ts.subText,
          letterSpacing: 3,
          marginBottom: 20,
        }}
      >
        WDYL
      </div>
      <div
        style={{
          fontSize: 20,
          fontWeight: 800,
          color: ts.text,
          textAlign: "center",
          lineHeight: 1.5,
          marginBottom: 10,
        }}
      >
        <span style={{ color: ts.accent }}>{displayName}</span>님의 취향 분석
      </div>
      <div
        style={{
          fontSize: 13,
          color: ts.subText,
          textAlign: "center",
          lineHeight: 1.7,
          marginBottom: 28,
        }}
      >
        {theme === "formal" && "간단한 선택으로\n취향을 알려주세요."}
        {theme === "friend" && "너의 호불호를 알려줘 🤝🏻"}
        {theme === "sweet" && "두근두근 취향 테스트 💕"}
      </div>
      <div
        style={{
          background: ts.accent,
          color: theme === "formal" ? "#000" : "#fff",
          borderRadius: 12,
          padding: "12px 28px",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        START
      </div>
    </div>,

    <div
      key="survey"
      style={{
        width: "100%",
        height: "100%",
        background: ts.bg,
        display: "flex",
        flexDirection: "column",
        padding: 24,
        fontFamily: ts.font,
      }}
    >
      <div style={{ fontSize: 11, color: ts.subText, marginBottom: 8 }}>1 / 3</div>
      <div
        style={{
          width: "100%",
          height: 4,
          background: ts.cardBg,
          borderRadius: 2,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            width: "33%",
            height: "100%",
            background: ts.accent,
            borderRadius: 2,
          }}
        />
      </div>
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          color: ts.text,
          marginBottom: 16,
          lineHeight: 1.5,
        }}
      >
        요즘 가장 받고싶은 선물은?
      </div>
      {["☕ 카페 기프티콘", "🍽️ 맛있는 음식", "📚 데스크 아이템"].map((item, i) => (
        <div
          key={i}
          style={{
            background: i === 0 ? ts.accent : ts.cardBg,
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 8,
            fontSize: 13,
            fontWeight: 600,
            color: i === 0 ? (theme === "formal" ? "#000" : "#fff") : ts.text,
          }}
        >
          {item}
        </div>
      ))}
    </div>,

    <div
      key="result"
      style={{
        width: "100%",
        height: "100%",
        background: ts.bg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: ts.font,
      }}
    >
      <div style={{ fontSize: 28, marginBottom: 12 }}>
        {theme === "formal" ? "🎩" : theme === "friend" ? "🤝🏻" : "💕"}
      </div>
      <div
        style={{
          background: ts.cardBg,
          borderRadius: 16,
          padding: "20px 16px",
          width: "100%",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 13, color: ts.subText, lineHeight: 2.0 }}>
          <span style={{ color: ts.accent, fontWeight: 700 }}>
            {filledTraits[0]}
            {suffix[0]}
          </span>
          , <br />
          <span style={{ color: ts.accent, fontWeight: 700 }}>
            {filledTraits[1]}
            {suffix[1]}
          </span>
          ,<br />
          <span style={{ color: ts.accent, fontWeight: 700 }}>
            {filledTraits[2]}
            {suffix[2]}
          </span>{" "}
          당신에게
          <br />
          선물을 전하고 싶어하는
          <br />한 사람이 있어요!
        </div>
      </div>
    </div>,
  ];

  return (
    <div
      className={styles["modal-overlay"]}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={tooltipRef}
        className={styles["modal-sheet"]}
      >
        <div className={styles["modal-handle"]} />
        <div className={styles["modal-title"]}>새 티켓 만들기</div>

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
              <div
                key={i}
                className={styles["modal-trait-item"]}
              >
                <span className={styles["modal-trait-num"]}>{String(i + 1).padStart(2, "0")}</span>
                <input
                  className={styles["modal-input"]}
                  style={{ fontSize: 15, fontWeight: 400 }}
                  placeholder={["ex) 솔직하고", "ex) 센스있는", "ex) 집순이"][i]}
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

        {/* 미리보기 */}
        {showPreview && (
          <div style={{ marginBottom: 20 }}>
            <div className={styles["modal-preview-label"]}>
              PREVIEW{" "}
              <span style={{ fontSize: 14, color: "#1C1C1C", marginLeft: 2 }}>
                {["# START", "# SURVEY", "# FINAL"][previewPage]}
              </span>
            </div>
            <div className={styles["modal-preview-box"]}>
              {previewScreens[previewPage]}
              {previewPage > 0 && (
                <button
                  className={styles["modal-preview-arrow"]}
                  style={{ left: 10 }}
                  onClick={() => setPreviewPage((p) => p - 1)}
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              {previewPage < 2 && (
                <button
                  className={styles["modal-preview-arrow"]}
                  style={{ right: 10 }}
                  onClick={() => setPreviewPage((p) => p + 1)}
                >
                  <ChevronRight size={20} />
                </button>
              )}
              <div className={styles["modal-preview-dots"]}>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    onClick={() => setPreviewPage(i)}
                    style={{
                      width: i === previewPage ? 16 : 6,
                      height: 6,
                      borderRadius: 3,
                      background: i === previewPage ? ts.accent : "rgba(255,255,255,0.5)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

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
              티켓 미리보기
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
        </div>
      </div>
    </div>
  );
}
