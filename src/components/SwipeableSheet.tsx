"use client";

import { forwardRef } from "react";
import { motion, useDragControls, useAnimationControls } from "framer-motion";
import styles from "./allComponents.module.css";
import { Status } from "@/types";

type Props = {
  onClose: () => void;
  title: string;
  status?: Status;
  children: React.ReactNode;
  scrollable?: boolean;
};

const STATUS_LABEL: Record<Status, string> = {
  complete: "참여완료",
  progress: "참여중",
  sent: "발송완료",
  created: "발송대기",
  cancelled: "발송취소",
};

const SwipeableSheet = forwardRef<HTMLDivElement, Props>(function SwipeableSheet(
  { onClose, title, status, children, scrollable = false },
  ref
) {
  const controls = useDragControls();
  const animation = useAnimationControls();

  const closeWithSlide = async () => {
    await animation.start({
      y: "100%",
      transition: { duration: 0.2, ease: "easeOut" },
    });
    onClose();
  };

  return (
    <motion.div
      ref={ref}
      className={styles["modal-sheet"]}
      drag="y"
      dragControls={controls}
      dragListener={false}
      dragConstraints={{ top: 0 }}
      dragElastic={{ top: 0, bottom: 0.2 }}
      animate={animation}
      onDragEnd={(_, info) => {
        if (info.offset.y > 100 || info.velocity.y > 500) {
          closeWithSlide();
        }
      }}
    >
      <div
        className={styles["modal-drag-area"]}
        onPointerDown={(e) => controls.start(e)}
        style={{ touchAction: "none" }}
      >
        <div className={styles["modal-handle"]} />
        <div className={styles["modal-header"]}>
          <div className={styles["modal-title"]}>{title}</div>
          {status && <div className={`${styles["modal-status-badge"]} ${styles[status]}`}>{STATUS_LABEL[status]}</div>}
        </div>
      </div>

      {scrollable ? (
        <div className={styles["modal-sheet-scroll"]}>{children}</div>
      ) : (
        <div className={styles["modal-sheet-body"]}>{children}</div>
      )}
    </motion.div>
  );
});

export default SwipeableSheet;
