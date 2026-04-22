import React, { Fragment } from "react";
import Image from "next/image";
import { THEME_STEP_MSG, THEME_STEP_TITLE } from "@/lib/constants";
import { Item, Ticket } from "@/types";
import { ThemeStyle } from "../_styles";
import styles from "../survey.module.css";

type Props = {
  ticket: Ticket;
  ts: ThemeStyle;
  pageStyle: React.CSSProperties;
  backBtnStyle: React.CSSProperties;
  wcRound: number;
  wcWinners: Item[];
  getCurrentPair: () => [Item, Item] | null;
  onPick: (item: Item) => void;
  onBack: () => void;
};

export function Step2Phase({
  ticket,
  ts,
  pageStyle,
  backBtnStyle,
  wcRound,
  wcWinners,
  getCurrentPair,
  onPick,
  onBack,
}: Props) {
  const isFinal = wcRound === 3;
  const progress = (wcRound / 4) * 100;
  const stepTitle = THEME_STEP_TITLE[ticket.theme];
  const stepMsg = THEME_STEP_MSG[ticket.theme];
  const titleKey = (["step1", "step2", "step3"] as const)[Math.min(wcRound, 2)];
  const title = isFinal ? stepMsg?.step2 : stepTitle?.[titleKey];

  const displayItems = isFinal ? wcWinners : (getCurrentPair() ?? []);

  return (
    <div style={{ ...pageStyle, justifyContent: "flex-start", paddingTop: 48 }}>
      <div style={{ width: "100%", maxWidth: 520 }}>
        <div
          style={{
            width: "100%",
            height: 4,
            background: `${ts.accent}20`,
            borderRadius: 2,
            marginTop: 12,
            marginBottom: 20,
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              background: ts.accent,
              borderRadius: 2,
              transition: "width 0.3s",
            }}
          />
        </div>

        <div style={{ fontSize: 13, color: ts.subText, marginBottom: 4, fontWeight: 800 }}>STEP 2</div>
        <div style={{ fontSize: 14, color: ts.subText, fontWeight: 800, marginBottom: 20 }}>{title}</div>

        <div className={`${styles["wc-grid"]} ${isFinal ? styles.final : ""}`}>
          {displayItems.map((item, idx) => {
            const imgSrc = `/items_img/${item.item_id.replace(/_/g, "")}.jpg`;
            return (
              <Fragment key={item.item_id}>
                <div
                  onClick={() => onPick(item)}
                  style={{
                    flex: 1,
                    background: ts.cardBg,
                    borderRadius: 16,
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    cursor: "pointer",
                    border: `1.5px solid ${ts.accent}30`,
                    transition: "transform 0.15s, box-shadow 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1.03)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px ${ts.accent}30`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: isFinal ? 120 : 160,
                      background: `${ts.accent}12`,
                    }}
                  >
                    <Image
                      src={imgSrc}
                      alt={item.item_name}
                      fill
                      style={{ objectFit: "cover", objectPosition: "center" }}
                      sizes={isFinal ? "30vw" : "(max-width: 560px) 45vw, 250px"}
                      priority={wcRound === 0}
                    />
                  </div>
                  <div style={{ padding: isFinal ? "8px 6px 12px" : "12px 8px 16px" }}>
                    <div style={{ fontSize: isFinal ? 12 : 15, fontWeight: 700, color: ts.text, lineHeight: 1.35 }}>
                      {item.item_name}
                    </div>
                  </div>
                </div>

                {!isFinal && idx === 0 && (
                  <div
                    className={styles["wc-vs"]}
                    style={{ color: ts.accent }}
                  >
                    VS
                  </div>
                )}
              </Fragment>
            );
          })}
        </div>

        <button
          style={{ ...backBtnStyle, marginTop: 40 }}
          onClick={onBack}
        >
          다시 하기
        </button>
      </div>
    </div>
  );
}
