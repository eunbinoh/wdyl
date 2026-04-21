"use client";

import { useRef, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { CircleHelp, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./allComponents.module.css";
import { TOOLTIPS, THEMES } from "@/lib/constants";
import { Status } from "@/types";
import { THEME_EMOJI, THEME_STYLE } from "@/app/(web)/survey/[ticketId]/_styles";
import { TicketPreview } from "./TicketPreview";

type ThemeId = "MOOD" | "LUCK" | "PERSONA" | "FAVORITE" | "SURVIVAL";

const THEME_LIST = Object.values(THEMES).map((t) => ({
  value: t.id as ThemeId,
  label: t.name,
  emoji: THEME_EMOJI[t.id],
}));

type Props = {
  ticketId: string;
  onClose: () => void;
  onFetched: () => void;
};

export default function DetailTicketModal({ ticketId, onClose, onFetched }: Props) {
  const [toName, setToName] = useState("");
  const [traits, setTraits] = useState(["", "", ""]);
  const [status, setStatus] = useState<Status>("created");
  const [fetchLoading, setFetchLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [tooltip, setTooltip] = useState<string | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [theme, setTheme] = useState<ThemeId>("MOOD");

  const [showPreview, setShowPreview] = useState(false);
  const [previewPage, setPreviewPage] = useState(0);
  const setTrait = (i: number, v: string) => setTraits((prev) => prev.map((t, idx) => (idx === i ? v : t)));

  const isEditable = status === "created" || status === "sent";
  const displayName = toName.trim() || "OO";
  const filledTraits = traits.map((t, i) => t.trim() || `특징${i + 1}`);

  // 티켓 조회
  useEffect(() => {
    const fetchTicket = async () => {
      const { data } = await supabase!
        .from("Ticket")
        .select("receiver_name, comment, theme, status")
        .eq("ticket_id", ticketId)
        .single();

      if (data) {
        setToName(data.receiver_name ?? "");
        setTheme((data.theme as ThemeId) ?? "MOOD");
        setStatus((data.status as Status) ?? "created");
        // comment "텍스트1 / 텍스트2 / 텍스트3" → 배열로 분리
        const parts = (data.comment ?? "").split("/").map((s: string) => s.trim());
        setTraits([parts[0] ?? "", parts[1] ?? "", parts[2] ?? ""]);
      }
      setFetchLoading(false);
    };
    fetchTicket();
  }, [ticketId]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) setTooltip(null);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleModify = async () => {
    if (!toName.trim()) return alert("받는 사람 이름을 입력해주세요.");
    if (traits.some((t) => !t.trim())) return alert("특징 3가지를 모두 입력해주세요.");

    setLoading(true);
    const { error } = await supabase!
      .from("Ticket")
      .update({
        receiver_name: toName.trim(),
        comment: traits.map((t) => t.trim()).join(" / "),
        theme,
      })
      .eq("ticket_id", ticketId);

    setLoading(false);
    if (error) return alert("수정 중 오류가 발생했어요.");
    onFetched();
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

  if (fetchLoading) {
    return (
      <div className={styles["modal-overlay"]}>
        <div className={styles["modal-sheet"]}>
          <div className={styles["modal-handle"]} />
          <div style={{ textAlign: "center", padding: "40px 0", color: "#AAA" }}>불러오는 중...</div>
        </div>
      </div>
    );
  }

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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
          <div
            className={styles["modal-title"]}
            style={{ marginBottom: 0 }}
          >
            티켓 상세보기
          </div>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              padding: "4px 10px",
              borderRadius: 20,
              color: status === "complete" ? "#0062CC" : status === "progress" ? "#16a34a" : "#64748b",
              background: status === "complete" ? "#eff6ff" : status === "progress" ? "#f0fdf4" : "#f1f5f9",
            }}
          >
            {status === "complete" ? "완료" : status === "progress" ? "진행중" : "대기중"}
          </div>
        </div>
        {/* TO */}
        <div className={styles["modal-section"]}>
          {sectionLabel("TO")}
          <div className={styles["modal-input-wrap"]}>
            <input
              className={styles["modal-input"]}
              placeholder="이름 또는 닉네임"
              value={toName}
              onChange={(e) => isEditable && setToName(e.target.value)}
              readOnly={!isEditable}
              maxLength={24}
              style={{ opacity: isEditable ? 1 : 0.6 }}
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
                  style={{ fontSize: 15, fontWeight: 400, opacity: isEditable ? 1 : 0.6 }}
                  placeholder={["한마디로 표현한 명사 (집순이,패피,..)", "매력/장점을 나타내는 형용사 (귀여운,똑똑한,..)", "떠오르는 이미지 (햄찌,짱구,..)"][i]}
                  value={trait}
                  onChange={(e) => isEditable && setTrait(i, e.target.value)}
                  readOnly={!isEditable}
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
                onClick={() => isEditable && setTheme(t.value)}
                className={`${styles["modal-theme-btn"]} ${theme === t.value ? styles["modal-theme-btn-active"] : ""}`}
                style={{
                  cursor: isEditable ? "pointer" : "default",
                  opacity: !isEditable && theme !== t.value ? 0.4 : 1,
                }}
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
        {isEditable && (
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
                      background: i === previewPage ? THEME_STYLE[theme].accent : "rgba(255,255,255,0.5)",
                      cursor: "pointer",
                      transition: "all 0.2s",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
        <div className={styles["modal-btn-group"]}>
          {isEditable && (
            <button
              className={styles["modal-btn-preview"]}
              onClick={handleModify}
            >
              티켓 수정하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
