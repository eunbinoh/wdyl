"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TYPING_TEXT = "네가 뭘 좋아할지 몰라서 준비했어";
const ACCENT_COLOR = "#F9B233";
const SPEED_MS = 85;
const ACCENT_DELAY_MS = 1000;

const SWAP: Record<number, string> = { 0: "너", 3: "멀", 5: "조", 10: "몰" };
const ACCENT_IDX = new Set(Object.keys(SWAP).map(Number));

export default function TypingSubtitle() {
  const [count, setCount] = useState(0);
  const [swapped, setSwapped] = useState(false);
  const done = count >= TYPING_TEXT.length;

  useEffect(() => {
    if (done) return;
    const t = setTimeout(() => setCount((c) => c + 1), SPEED_MS);
    return () => clearTimeout(t);
  }, [count, done]);

  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setSwapped(true), ACCENT_DELAY_MS);
    return () => clearTimeout(t);
  }, [done]);

  return (
    <p className="text-lg text-gray-400">
      {TYPING_TEXT.slice(0, count)
        .split("")
        .map((char, i) => {
          if (!ACCENT_IDX.has(i)) {
            return (
              <span key={i} style={{ fontSize: "1.125rem" }}>
                {char}
              </span>
            );
          }

          return (
            <span
              key={i}
              style={{ display: "inline-block", position: "relative" }}
            >
              <AnimatePresence mode="wait">
                {swapped ? (
                  <motion.span
                    key="swapped"
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    style={{
                      display: "inline-block",
                      color: ACCENT_COLOR,
                      fontSize: "calc(1.125rem + 2px)",
                      fontWeight: 700,
                    }}
                  >
                    {SWAP[i]}
                  </motion.span>
                ) : (
                  <motion.span
                    key="original"
                    exit={{ opacity: 0, scale: 1.1 }}
                    transition={{ duration: 0.25, ease: "easeIn" }}
                    style={{
                      display: "inline-block",
                      color: ACCENT_COLOR,
                      fontSize: "1.125rem",
                    }}
                  >
                    {char}
                  </motion.span>
                )}
              </AnimatePresence>
            </span>
          );
        })}
      {!done && <span className="animate-pulse opacity-60">|</span>}
    </p>
  );
}
