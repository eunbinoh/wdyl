import React, { useEffect, useState } from "react";
import { Item, Ticket } from "@/types";
import { MEDAL, THEME_ICON, ThemeStyle } from "../_styles";
import { CATEGORY_NAMES, THEME_RESULT_MSG, THEME_RESULT_SUB } from "@/lib/constants";
import { supabase } from "@/lib/supabase";
import { ITEM_NAME_MAP } from "@/lib/helper";
import { useRouter } from "next/navigation";

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
  const [pickHistory, setPickHistory] = useState<string[]>([]);
  const [fallbackMedals, setFallbackMedals] = useState<Item[]>([]);
  const displayMedals = medals?.filter(Boolean).length > 0 ? medals : fallbackMedals;
  const categoryCode = displayMedals?.[0]?.category_code;
  const categoryName = categoryCode ? CATEGORY_NAMES.MOOD[categoryCode] : "카테고리";

  const router = useRouter();
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    async function fetchPickHistory() {
      const { data: ticketData } = await supabase!
        .from("Ticket")
        .select("pick_history, result, user_id")
        .eq("ticket_id", ticket.ticket_id)
        .single();

      if (!ticketData) return;
      setPickHistory(ticketData.pick_history?.split("/").map((s: string) => s.trim()) ?? []);

      // 소유자 체크
      const {
        data: { user },
      } = await supabase!.auth.getUser();
      setIsOwner(!!user && user.id === ticketData.user_id);

      const hasMedals = medals?.some((m) => m);
      if (!hasMedals && ticketData.result) {
        const firstResult = ticketData.result.split(" / ")[0]?.trim();

        if (firstResult) {
          const prefix = firstResult.slice(0, 5);
          const { data } = await supabase!
            .from("Item")
            .select("item_id, item_name, category_code")
            .eq("level", 3)
            .like("item_id", `${prefix}%`)
            .order("item_id", { ascending: true });

          if (data?.length) {
            setFallbackMedals(data as Item[]);
          }
        }
      }
    }

    fetchPickHistory();
  }, [ticket.ticket_id, medals]);

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
              ITEM: displayMedals[0]?.item_name ?? "",
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
              ITEM: displayMedals[0]?.item_name ?? "",
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
      <div style={{ ...cardStyle, padding: "12px 20px" }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: ts.subText,
            marginTop: 4,
            marginBottom: 4,
          }}
        >
          {categoryName} TOP 3
        </div>
        {displayMedals.map((m, i) =>
          m ? (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                marginBottom: 0,
                marginLeft: 8,
                justifyContent: "center",
              }}
            >
              <span style={{ fontSize: 20, width: 24, textAlign: "center" }}>{MEDAL[i]}</span>
              <span style={{ fontSize: 14, width: "100%", fontWeight: 600, color: ts.text, textAlign: "left" }}>
                {m.item_name}
              </span>
            </div>
          ) : null
        )}
      </div>
      {pickHistory.length > 0 && (
        <div style={{ ...cardStyle, padding: "12px 20px", marginTop: 20 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: ts.subText,
              marginBottom: 8,
            }}
          >
            Last BEST 3<br />
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginLeft: 8 }}>
            {pickHistory.map((item, idx) => (
              <span
                key={idx}
                style={{
                  display: "inline-block",
                  padding: "2px 8px",
                  backgroundColor: ts.accent + "10",
                  color: ts.accent,
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: 700,
                  border: `1px solid ${ts.accent}30`,
                }}
              >
                # {ITEM_NAME_MAP[item]}
              </span>
            ))}
          </div>
        </div>
      )}
      {isOwner ? (
        <div style={{ display: "flex", justifyContent: "center", margin: "auto auto" }}>
          <button
            onClick={() => router.push("/main")}
            style={{
              marginTop: 24,
              width: "100%",
              padding: "14px 20px",
              backgroundColor: ts.accent,
              color: "#000",
              border: "none",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            추천 링크 확인하러 가기
          </button>
        </div>
      ) : (
        <div style={{ fontSize: 12, fontWeight: 500, color: ts.subText, marginTop: 24, textAlign: "center" }}>
          어쩌면, 이미 누군가가 당신을 위해
          <br />이 선물을 준비하고 있을지도 몰라요! ✨
        </div>
      )}
    </div>
  );
}
