"use client";

import { forwardRef, useRef } from "react";
import { motion, useDragControls } from "framer-motion";
import styles from "./allComponents.module.css";

type Props = {
  onClose: () => void;
  children: React.ReactNode;
};

const SwipeableSheet = forwardRef<HTMLDivElement, Props>(function SwipeableSheet({ onClose, children }, ref) {
  const controls = useDragControls();
  const innerRef = useRef<HTMLDivElement | null>(null);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // 스크롤이 최상단일 때만 드래그 시작 (스크롤 중일 땐 일반 스크롤 유지)
    if (innerRef.current && innerRef.current.scrollTop === 0) {
      controls.start(e);
    }
  };

  return (
    <motion.div
      ref={(node) => {
        innerRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
      }}
      className={styles["modal-sheet"]}
      drag="y"
      dragControls={controls}
      dragListener={false}
      dragConstraints={{ top: 0 }}
      dragElastic={{ top: 0, bottom: 0.2 }}
      onDragEnd={(_, info) => {
        if (info.offset.y > 100 || info.velocity.y > 500) {
          onClose();
        }
      }}
      onPointerDown={handlePointerDown}
    >
      <div className={styles["modal-handle"]} />
      {children}
    </motion.div>
  );
});

export default SwipeableSheet;
