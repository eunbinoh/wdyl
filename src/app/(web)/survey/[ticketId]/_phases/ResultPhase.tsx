import React from "react";
import { Item, Ticket } from "@/types";
import { MEDAL, THEME_ICON, ThemeStyle } from "../_styles";
import { THEME_RESULT_MSG, THEME_RESULT_SUB } from "@/lib/constants";

type Props = {
  ticket: Ticket;
  ts: ThemeStyle;
  pageStyle: React.CSSProperties;
  cardStyle: React.CSSProperties;
  medals: (Item | null)[];
};
type ResultPart = string | { key: string };

export function ResultPhase({ ticket, ts, pageStyle, cardStyle, medals }: Props) {
  const keywords = ticket.comment.split("/").map((s) => s.trim());
  const { icon: Icon, color } = THEME_ICON[ticket.theme] ?? THEME_ICON.MOOD;

  function renderParts(
    parts: ResultPart[] | undefined,
    values: Record<string, string>,
    styles: Record<string, React.CSSProperties>
  ) {
    return parts?.map((part, i) => {
      if (typeof part === "string") return <span key={i}>{part}</span>;
      return (
        <span
          key={i}
          style={styles[part.key] ?? styles.default}
        >
          {values[part.key] ?? ""}
        </span>
      );
    });
  }

  return (
    <div style={pageStyle}>
      <div style={{ marginBottom: 8 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
            color: ticket.theme === "SURVIVAL" ? "#fff" : color,
          }}
        >
          <Icon size={28} />
        </span>
      </div>
      <div style={{ fontSize: 20, fontWeight: 700, color: ts.subText, letterSpacing: 2, marginBottom: 40 }}>
        분석 결과
      </div>
      <div style={{ ...cardStyle, textAlign: "center", marginBottom: 20 }}>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: ts.subText,
            lineHeight: 1.7,
            whiteSpace: "pre-line",
            marginBottom: 8,
            wordBreak: "keep-all",
            overflowWrap: "break-word",
          }}
        >
          {renderParts(
            THEME_RESULT_MSG[ticket.theme]?.parts,
            {
              ITEM: medals[0]?.item_name ?? "",
              KEYWORD1: keywords[0],
              KEYWORD2: keywords[1],
              KEYWORD3: keywords[2],
            },
            { default: { color: ts.accent, fontWeight: 800 } }
          )}
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: ts.subText,
            lineHeight: 1.7,
            whiteSpace: "pre-line",
            wordBreak: "keep-all",
            overflowWrap: "break-word",
          }}
        >
          {renderParts(
            THEME_RESULT_SUB[ticket.theme]?.parts,
            {
              ITEM: medals[0]?.item_name ?? "",
              KEYWORD1: keywords[0],
              KEYWORD2: keywords[1],
              KEYWORD3: keywords[2],
            },
            {
              ITEM: { color: ts.text, fontWeight: 900, fontSize: 18 },
              default: { color: ts.accent, fontWeight: 700 },
            }
          )}
        </div>
      </div>
      <div style={{ ...cardStyle }}>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            color: ts.subText,
            marginBottom: 12,
            textAlign: "center",
          }}
        >
          PICK's TOP 3
        </div>
        {medals.map((m, i) =>
          m ? (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginBottom: 8,
                marginLeft: 40,
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 20, width: 24, textAlign: "center" }}>{MEDAL[i]}</span>
              <span style={{ fontSize: 14, width: "100px", fontWeight: 600, color: ts.text, textAlign: "left" }}>
                {m.item_name}
              </span>
            </div>
          ) : null
        )}
      </div>
      <div style={{ fontSize: 12, fontWeight: 500, color: ts.subText, marginTop: 24, textAlign: "center" }}>
        어쩌면, 이미 누군가가 당신을 위해
        <br />이 선물을 준비하고 있을지도 몰라요! ✨
      </div>
    </div>
  );
}
