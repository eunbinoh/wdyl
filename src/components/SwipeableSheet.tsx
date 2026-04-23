"use client";

import { forwardRef } from "react";
import { motion, useDragControls } from "framer-motion";
import styles from "./allComponents.module.css";

type Props = {
  onClose: () => void;
  children: React.ReactNode;
};

const SwipeableSheet = forwardRef<HTMLDivElement, Props>(function SwipeableSheet({ onClose, children }, ref) {
  const controls = useDragControls();

  return (
    <motion.div
      ref={ref}
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
    >
      <div
        className={styles["modal-handle"]}
        onPointerDown={(e) => controls.start(e)}
        style={{ cursor: "grab", touchAction: "none" }}
      />
      {children}
    </motion.div>
  );
});

export default SwipeableSheet;
