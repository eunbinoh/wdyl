import React, { useState } from "react";
import { THEME_CATEGORY_MSG } from "@/lib/constants";
import { Category, Ticket } from "@/types";
import { ThemeStyle } from "../_styles";
import Image from "next/image";
import { CATEGORY_NAMES } from "@/lib/constants";

type Props = {
  ticket: Ticket;
  ts: ThemeStyle;
  pageStyle: React.CSSProperties;
  accentBtnStyle: React.CSSProperties;
  categories: Category[];
  selectedCategory: string | null;
  onSelect: (code: string) => void;
  onNext: () => void;
};

export function Step1Phase({
  ticket,
  ts,
  pageStyle,
  accentBtnStyle,
  categories,
  selectedCategory,
  onSelect,
  onNext,
}: Props) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const categoryMsg = THEME_CATEGORY_MSG[ticket.theme];

  return (
    <div style={{ ...pageStyle, justifyContent: "flex-start", paddingTop: 48 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ fontSize: 13, color: ts.subText, marginBottom: 6, fontWeight: 800 }}>STEP 1</div>
        <div style={{ fontSize: 14, color: ts.subText, marginTop: 4, marginBottom: 6, fontWeight: 800 }}>
          {categoryMsg?.sub}
        </div>
        <div
          style={{ fontSize: 16, fontWeight: 700, color: ts.text, marginTop: 8, marginBottom: 30, textAlign: "center" }}
        >
          {categoryMsg?.question}
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 40, width: "100%" }}>
          {categories.map((cat, idx) => {
            const isSelected = selectedCategory === cat.category_code;
            const isHovered = hoveredCategory === cat.category_code;
            // 같은 줄 짝꿍이 선택됐는지 확인
            const pairIdx = idx % 2 === 0 ? idx + 1 : idx - 1;
            const pairSelected = selectedCategory === categories[pairIdx]?.category_code;

            const width = isSelected ? "calc(60% - 4px)" : pairSelected ? "calc(40% - 4px)" : "calc(50% - 4px)";

            return (
              <div
                key={cat.category_code}
                onClick={() => onSelect(cat.category_code)}
                onMouseEnter={() => setHoveredCategory(cat.category_code)}
                onMouseLeave={() => setHoveredCategory(null)}
                style={{
                  width,
                  height: 90,
                  borderRadius: 12,
                  overflow: "hidden",
                  position: "relative",
                  cursor: "pointer",
                  transition: "width 0.25s ease, box-shadow 0.2s",
                  border: isSelected ? "none" : `1.5px solid ${isHovered ? `${ts.accent}70` : `${ts.accent}30`}`,
                  boxShadow: isSelected
                    ? `0 4px 12px ${ts.accent}40`
                    : isHovered
                      ? `0 3px 10px ${ts.accent}35`
                      : "none",
                  boxSizing: "border-box" as const,
                }}
              >
                {/* 배경 이미지 */}
                <Image
                  src={`/category/${cat.category_code}.png`}
                  alt={cat.category_code}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center" }}
                />
                {/* 오버레이 */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: isSelected ? `${ts.accent}70` : "rgba(0,0,0,0.25)",
                    transition: "background 0.2s",
                  }}
                />
                {/* 텍스트 */}
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                    padding: "0 4px 8px",
                  }}
                >
                  <span
                    style={{
                      fontSize: isSelected ? 14 : 13,
                      fontWeight: isSelected ? 900 : 700,
                      textShadow: isSelected ? "none" : "0 1px 4px rgba(0,0,0,0.6)",
                      color: "#fff",
                      textAlign: "center",
                      lineHeight: 1.3,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" as const,
                    }}
                  >
                    {CATEGORY_NAMES[ticket.theme]?.[cat.category_code] ?? cat.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <button
          style={{
            ...accentBtnStyle,
            opacity: selectedCategory ? 1 : 0.4,
            cursor: selectedCategory ? "pointer" : "not-allowed",
          }}
          onClick={onNext}
          disabled={!selectedCategory}
        >
          다음
        </button>
      </div>
    </div>
  );
}
