"use client";

import { Fragment, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { THEME_START_MSG } from "@/lib/constants";
import { Ticket, Category, Item, Phase } from "@/types";
import Image from "next/image";

type Props = {
  ticket: Ticket;
  categories: Category[];
};

const THEME_STYLE: Record<
  string,
  {
    bg: string;
    accent: string;
    text: string;
    subText: string;
    cardBg: string;
    btnText: string;
    font: string;
  }
> = {
  formal: {
    bg: "#1C1C1C",
    accent: "#FFFFFF",
    text: "#FFFFFF",
    subText: "#888",
    cardBg: "#2A2A2A",
    btnText: "#000000",
    font: "Georgia, serif",
  },
  friend: {
    bg: "#EDE9F8",
    accent: "#7C5CBF",
    text: "#2D1F5E",
    subText: "#9B8EC4",
    cardBg: "#FFFFFF",
    btnText: "#FFFFFF",
    font: "inherit",
  },
  sweet: {
    bg: "#FFF0F5",
    accent: "#E8639A",
    text: "#8B2252",
    subText: "#D4879E",
    cardBg: "#FFFFFF",
    btnText: "#FFFFFF",
    font: "inherit",
  },
};

const THEME_EMOJI: Record<string, string> = {
  formal: "🎩",
  friend: "🤝🏻",
  sweet: "💕",
};

const CATEGORY_EMOJI: Record<string, string> = {
  food: "🍽️",
  voucher: "🎟️",
  work: "💼",
  cafe: "☕",
  baby: "👶",
  fun: "🎉",
  beauty: "💄",
  health: "💊",
  living: "🏠",
};

const MEDAL = ["🥇", "🥈", "🥉"];
const MEDAL_LABEL = ["1순위", "2순위", "3순위"];
const MEDAL_COLOR = ["#F9B233", "#94a3b8", "#cd7f32"];

function buildResultMsg(comment: string, theme: string): string {
  const parts = comment.split("/").map((s) => s.trim());
  const [t1, t2, t3] = parts;
  if (theme === "formal") {
    return `${t1 ?? ""}으시며, ${t2 ?? ""}시고, ${t3 ?? ""}한 당신께\n센스있는 선물을 드리고 싶은분이 있어요.`;
  }
  if (theme === "friend") {
    return `${t1 ?? ""}하고, ${t2 ?? ""}하며,\n${t3 ?? ""}한 당신의\n 맘에 쏙드는 선물을 고르는 중 🤝🏻`;
  }
  return `${t1 ?? ""}하고, ${t2 ?? ""}하며,\n${t3 ?? ""}한 사람에게\n드릴 달콤한 선물을 준비하고 있어요 💕`;
}

export default function SurveyClient({ ticket, categories }: Props) {
  const ts = THEME_STYLE[ticket.theme] ?? THEME_STYLE.formal;
  const isExpired = ticket.status === "complete" || ticket.status === "cancelled";

  const [phase, setPhase] = useState<Phase>(isExpired ? "expired" : "intro");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // 월드컵
  const [wcItems, setWcItems] = useState<Item[]>([]);
  const [wcRound, setWcRound] = useState(0);
  const [wcWinners, setWcWinners] = useState<Item[]>([]);

  // 스텝3
  const [step3Items, setStep3Items] = useState<Item[]>([]);
  const [medals, setMedals] = useState<(Item | null)[]>([null, null, null]);
  const [step3Done, setStep3Done] = useState(false);
  const [loading, setLoading] = useState(false);

  const [wcStackLayout, setWcStackLayout] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 560px)");
    const sync = () => setWcStackLayout(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (wcRound >= 4) return;
    const nextBase = (wcRound + 1) * 2;
    [wcItems[nextBase], wcItems[nextBase + 1]].forEach((item) => {
      if (!item) return;
      const link = document.createElement("link");
      link.rel = "prefetch";
      link.href = `/items_img/${item.item_id.replace(/_/g, "")}.jpg`;
      document.head.appendChild(link);
    });
  }, [wcRound]);

  const handleStart = async () => {
    if (ticket.status === "init") {
      await supabase!.from("Ticket").update({ status: "progress" }).eq("ticket_id", ticket.ticket_id);
    }
    setPhase("step1");
  };

  const handleCategoryNext = async () => {
    if (!selectedCategory) return;
    const { data } = await supabase!
      .from("Item")
      .select("item_id, item_name, category_code")
      .eq("category_code", selectedCategory)
      .eq("level", 2);

    if (!data || data.length < 6) return alert("아이템 데이터를 불러오지 못했어요.");
    setWcItems(data);
    setWcRound(0);
    setWcWinners([]);
    setPhase("step2");
  };

  // 월드컵 선택 wcRound
  // round 0,1,2 → 2:2:2 (pairs: [0,1],[2,3],[4,5])
  // round 3 → winner[0] vs winner[1]
  // round 4 → round3_winner vs winner[2]
  const getCurrentPair = (): [Item, Item] | null => {
    if (wcRound < 3) {
      const base = wcRound * 2;
      return [wcItems[base], wcItems[base + 1]];
    }
    if (wcRound === 3) return [wcWinners[0], wcWinners[1]];
    if (wcRound === 4) return [wcWinners[3], wcWinners[2]];
    return null;
  };

  const handleWcPick = async (picked: Item) => {
    const newWinners = [...wcWinners, picked];

    if (wcRound < 4) {
      setWcWinners(newWinners);
      setWcRound(wcRound + 1);
      return;
    }
    const finalWinner = picked;
    const prefix = finalWinner.item_id;
    const { data } = await supabase!
      .from("Item")
      .select("item_id, item_name, category_code")
      .eq("category_code", finalWinner.category_code)
      .eq("level", 3)
      .like("item_id", `${prefix}%`);

    if (!data || data.length < 3) return alert("상세 아이템을 불러오지 못했어요.");
    setStep3Items(data.slice(0, 3));
    setMedals([null, null, null]);
    setStep3Done(false);
    setPhase("step3");
  };

  const handleMedalPick = (item: Item, rank: number) => {
    const newMedals = [...medals];
    // 이미 다른 순위에 있으면 제거
    const prevIdx = newMedals.findIndex((m) => m?.item_id === item.item_id);
    if (prevIdx !== -1) newMedals[prevIdx] = null;
    newMedals[rank] = item;
    setMedals(newMedals);
    if (newMedals.every((m) => m !== null)) setStep3Done(true);
  };

  const handleSubmitResult = async () => {
    if (!step3Done) return;
    setLoading(true);
    const result = medals.map((m) => m?.item_id).join(" / ");
    const { error } = await supabase!
      .from("Ticket")
      .update({ status: "complete", result })
      .eq("ticket_id", ticket.ticket_id);
    if (error) {
      alert("저장 중 오류가 발생했어요.");
      setLoading(false);
      return;
    }
    setPhase("result");
    setLoading(false);
  };

  const pageStyle = {
    minHeight: "100vh",
    background: ts.bg,
    fontFamily: ts.font,
    color: ts.text,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 32,
    paddingBottom: 32,
    paddingLeft: 20,
    paddingRight: 20,
  };

  const cardStyle = {
    background: ts.cardBg,
    borderRadius: 20,
    padding: "24px 20px",
    width: "100%",
    maxWidth: 420,
  };

  const accentBtnStyle = {
    background: ts.accent,
    color: ts.btnText,
    border: "none",
    borderRadius: 14,
    padding: "15px 0",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
  };
  const backBtnStyle = {
    background: ts.cardBg,
    color: ts.accent,
    border: `1.5px solid ${ts.accent}30`,
    borderRadius: 14,
    padding: "15px 0",
    fontSize: 15,
    fontWeight: 700,
    cursor: "pointer",
    width: "100%",
  };

  if (phase === "expired") {
    return (
      <div style={pageStyle}>
        <div style={{ fontSize: 40, marginBottom: 20 }}>🔒</div>
        <div
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: ts.text,
            marginBottom: 8,
            textAlign: "center",
          }}
        >
          이미 사용된 티켓이에요
        </div>
        <div style={{ fontSize: 14, color: ts.subText, textAlign: "center" }}>
          이 설문 링크는 더 이상 사용할 수 없어요.
        </div>
      </div>
    );
  }

  if (phase === "intro") {
    return (
      <div style={pageStyle}>
        <div
          style={{
            fontSize: 13,
            color: ts.subText,
            letterSpacing: 3,
            marginBottom: 24,
          }}
        >
          WDYL
        </div>
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
            marginBottom: 40,
            whiteSpace: "pre-line",
          }}
        >
          {THEME_START_MSG[ticket.theme]}
        </div>
        <div style={{ width: "100%", maxWidth: 320 }}>
          <button
            style={accentBtnStyle}
            onClick={handleStart}
          >
            START
          </button>
        </div>
      </div>
    );
  }

  if (phase === "step1") {
    return (
      <div style={{ ...pageStyle, justifyContent: "flex-start", paddingTop: 48 }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ fontSize: 13, color: ts.subText, marginBottom: 6 }}>STEP 1</div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: ts.text,
              marginTop: 20,
              marginBottom: 40,
              textAlign: "center",
            }}
          >
            어떤 종류의 선물이 마음에 드시나요?
          </div>
          {/* 카테고리 그리드 */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              marginBottom: 80,
            }}
          >
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.category_code;
              const isHovered = hoveredCategory === cat.category_code;
              return (
                <div
                  key={cat.category_code}
                  onClick={() => setSelectedCategory(cat.category_code)}
                  onMouseEnter={() => setHoveredCategory(cat.category_code)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  style={{
                    width: isSelected ? 110 : 100,
                    height: isSelected ? 110 : 100,
                    borderRadius: "50%",
                    background: isSelected ? ts.accent : isHovered ? `${ts.accent}14` : ts.cardBg,
                    color: isSelected ? ts.btnText : ts.text,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    transition: "transform 0.2s, box-shadow 0.2s, background 0.2s, border 0.2s",
                    fontSize: 14,
                    fontWeight: 700,
                    gap: 4,
                    border: isSelected ? "none" : `1.5px solid ${isHovered ? `${ts.accent}70` : `${ts.accent}30`}`,
                    boxShadow: isSelected
                      ? isHovered
                        ? `0 6px 16px ${ts.accent}55`
                        : `0 4px 12px ${ts.accent}40`
                      : isHovered
                        ? `0 3px 10px ${ts.accent}35`
                        : "none",
                    transform: isHovered ? (isSelected ? "scale(1.03)" : "scale(1.06)") : "scale(1)",
                  }}
                >
                  <span style={{ fontSize: 22 }}>{CATEGORY_EMOJI[cat.category_code] ?? "🎁"}</span>
                  <span>{cat.name}</span>
                </div>
              );
            })}
          </div>
          <button
            style={{
              ...accentBtnStyle,
              opacity: selectedCategory ? 1 : 0.4,
              cursor: selectedCategory ? "pointer" : "not-allowed",
            }}
            onClick={handleCategoryNext}
            disabled={!selectedCategory}
          >
            다음
          </button>
        </div>
      </div>
    );
  }

  if (phase === "step2") {
    const pair = getCurrentPair();
    if (!pair) return null;
    const [itemA, itemB] = pair;
    const progress = (wcRound / 5) * 100;

    const roundLabel = wcRound < 3 ? `${wcRound + 1}/3 라운드` : wcRound === 3 ? "준결승" : "결승";

    return (
      <div style={{ ...pageStyle, justifyContent: "flex-start", paddingTop: 48 }}>
        <div style={{ width: "100%", maxWidth: 520 }}>
          <div style={{ fontSize: 13, color: ts.subText, marginBottom: 6 }}>STEP 2 · {roundLabel}</div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: ts.text,
              marginBottom: 16,
            }}
          >
            둘 중에 더 선호하는 것을 골라주세요!
          </div>

          {/* 진행바 */}
          <div
            style={{
              width: "100%",
              height: 4,
              background: `${ts.accent}20`,
              borderRadius: 2,
              marginBottom: 28,
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

          {/* VS 카드: 모바일(좁은 화면)에서는 세로 + 사이 VS */}
          <div
            style={{
              display: "flex",
              flexDirection: wcStackLayout ? "column" : "row",
              alignItems: wcStackLayout ? "stretch" : undefined,
              gap: wcStackLayout ? 10 : 14,
              marginBottom: 16,
            }}
          >
            {[itemA, itemB].map((item, idx) => {
              const imgSrc = `/items_img/${item.item_id.replace(/_/g, "")}.jpg`;
              return (
                <Fragment key={item.item_id}>
                  <div
                    onClick={() => handleWcPick(item)}
                    style={{
                      flex: wcStackLayout ? undefined : 1,
                      alignSelf: wcStackLayout ? "center" : undefined,
                      width: wcStackLayout ? "70%" : undefined,
                      minWidth: wcStackLayout ? undefined : 0,
                      background: ts.cardBg,
                      borderRadius: 20,
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
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        flexShrink: 0,
                        background: `${ts.accent}12`,
                      }}
                    >
                      <div
                        style={
                          wcStackLayout
                            ? {
                                position: "relative",
                                width: "100%",
                                height: 0,
                                paddingBottom: "calc(100% - 20px)",
                                overflow: "hidden",
                                background: `${ts.accent}12`,
                              }
                            : {
                                position: "relative",
                                width: 250,
                                height: 250,
                                overflow: "hidden",
                                background: `${ts.accent}12`,
                              }
                        }
                      >
                        <Image
                          src={imgSrc}
                          alt={item.item_name}
                          fill
                          style={{ objectFit: "cover", objectPosition: "center" }}
                          sizes="(max-width: 560px) 70vw, 250px"
                          priority={wcRound === 0} // 첫 라운드만 priority
                        />
                      </div>
                    </div>
                    <div style={{ padding: "14px 12px 18px" }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: ts.text, lineHeight: 1.35 }}>
                        {item.item_name}
                      </div>
                    </div>
                  </div>
                  {wcStackLayout && idx === 0 ? (
                    <div
                      style={{
                        flexShrink: 0,
                        textAlign: "center",
                        fontSize: 17,
                        fontWeight: 900,
                        color: ts.accent,
                        padding: "6px 0 2px",
                      }}
                    >
                      VS
                    </div>
                  ) : null}
                </Fragment>
              );
            })}
          </div>
          <button
            style={{
              ...backBtnStyle,
              opacity: selectedCategory ? 1 : 0.4,
              cursor: selectedCategory ? "pointer" : "not-allowed",
              marginTop: 40,
            }}
            onClick={() => setPhase("step1")}
            disabled={!selectedCategory}
          >
            다시 하기
          </button>
        </div>
      </div>
    );
  }

  if (phase === "step3") {
    return (
      <div style={{ ...pageStyle, justifyContent: "flex-start", paddingTop: 48 }}>
        <div style={{ width: "100%", maxWidth: 420 }}>
          <div style={{ fontSize: 13, color: ts.subText, marginBottom: 6 }}>STEP 3 · 최종 선택</div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 800,
              color: ts.text,
              marginBottom: 8,
            }}
          >
            순위를 매겨봐요!
          </div>
          <div style={{ fontSize: 13, color: ts.subText, marginBottom: 28 }}>1순위부터 차례로 탭해주세요</div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              marginBottom: 28,
            }}
          >
            {step3Items.map((item) => {
              const medalIdx = medals.findIndex((m) => m?.item_id === item.item_id);
              const hasMedal = medalIdx !== -1;
              return (
                <div
                  key={item.item_id}
                  onClick={() => {
                    if (hasMedal) {
                      // 취소
                      const newMedals = medals.map((m) => (m?.item_id === item.item_id ? null : m));
                      setMedals(newMedals);
                      setStep3Done(false);
                    } else {
                      // 다음 빈 순위에 배정
                      const nextRank = medals.findIndex((m) => m === null);
                      if (nextRank === -1) return;
                      handleMedalPick(item, nextRank);
                    }
                  }}
                  style={{
                    background: hasMedal ? `${ts.accent}18` : ts.cardBg,
                    border: hasMedal ? `2px solid ${ts.accent}` : `1.5px solid ${ts.accent}20`,
                    borderRadius: 16,
                    padding: "18px 20px",
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
                      <div
                        style={{
                          fontSize: 12,
                          color: MEDAL_COLOR[medalIdx],
                          marginTop: 2,
                        }}
                      >
                        {MEDAL_LABEL[medalIdx]}
                      </div>
                    )}
                  </div>
                  {hasMedal && <div style={{ fontSize: 11, color: ts.subText }}>탭해서 취소</div>}
                </div>
              );
            })}
          </div>

          {/* 현재 순위 미리보기 */}
          {medals.some((m) => m !== null) && (
            <div style={{ ...cardStyle, marginBottom: 20, padding: "16px 20px" }}>
              <div style={{ fontSize: 11, color: ts.subText, marginBottom: 10 }}>현재 순위</div>
              {medals.map((m, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 6,
                  }}
                >
                  <span style={{ fontSize: 16 }}>{MEDAL[i]}</span>
                  <span style={{ fontSize: 14, color: m ? ts.text : ts.subText }}>{m ? m.item_name : "미선택"}</span>
                </div>
              ))}
            </div>
          )}

          <button
            style={{
              ...accentBtnStyle,
              opacity: step3Done ? 1 : 0.4,
              cursor: step3Done ? "pointer" : "not-allowed",
            }}
            onClick={handleSubmitResult}
            disabled={!step3Done || loading}
          >
            {loading ? "저장 중..." : "결과 보기"}
          </button>
          <div style={{ height: 12 }} />
          <button
            style={{
              ...backBtnStyle,
              cursor: !loading ? "pointer" : "not-allowed",
            }}
            onClick={() => setPhase("step1")}
          >
            {loading ? "저장 중..." : "다시 하기"}
          </button>
        </div>
      </div>
    );
  }

  if (phase === "result") {
    const resultMsg = buildResultMsg(ticket.comment, ticket.theme);
    return (
      <div style={pageStyle}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>{THEME_EMOJI[ticket.theme] ?? "🎁"}</div>
        <div
          style={{
            fontSize: 13,
            color: ts.subText,
            letterSpacing: 2,
            marginBottom: 20,
          }}
        >
          RESULT
        </div>

        <div style={{ ...cardStyle, textAlign: "center", marginBottom: 20 }}>
          <div
            style={{
              fontSize: 14,
              color: ts.subText,
              lineHeight: 2,
              whiteSpace: "pre-line",
              marginBottom: 16,
            }}
          >
            {resultMsg}
          </div>
        </div>

        {/* 최종 순위 */}
        <div style={{ ...cardStyle }}>
          <div style={{ fontSize: 11, color: ts.subText, marginBottom: 12 }}>내가 고른 선물 순위</div>
          {medals.map(
            (m, i) =>
              m && (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 20 }}>{MEDAL[i]}</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: ts.text }}>{m.item_name}</span>
                </div>
              )
          )}
        </div>

        <div
          style={{
            fontSize: 12,
            color: ts.subText,
            marginTop: 24,
            textAlign: "center",
          }}
        >
          선물을 준비 중인 누군가에게
          <br />이 결과가 전달될 거예요 {THEME_EMOJI[ticket.theme]}
        </div>
      </div>
    );
  }

  return null;
}
