"use client";

import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./allComponents.module.css";
import { TicketPreview } from "./TicketPreview";
import { THEME_STYLE } from "@/app/(web)/survey/[ticketId]/_styles";

type ThemeId = "MOOD" | "LUCK" | "PERSONA" | "FAVORITE" | "SURVIVAL";

const PAGE_LABELS = ["# START", "# STEP 1", "# STEP 2", "# STEP 3", "# RESULT"];
const TOTAL_PAGES = PAGE_LABELS.length;
const SWIPE_THRESHOLD_RATIO = 0.2;

type Props = {
  theme: ThemeId;
  displayName: string;
  filledTraits: string[];
  page: number;
  onPageChange: (p: number) => void;
};

export function TicketPreviewSwipeable({ theme, displayName, filledTraits, page, onPageChange }: Props) {
  const ts = THEME_STYLE[theme];
  const boxRef = useRef<HTMLDivElement>(null);
  const startX = useRef<number | null>(null);
  const [dragPercent, setDragPercent] = useState(0);
  const [dragging, setDragging] = useState(false);

  const onStart = (x: number) => {
    startX.current = x;
    setDragging(true);
    setDragPercent(0);
  };
  const onMove = (x: number) => {
    if (startX.current == null) return;
    const width = boxRef.current?.offsetWidth ?? 0;
    if (width === 0) return;
    const dx = x - startX.current;
    const atStart = page === 0 && dx > 0;
    const atEnd = page === TOTAL_PAGES - 1 && dx < 0;
    const adjusted = atStart || atEnd ? dx * 0.3 : dx;
    setDragPercent((adjusted / width) * 100);
  };
  const onEnd = () => {
    if (startX.current == null) return;
    const thresholdPercent = SWIPE_THRESHOLD_RATIO * 100;
    let next = page;
    if (dragPercent < -thresholdPercent && page < TOTAL_PAGES - 1) next = page + 1;
    else if (dragPercent > thresholdPercent && page > 0) next = page - 1;
    startX.current = null;
    setDragging(false);
    setDragPercent(0);
    if (next !== page) onPageChange(next);
  };

  const stopBubble = (e: React.SyntheticEvent) => {
    e.stopPropagation();
  };

  const offsetPercent = -page * 100 + dragPercent;

  return (
    <>
      <div className={styles["modal-preview-label"]}>
        <div className={styles["modal-section-label"]}>PREVIEW</div>
        <div>컨셉별로 옆으로 넘겨서 확인해보세요.</div>
      </div>

      <div className={styles["modal-preview-label-nav"]}>
        <button
          type="button"
          className={styles["modal-preview-label-nav-btn"]}
          onClick={() => onPageChange(page - 1)}
          disabled={page === 0}
          aria-label="이전 화면"
        >
          <ChevronLeft size={16} />
        </button>
        <span
          style={{ fontSize: 14, color: ts.accent === "#FFFFFF" ? "#000" : ts.accent, marginRight: 4 }}
        >{`${page + 1}`}</span>
        <span style={{ fontSize: 14, color: "gray", marginRight: 4 }}>{`/ ${TOTAL_PAGES}`}</span>
        <button
          type="button"
          className={styles["modal-preview-label-nav-btn"]}
          onClick={() => onPageChange(page + 1)}
          disabled={page === TOTAL_PAGES - 1}
          aria-label="다음 화면"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <div
        ref={boxRef}
        className={styles["modal-preview-box"]}
        style={{ touchAction: "pan-y", userSelect: "none", cursor: dragging ? "grabbing" : "grab" }}
        onTouchStart={(e) => {
          stopBubble(e);
          onStart(e.touches[0].clientX);
        }}
        onTouchMove={(e) => {
          stopBubble(e);
          onMove(e.touches[0].clientX);
        }}
        onTouchEnd={(e) => {
          stopBubble(e);
          onEnd();
        }}
        onTouchCancel={onEnd}
        onPointerDown={stopBubble}
        onMouseDown={(e) => {
          stopBubble(e);
          onStart(e.clientX);
        }}
        onMouseMove={(e) => dragging && onMove(e.clientX)}
        onMouseUp={onEnd}
        onMouseLeave={() => dragging && onEnd()}
      >
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            transform: `translateX(${offsetPercent}%)`,
            transition: dragging ? "none" : "transform 0.3s ease-out",
          }}
        >
          {Array.from({ length: TOTAL_PAGES }).map((_, i) => (
            <div
              key={i}
              style={{
                flex: "0 0 100%",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                boxSizing: "border-box",
              }}
            >
              <TicketPreview
                theme={theme}
                displayName={displayName}
                filledTraits={filledTraits}
                page={i}
              />
            </div>
          ))}
        </div>

        {page > 0 && (
          <div
            className={`${styles["modal-preview-arrow"]} ${styles["modal-preview-arrow-left"]}`}
            style={{ left: 10, pointerEvents: "none" }}
            aria-hidden
          >
            <ChevronLeft size={20} />
          </div>
        )}
        {page < TOTAL_PAGES - 1 && (
          <div
            className={`${styles["modal-preview-arrow"]} ${styles["modal-preview-arrow-right"]}`}
            style={{ right: 10, pointerEvents: "none" }}
            aria-hidden
          >
            <ChevronRight size={20} />
          </div>
        )}
      </div>
    </>
  );
}
