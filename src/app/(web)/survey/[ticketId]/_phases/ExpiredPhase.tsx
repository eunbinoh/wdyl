import React from "react";
import { ThemeStyle } from "../_styles";

export function ExpiredPhase({ ts, pageStyle }: { ts: ThemeStyle; pageStyle: React.CSSProperties }) {
  return (
    <div style={pageStyle}>
      <div style={{ fontSize: 40, marginBottom: 20 }}>🔒</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: ts.text, marginBottom: 8, textAlign: "center" }}>
        이미 사용된 티켓이에요
      </div>
      <div style={{ fontSize: 14, color: ts.subText, textAlign: "center" }}>
        이 설문 링크는 더 이상 사용할 수 없어요.
      </div>
    </div>
  );
}
