import React from "react";

export const THEME_STYLE: Record<
  string,
  { bg: string; accent: string; text: string; subText: string; cardBg: string; btnText: string; font: string }
> = {
  MOOD: {
    bg: "#FFF8F0",
    accent: "#F4845F",
    text: "#3D2010",
    subText: "#B07050",
    cardBg: "#FFFFFF",
    btnText: "#FFFFFF",
    font: "inherit",
  },
  LUCK: {
    bg: "#FFFBF0",
    accent: "#E8AC30",
    text: "#3D2E00",
    subText: "#B09040",
    cardBg: "#FFFFFF",
    btnText: "#FFFFFF",
    font: "inherit",
  },
  PERSONA: {
    bg: "#EDE9F8",
    accent: "#7C5CBF",
    text: "#2D1F5E",
    subText: "#9B8EC4",
    cardBg: "#FFFFFF",
    btnText: "#FFFFFF",
    font: "inherit",
  },
  FAVORITE: {
    bg: "#1C1C1C",
    accent: "#FFFFFF",
    text: "#FFFFFF",
    subText: "#888",
    cardBg: "#2A2A2A",
    btnText: "#000000",
    font: "inherit",
  },
  SURVIVAL: {
    bg: "#F0F8F2",
    accent: "#3DAA6B",
    text: "#0D3320",
    subText: "#6BA080",
    cardBg: "#FFFFFF",
    btnText: "#FFFFFF",
    font: "inherit",
  },
};

export const THEME_EMOJI: Record<string, string> = {
  MOOD: "🌿",
  LUCK: "🍀",
  PERSONA: "🎭",
  FAVORITE: "📊",
  SURVIVAL: "⚔️",
};

export const MEDAL = ["🥇", "🥈", "🥉"];
export const MEDAL_LABEL = ["1순위", "2순위", "3순위"];
export const MEDAL_COLOR = ["#F9B233", "#94a3b8", "#cd7f32"];

export type ThemeStyle = (typeof THEME_STYLE)[string];

export function getTs(theme: string): ThemeStyle {
  return THEME_STYLE[theme] ?? THEME_STYLE.MOOD;
}

export function makeStyles(ts: ThemeStyle) {
  return {
    page: {
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
    },
    card: {
      background: ts.cardBg,
      borderRadius: 20,
      padding: "24px 20px",
      width: "100%",
      maxWidth: 420,
    },
    accentBtn: {
      background: ts.accent,
      color: ts.btnText,
      border: "none",
      borderRadius: 14,
      padding: "15px 0",
      fontSize: 15,
      fontWeight: 700,
      cursor: "pointer",
      width: "100%",
    } as React.CSSProperties,
    backBtn: {
      background: ts.cardBg,
      color: ts.accent,
      border: `1.5px solid ${ts.accent}30`,
      borderRadius: 14,
      padding: "15px 0",
      fontSize: 15,
      fontWeight: 700,
      cursor: "pointer",
      width: "100%",
    } as React.CSSProperties,
  };
}

