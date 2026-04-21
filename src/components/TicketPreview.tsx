import React from "react";
import { THEME_MAIN_INFO, THEME_RESULT_MSG, THEME_RESULT_SUB, THEME_STEP_MSG } from "@/lib/constants";
import { THEME_STYLE, THEME_ICON } from "@/app/(web)/survey/[ticketId]/_styles";
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

    // SURVEY
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
      <div style={{ fontSize: 11, color: ts.subText, marginBottom: 4 }}>STEP 2</div>
      <div style={{ fontSize: 13, color: ts.subText, fontWeight: 700, marginBottom: 16 }}>
        {THEME_STEP_MSG[theme]?.step1}
      </div>
      <div style={{ width: "100%", height: 4, background: `${ts.accent}20`, borderRadius: 2, marginBottom: 16 }}>
        <div style={{ width: "40%", height: "100%", background: ts.accent, borderRadius: 2 }} />
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        {["아이템 A", "아이템 B"].map((item, i) => (
          <div
            key={i}
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
