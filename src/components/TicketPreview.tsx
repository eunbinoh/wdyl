import React from "react";
import {
  CATEGORY_NAMES,
  THEME_CATEGORY_MSG,
  THEME_MAIN_INFO,
  THEME_RESULT_MSG,
  THEME_RESULT_SUB,
  THEME_STEP_MSG,
  THEME_STEP_TITLE,
} from "@/lib/constants";
import { MEDAL, MEDAL_COLOR, MEDAL_LABEL, THEME_STYLE, THEME_ICON } from "@/app/(web)/survey/[ticketId]/_styles";
import { renderParts } from "@/lib/renderParts";

type ThemeId = "MOOD" | "LUCK" | "PERSONA" | "FAVORITE" | "SURVIVAL";

type Props = {
  theme: ThemeId;
  displayName: string;
  filledTraits: string[];
  page: number;
};

export function TicketPreview({ theme, displayName, filledTraits, page }: Props) {
  const ts = THEME_STYLE[theme];
  const { icon: Icon, color } = THEME_ICON[theme] ?? THEME_ICON.MOOD;
  const screens = [
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
      <div style={{ fontSize: 12, fontWeight: 700, color: ts.subText, letterSpacing: 3, marginBottom: 20 }}>WDYL</div>
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
          marginBottom: 16,
          whiteSpace: "pre-line",
        }}
      >
        {THEME_MAIN_INFO[theme]?.title}
      </div>
      {THEME_MAIN_INFO[theme]?.keywords && (
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 20 }}>
          {THEME_MAIN_INFO[theme].keywords.map((kw) => (
            <span
              key={kw}
              style={{
                fontSize: 11,
                color: ts.accent,
                background: `${ts.accent}18`,
                padding: "3px 8px",
                borderRadius: 20,
                fontWeight: 600,
              }}
            >
              {kw}
            </span>
          ))}
        </div>
      )}
      <div
        style={{
          background: ts.accent,
          color: ts.btnText,
          borderRadius: 12,
          padding: "12px 28px",
          fontSize: 14,
          fontWeight: 700,
        }}
      >
        START
      </div>
    </div>,

    // SURVEY 1 - CATEGORY
    <div
      key="survey1-category"
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
      <div
        style={{
          width: "100%",
          height: 4,
          background: `${ts.accent}20`,
          borderRadius: 2,
          marginBottom: 16,
          flexShrink: 0,
        }}
      >
        <div style={{ width: "25%", height: "100%", background: ts.accent, borderRadius: 2 }} />
      </div>
      <div style={{ fontSize: 11, color: ts.subText, fontWeight: 800, marginBottom: 4 }}>STEP 1</div>
      <div style={{ fontSize: 12, color: ts.subText, fontWeight: 800, marginBottom: 6 }}>
        {THEME_CATEGORY_MSG[theme]?.sub}
      </div>
      <div
        style={{
          fontSize: 13,
          fontWeight: 700,
          color: ts.text,
          textAlign: "center",
          lineHeight: 1.4,
          marginBottom: 16,
        }}
      >
        {THEME_CATEGORY_MSG[theme]?.question}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
        {Object.values(CATEGORY_NAMES[theme] ?? {}).map((name, i) => (
          <div
            key={i}
            style={{
              width: "calc(50% - 3px)",
              height: 56,
              borderRadius: 10,
              border: `1.5px solid ${ts.accent}30`,
              background: `${ts.accent}12`,
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              padding: "0 4px 6px",
              flexShrink: 0,
            }}
          >
            <span style={{ fontSize: 11, fontWeight: 700, color: ts.text, opacity: 0.7 }}>{name}</span>
          </div>
        ))}
      </div>
    </div>,

    // SURVEY 2 - WORLDCUP
    <div
      key="survey2-worldcup"
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
      <div
        style={{
          width: "100%",
          height: 4,
          background: `${ts.accent}20`,
          borderRadius: 2,
          marginBottom: 16,
          flexShrink: 0,
        }}
      >
        <div style={{ width: "50%", height: "100%", background: ts.accent, borderRadius: 2 }} />
      </div>
      <div style={{ fontSize: 11, color: ts.subText, fontWeight: 800, marginBottom: 4 }}>STEP 2</div>
      <div style={{ fontSize: 12, color: ts.subText, fontWeight: 800, marginBottom: 16 }}>
        {THEME_STEP_TITLE[theme]?.step1}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {["아이템 A", "아이템 B"].map((item, i) => (
          <React.Fragment key={i}>
            <div
              style={{
                flex: 1,
                borderRadius: 12,
                overflow: "hidden",
                border: `1.5px solid ${ts.accent}30`,
                background: ts.cardBg,
              }}
            >
              <div style={{ height: 80, background: `${ts.accent}20` }} />
              <div style={{ padding: "8px 6px", fontSize: 12, fontWeight: 700, color: ts.text, textAlign: "center" }}>
                {item}
              </div>
            </div>
            {i === 0 && <div style={{ fontSize: 13, fontWeight: 900, color: ts.accent }}>VS</div>}
          </React.Fragment>
        ))}
      </div>
    </div>,

    // SURVEY 3 - FINAL
    <div
      key="survey3-final"
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
      <div
        style={{
          width: "100%",
          height: 4,
          background: `${ts.accent}20`,
          borderRadius: 2,
          marginBottom: 16,
          flexShrink: 0,
        }}
      >
        <div style={{ width: "100%", height: "100%", background: ts.accent, borderRadius: 2 }} />
      </div>
      <div style={{ fontSize: 11, color: ts.subText, fontWeight: 800, marginBottom: 4 }}>STEP 3 · 세부 디테일 선택</div>
      <div style={{ fontSize: 14, fontWeight: 800, color: ts.text, marginBottom: 4 }}>
        {THEME_STEP_MSG[theme]?.step3 ?? "순위를 매겨보세요."}
      </div>
      <div style={{ fontSize: 11, color: ts.subText, marginBottom: 14 }}>1순위부터 차례로 탭해주세요</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              background: `${ts.accent}18`,
              border: `1.5px solid ${ts.accent}`,
              borderRadius: 12,
              padding: "10px 12px",
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div style={{ fontSize: 18, width: 24, textAlign: "center" }}>{MEDAL[i]}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: ts.text }}>아이템 {i + 1}</div>
              <div style={{ fontSize: 10, color: MEDAL_COLOR[i], marginTop: 2 }}>{MEDAL_LABEL[i]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>,

    // RESULT
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
        <span
          style={{ display: "inline-flex", alignItems: "center", gap: 4, color: theme === "SURVIVAL" ? "#fff" : color }}
        >
          <Icon size={20} />
        </span>
      </div>
      <div
        style={{ background: ts.cardBg, borderRadius: 16, padding: "20px 16px", width: "100%", textAlign: "center" }}
      >
        <div
          style={{
            fontSize: 13,
            color: ts.subText,
            lineHeight: 2.0,
            whiteSpace: "pre-line",
            wordBreak: "keep-all",
            overflowWrap: "break-word",
          }}
        >
          {renderParts(
            THEME_RESULT_MSG[theme]?.parts,
            {
              KEYWORD1: filledTraits[0],
              KEYWORD2: filledTraits[1],
              KEYWORD3: filledTraits[2],
            },
            {
              default: {
                color: theme === "SURVIVAL" ? "#fff" : ts.accent,
                fontWeight: 700,
              },
            }
          )}
        </div>

        <div
          style={{
            fontSize: 12,
            color: ts.subText,
            lineHeight: 1.8,
            whiteSpace: "pre-line",
            wordBreak: "keep-all",
            overflowWrap: "break-word",
            fontWeight: 600,
          }}
        >
          {renderParts(
            THEME_RESULT_SUB[theme]?.parts,
            {
              ITEM: "[아이템]",
              KEYWORD1: filledTraits[0],
              KEYWORD2: filledTraits[1],
              KEYWORD3: filledTraits[2],
            },
            {
              ITEM: { color: ts.text, fontWeight: 900, fontSize: 14 },
              default: { color: ts.accent, fontWeight: 700 },
            }
          )}
        </div>
      </div>
    </div>,
  ];

  return <>{screens[page]}</>;
}
