import React from "react";
import { Item, Ticket } from "@/types";
import { MEDAL, THEME_EMOJI, ThemeStyle } from "../_styles";
import { THEME_RESULT_MSG, THEME_RESULT_SUB } from "@/lib/constants";

type Props = {
  ticket: Ticket;
  ts: ThemeStyle;
  pageStyle: React.CSSProperties;
  cardStyle: React.CSSProperties;
  medals: (Item | null)[];
};

export function ResultPhase({ ticket, ts, pageStyle, cardStyle, medals }: Props) {
  const keywords = ticket.comment.split("/").map((s) => s.trim());

  return (
    <div style={pageStyle}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>{THEME_EMOJI[ticket.theme] ?? "🎁"}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: ts.subText, letterSpacing: 2, marginBottom: 20 }}>
        분석 결과
      </div>
      <div style={{ ...cardStyle, textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: ts.subText, lineHeight: 2, whiteSpace: "pre-line", marginBottom: 16 }}>
          {THEME_RESULT_MSG[ticket.theme]
            ?.replace("[KEYWORD1]", keywords[0])
            .replace("[KEYWORD2]", keywords[1])
            .replace("[KEYWORD3]", keywords[2])}
        </div>
        <div style={{ fontSize: 14, color: ts.subText, lineHeight: 2, whiteSpace: "pre-line" }}>
          {THEME_RESULT_SUB[ticket.theme]
            ?.replace("[ITEM]", medals[0]?.item_name ?? "")
            .replace("[KEYWORD2]", keywords[1])
            .replace("[KEYWORD3]", keywords[2])}
        </div>
      </div>
      <div style={{ ...cardStyle }}>
        <div style={{ fontSize: 11, color: ts.subText, marginBottom: 12 }}>PICK's TOP 3</div>
        {medals.map((m, i) =>
          m ? (
            <div
              key={i}
              style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}
            >
              <span style={{ fontSize: 20 }}>{MEDAL[i]}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: ts.text }}>{m.item_name}</span>
            </div>
          ) : null
        )}
      </div>
      <div style={{ fontSize: 12, color: ts.subText, marginTop: 24, textAlign: "center" }}>
        어쩌면, 이미 누군가가 당신을 위해
        <br />이 선물을 준비하고 있을지도 몰라요! {THEME_EMOJI[ticket.theme]}
      </div>
    </div>
  );
}
