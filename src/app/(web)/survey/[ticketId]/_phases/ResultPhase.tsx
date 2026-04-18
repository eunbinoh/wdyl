import React from "react";
import { Item, Ticket } from "@/types";
import { buildResultMsg, MEDAL, THEME_EMOJI, ThemeStyle } from "../_styles";

type Props = {
  ticket: Ticket;
  ts: ThemeStyle;
  pageStyle: React.CSSProperties;
  cardStyle: React.CSSProperties;
  medals: (Item | null)[];
};

export function ResultPhase({ ticket, ts, pageStyle, cardStyle, medals }: Props) {
  const resultMsg = buildResultMsg(ticket.comment, ticket.theme, medals[0]?.item_name);
  return (
    <div style={pageStyle}>
      <div style={{ fontSize: 48, marginBottom: 20 }}>{THEME_EMOJI[ticket.theme] ?? "🎁"}</div>
      <div style={{ fontSize: 13, color: ts.subText, letterSpacing: 2, marginBottom: 20 }}>RESULT</div>
      <div style={{ ...cardStyle, textAlign: "center", marginBottom: 20 }}>
        <div style={{ fontSize: 14, color: ts.subText, lineHeight: 2, whiteSpace: "pre-line", marginBottom: 16 }}>
          {resultMsg}
        </div>
      </div>
      <div style={{ ...cardStyle }}>
        <div style={{ fontSize: 11, color: ts.subText, marginBottom: 12 }}>내가 고른 선물 순위</div>
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
        선물을 준비 중인 누군가에게
        <br />이 결과가 전달될 거예요 {THEME_EMOJI[ticket.theme]}
      </div>
    </div>
  );
}
