import React from "react";
import { THEME_MAIN_INFO } from "@/lib/constants";
import { Ticket } from "@/types";
import { ThemeStyle } from "../_styles";

type Props = {
  ticket: Ticket;
  ts: ThemeStyle;
  pageStyle: React.CSSProperties;
  accentBtnStyle: React.CSSProperties;
  onStart: () => void;
};

export function IntroPhase({ ticket, ts, pageStyle, accentBtnStyle, onStart }: Props) {
  const info = THEME_MAIN_INFO[ticket.theme];
  return (
    <div style={pageStyle}>
      <div style={{ fontSize: 13, color: ts.subText, letterSpacing: 3, marginBottom: 24 }}>WDYL</div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: ts.text,
          textAlign: "center",
          lineHeight: 1.4,
          marginBottom: 12,
        }}
      >
        <span style={{ color: ts.accent }}>{ticket.receiver_name}</span>님의
        <br />
        취향 분석하기
      </div>
      <div
        style={{
          fontSize: 14,
          color: ts.subText,
          textAlign: "center",
          lineHeight: 1.8,
          marginBottom: 16,
          whiteSpace: "pre-line",
        }}
      >
        {info?.title}
      </div>
      {info?.keywords && (
        <div style={{ display: "flex", gap: 8, marginBottom: 40, flexWrap: "wrap", justifyContent: "center" }}>
          {info.keywords.map((kw) => (
            <span
              key={kw}
              style={{
                fontSize: 12,
                color: ts.accent,
                background: `${ts.accent}18`,
                padding: "4px 10px",
                borderRadius: 20,
                fontWeight: 600,
              }}
            >
              {kw}
            </span>
          ))}
        </div>
      )}
      <div style={{ width: "100%", maxWidth: 320 }}>
        <button
          style={accentBtnStyle}
          onClick={onStart}
        >
          START
        </button>
      </div>
    </div>
  );
}
