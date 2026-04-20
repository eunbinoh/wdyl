"use client";

import { useRef, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { nanoid } from "nanoid";
import { ChevronLeft, ChevronRight, CircleHelp } from "lucide-react";
import styles from "./allComponents.module.css";
import { TOOLTIPS, THEMES } from "@/lib/constants";
import { THEME_STYLE, THEME_EMOJI } from "@/app/(web)/survey/[ticketId]/_styles";
import { TicketPreview } from "./TicketPreview";

type ThemeId = "MOOD" | "LUCK" | "PERSONA" | "FAVORITE" | "SURVIVAL";

const THEME_LIST = Object.values(THEMES).map((t) => ({
  value: t.id as ThemeId,
  label: t.name,
  emoji: THEME_EMOJI[t.id],
}));

type Props = {
  userId: string;
  credits: number;
  onClose: () => void;
  onSuccess: () => void;
};

export default function CreateTicketModal({ userId, credits, onClose, onSuccess }: Props) {
  const [theme, setTheme] = useState<ThemeId>("MOOD");
  const [toName, setToName] = useState("");
  const [traits, setTraits] = useState(["", "", ""]);
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const ts = THEME_STYLE[theme];
  const displayName = toName.trim() || "OO";
  const filledTraits = traits.map((t, i) => t.trim() || `특징${i + 1}`);

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
    if (!toName?.trim()) return alert("받는분 이름을 입력해주세요.");
    if (traits?.some((t) => !t?.trim())) return alert("특징 3가지를 모두 입력해주세요.");
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
                  placeholder={["ex) 명사", "ex) 형용사", "ex) 떠오르는 이미지"][i]}
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
            {THEME_LIST.map((t) => (
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
              <TicketPreview
                theme={theme}
                displayName={displayName}
                filledTraits={filledTraits}
                page={previewPage}
              />
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
