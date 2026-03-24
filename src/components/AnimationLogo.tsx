"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const WORDS = ["What", "Do", "You", "Like"] as const;
const COLOR = "#F9B233";
const FS = 60; // font-size px
const FS2 = 75; // font-size px (phase 2, WDYL 완성)
const CW = 300; // container width
const CH = 240; // container height
const UW: number[] = [48, 37, 35, 29]; // uppercase letter widths

// Phase 2 – WDYL 각 글자 x (컨테이너 기준, 가운데 정렬)
const SPACING_PER: number[] = [9, 6, 4, 5];
const SPACING_TOTAL = SPACING_PER.reduce((a, b) => a + b, 0);
const WDYL_TOTAL = UW.reduce((a, b) => a + b, 0) + SPACING_TOTAL + 16;
const WDYL_START = (CW - WDYL_TOTAL) / 2;
const WX: number[] = UW.map((_, i) =>
  i === 0
    ? WDYL_START
    : WDYL_START +
      UW.slice(0, i).reduce((a, b) => a + b, 0) +
      SPACING_PER.slice(0, i + 1).reduce((a, b) => a + b, 0),
);

// Phase 1 – 모든 글자가 모이는 위치 (W의 최종 x = WDYL_START)
const PX1 = WDYL_START;
const PY1 = (CH - FS) / 2;

// Phase 0 – 각 단어 위치
const PX0: number[] = WORDS.map(() => WDYL_START);
const PY0: number[] = WORDS.map(
  (_, i) => (CH - WORDS.length * FS) / 2 + i * FS,
);

const EASE: [number, number, number, number] = [0.4, 0, 0.2, 1];

export default function WdylAnimation() {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  const [shown, setShown] = useState<boolean[]>([false, false, false, false]);

  useEffect(() => {
    const ts: ReturnType<typeof setTimeout>[] = [];

    WORDS.forEach((_, i) => {
      ts.push(
        setTimeout(
          () => setShown((prev) => prev.map((v, j) => (j === i ? true : v))),
          i * 500,
        ),
      );
    });

    const collapseAt = (WORDS.length - 1) * 500 + 700; // 2200ms
    ts.push(setTimeout(() => setPhase(1), collapseAt));
    ts.push(setTimeout(() => setPhase(2), collapseAt + 600));

    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ display: "flex", justifyContent: "center", height: CH }}>
      <div style={{ position: "relative", width: CW, height: CH }}>
        {WORDS.map((word, i) => {
          const tx = phase === 0 ? PX0[i] : phase === 1 ? PX1 : WX[i];
          const ty = phase === 0 ? PY0[i] : PY1;
          const md = phase >= 1 ? 0.55 : 0;

          return (
            <motion.div
              key={i}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                display: "flex",
                alignItems: "baseline",
                whiteSpace: "nowrap",
                color: COLOR,
                fontSize: FS,
                fontWeight: 800,
                lineHeight: 1,
              }}
              initial={{ opacity: 0, x: PX0[i], y: PY0[i] }}
              animate={{ opacity: shown[i] ? 1 : 0, x: tx, y: ty }}
              transition={{
                opacity: { duration: 0.45, ease: "easeOut" },
                x: { duration: md, ease: EASE },
                y: { duration: md, ease: EASE },
              }}
            >
              <motion.span
                animate={
                  phase === 2
                    ? {
                        fontSize: FS2,
                        textShadow: "-3px 8px 10px rgba(0,0,0,0.25)",
                      }
                    : {
                        fontSize: FS,
                        textShadow: "0 0px 0px rgba(0,0,0,0)",
                      }
                }
                transition={{ duration: 0.5, ease: EASE }}
                style={{ display: "inline-block" }}
              >
                {word[0]}
              </motion.span>
              <motion.span
                initial={{ opacity: 0.8 }}
                animate={{ opacity: phase >= 1 ? 0 : 0.8 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
              >
                {word.slice(1)}
              </motion.span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
