import React from "react";
import { Item } from "@/types";
import { MEDAL, MEDAL_COLOR, MEDAL_LABEL, ThemeStyle } from "../_styles";
import Image from "next/image";

type Props = {
  ts: ThemeStyle;
  pickWinnerId: string;
  pageStyle: React.CSSProperties;
  cardStyle: React.CSSProperties;
  accentBtnStyle: React.CSSProperties;
  backBtnStyle: React.CSSProperties;
  step3Items: Item[];
  medals: (Item | null)[];
  step3Done: boolean;
  loading: boolean;
  onMedalToggle: (item: Item) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export function Step3Phase({
  ts,
  pickWinnerId,
  pageStyle,
  cardStyle,
  accentBtnStyle,
  backBtnStyle,
  step3Items,
  medals,
  step3Done,
  loading,
  onMedalToggle,
  onSubmit,
  onBack,
}: Props) {
  return (
    <div style={{ ...pageStyle, justifyContent: "flex-start", paddingTop: 48 }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ fontSize: 14, color: ts.subText, marginBottom: 6, fontWeight: 800 }}>STEP 3 · 세부순위 결정</div>
        {/* TODO: 최종선택한 이미지 추가 */}
        {pickWinnerId && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
            <Image
              src={`/items_img/${pickWinnerId.replace(/_/g, "")}.jpg`}
              alt={pickWinnerId}
              width={80}
              height={40}
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        )}
        <div style={{ fontSize: 13, color: ts.subText, textAlign: "center", marginBottom: 10 }}>
          1순위부터 차례대로 탭해주세요
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
          {step3Items.map((item) => {
            const medalIdx = medals.findIndex((m) => m?.item_id === item.item_id);
            const hasMedal = medalIdx !== -1;
            return (
              <div
                key={item.item_id}
                onClick={() => onMedalToggle(item)}
                style={{
                  background: hasMedal ? `${ts.accent}18` : ts.cardBg,
                  border: hasMedal ? `2px solid ${ts.accent}` : `1.5px solid ${ts.accent}20`,
                  borderRadius: 16,
                  padding: "14px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                <div style={{ fontSize: 28, width: 36, textAlign: "center" }}>{hasMedal ? MEDAL[medalIdx] : "○"}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: ts.text }}>{item.item_name}</div>
                  {hasMedal && (
                    <div style={{ fontSize: 12, color: MEDAL_COLOR[medalIdx], marginTop: 2 }}>
                      {MEDAL_LABEL[medalIdx]}
                    </div>
                  )}
                </div>
                {hasMedal && <div style={{ fontSize: 11, color: ts.subText }}>탭해서 취소</div>}
              </div>
            );
          })}
        </div>

        {medals.some((m) => m !== null) && (
          <div style={{ ...cardStyle, marginBottom: 20, padding: "16px 20px" }}>
            <div style={{ fontSize: 11, color: ts.subText, marginBottom: 10 }}>현재 순위</div>
            {medals.map((m, i) => (
              <div
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}
              >
                <span style={{ fontSize: 16 }}>{MEDAL[i]}</span>
                <span style={{ fontSize: 14, color: m ? ts.text : ts.subText }}>{m ? m.item_name : "미선택"}</span>
              </div>
            ))}
          </div>
        )}

        <button
          style={{ ...accentBtnStyle, opacity: step3Done ? 1 : 0.4, cursor: step3Done ? "pointer" : "not-allowed" }}
          onClick={onSubmit}
          disabled={!step3Done || loading}
        >
          {loading ? "저장 중..." : "결과 보기"}
        </button>
        <div style={{ height: 12 }} />
        <button
          style={{ ...backBtnStyle, cursor: !loading ? "pointer" : "not-allowed" }}
          onClick={onBack}
        >
          {loading ? "저장 중..." : "다시 하기"}
        </button>
      </div>
    </div>
  );
}
