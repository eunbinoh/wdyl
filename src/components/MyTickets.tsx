"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import CreateTicketModal from "./ModalCreateTicket";
import styles from "./components.module.css";

type Ticket = {
  id: string;
  status: "init" | "progress" | "complete" | "cancelled";
  to_name: string;
  theme: string;
  created_at: string;
};
type Props = {
  credits: number;
  tickets: Ticket[];
  userId: string;
};

const STATUS_LABEL: Record<
  string,
  { label: string; color: string; bg: string }
> = {
  init: { label: "전송 대기", color: "#64748b", bg: "#f1f5f9" },
  progress: { label: "진행중", color: "#F9B233", bg: "#fff7ed" },
  complete: { label: "완료", color: "#0062CC", bg: "#eff6ff" },
  cancelled: { label: "취소됨", color: "#ef4444", bg: "#fef2f2" },
};

export default function MyTickets({ userId, credits, tickets }: Props) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  return (
    <div className={styles["tickets-container"]}>
      <button
        className={styles["tickets-new-btn"]}
        onClick={() => setShowModal(true)}
      >
        NEW 티켓 만들기
      </button>

      <div className={styles["tickets-header"]}>
        <span className={styles["tickets-header-title"]}>최근 티켓</span>
        <span className={styles["tickets-header-more"]}>
          전체보기 <ChevronRight size={14} />
        </span>
      </div>

      {tickets.length === 0 ? (
        <div className={styles["tickets-empty"]}>
          아직 생성된 티켓이 없습니다.
        </div>
      ) : (
        <div className={styles["tickets-list"]}>
          {tickets.map((ticket) => {
            const status = STATUS_LABEL[ticket.status];
            return (
              <div key={ticket.id} className={styles["ticket-item"]}>
                <div className={styles["ticket-icon"]}></div>
                <div className={styles["ticket-info"]}>
                  <div className={styles["ticket-name"]}>{ticket.to_name}</div>
                  <div className={styles["ticket-date"]}>
                    {new Date(ticket.created_at).toLocaleDateString("ko-KR")}
                  </div>
                </div>
                <div
                  className={styles["ticket-badge"]}
                  style={{ color: status.color, background: status.bg }}
                >
                  {status.label}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <CreateTicketModal
          userId={userId}
          credits={credits}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
