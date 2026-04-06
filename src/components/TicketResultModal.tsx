"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import styles from "./allComponents.module.css";

const PODIUM = [
  {
    rank: 2,
    img: "/icons/silver-cup.png",
    bg: "#e8edf2",
    barColor: "#94a3b8",
    textColor: "#475569",
    imgSize: 40,
    padding: "14px 6px",
  },
  {
    rank: 1,
    img: "/icons/gold-cup.png",
    bg: "#FAEEDA",
    barColor: "#F9B233",
    textColor: "#854F0B",
    imgSize: 50,
    padding: "28px 6px 20px",
  },
  {
    rank: 3,
    img: "/icons/bronze-cup.png",
    bg: "#f3ede6",
    barColor: "#cd7f32",
    textColor: "#7c4f1e",
    imgSize: 30,
    padding: "6px 6px",
  },
];

type ResultItem = {
  item_id: string;
  item_name: string;
  link_url: string | null;
  category_code: string;
};

type Props = {
  ticketId: string;
  receiverName: string;
  onClose: () => void;
};

export default function TicketResultModal({ ticketId, receiverName, onClose }: Props) {
  const [items, setItems] = useState<(ResultItem | null)[]>([null, null, null]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      const { data: ticket } = await supabase!.from("Ticket").select("result").eq("ticket_id", ticketId).single();

      if (!ticket?.result) {
        setLoading(false);
        return;
      }

      const itemIds = ticket.result.split(" / ").map((s: string) => s.trim());

      const { data: itemData } = await supabase!
        .from("Item")
        .select("item_id, item_name, link_url, category_code")
        .in("item_id", itemIds);

      const sorted = itemIds.map((id: string) => itemData?.find((item) => item.item_id === id) ?? null);
      setItems(sorted);

      const itemLevel = itemData?.[0]?.item_id.slice(0, 5);
      if (itemLevel) {
        const { data: item } = await supabase!.from("Item").select("item_name").eq("item_id", itemLevel).single();
        if (item) setCategoryName(item.item_name);
      }

      setLoading(false);
    };

    fetchResult();
  }, [ticketId]);

  // 시상대 순서: 2위 - 1위 - 3위
  const podiumOrder = [items[1], items[0], items[2]];

  return (
    <div
      className={styles["modal-overlay"]}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles["modal-sheet"]}>
        <div className={styles["modal-handle"]} />
        <div
          className={styles["modal-title"]}
          style={{ marginBottom: 10 }}
        >
          {receiverName}의 취향분석 결과
        </div>
        {categoryName && (
          <div style={{ textAlign: "start", marginBottom: 20, marginTop: 20 }}>
            <span style={{ fontSize: 14 }}>카테고리 : </span>
            <span style={{ fontSize: 16 }}>{categoryName}</span>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#AAA" }}>불러오는 중...</div>
        ) : items.every((i) => i === null) ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#AAA" }}>결과 데이터가 없어요.</div>
        ) : (
          <div style={{ maxWidth: 280, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 0 }}>
              {PODIUM.map((p, i) => {
                const item = podiumOrder[i];
                const isFirst = i === 0;
                const isLast = i === 2;
                return (
                  <div
                    key={p.rank}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}
                  >
                    <div
                      style={{
                        background: p.bg,
                        borderRight: isFirst ? "none" : undefined,
                        borderLeft: isLast ? "none" : undefined,
                        borderBottom: "none",
                        borderRadius: isFirst ? "8px 0 0 0" : isLast ? "0 8px 0 0" : "8px 8px 0 0",
                        padding: p.padding,
                        width: "100%",
                        textAlign: "center",
                        position: "relative",
                        zIndex: i === 1 ? 1 : 0,
                      }}
                    >
                      <Image
                        src={p.img}
                        alt={`${p.rank}위`}
                        width={p.imgSize}
                        height={p.imgSize}
                        style={{ margin: "0 auto 6px" }}
                      />
                      <div style={{ fontSize: 11, color: p.textColor, wordBreak: "keep-all", fontWeight: 500 }}>
                        {item?.item_name ?? "-"}
                      </div>
                    </div>
                    {item?.link_url ? (
                      <a
                        href={item.link_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          background: p.barColor,
                          width: "100%",
                          height: 35,
                          borderRadius: isFirst ? "0 0 0 6px" : isLast ? "0 0 6px 0" : 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          textDecoration: "none",
                        }}
                      >
                        <span style={{ fontSize: 10, fontWeight: 500, color: "#fff" }}>선물추천링크</span>
                      </a>
                    ) : (
                      <div
                        style={{
                          background: p.barColor,
                          width: "100%",
                          height: 56,
                          borderRadius: isFirst ? "0 0 0 6px" : isLast ? "0 0 6px 0" : 0,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          opacity: 0.5,
                        }}
                      >
                        <span style={{ fontSize: 10, color: "#fff" }}>링크 준비중</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={{ height: 6, background: "#E2E8F0", borderRadius: "0 0 4px 4px" }} />
          </div>
        )}

        <div style={{ marginTop: 50 }}>
          <button
            className={styles["modal-btn-cancel"]}
            onClick={onClose}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
