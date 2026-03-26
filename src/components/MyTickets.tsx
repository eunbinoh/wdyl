"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Mails, MessageSquareMore, CalendarClock } from "lucide-react";
import { supabase } from "@/lib/supabase";
import styles from "./allComponents.module.css";
import TicketNewModal from "./TicketNewModal";
import TicketDetailModal from "./TicketDetailModal";
import { Ticket } from "@/types";

type Props = {
  userId: string;
  credits: number;
  tickets: Ticket[];
};

const STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  init: { label: "발송대기", color: "#64748b", bg: "#f1f5f9" },
  progress: { label: "진행중", color: "#16a34a", bg: "#f0fdf4" },
  complete: { label: "작성완료", color: "#0062CC", bg: "#eff6ff" },
  cancelled: { label: "회수완료", color: "#ef4444", bg: "#fef2f2" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${yy}-${mm}-${dd} ${hh}:${min}:${ss}`;
}

export default function MyTickets({ userId, credits, tickets }: Props) {
  const [showNewModal, setShowNewModal] = useState(false);
  const [showModalTicketId, setShowModalTicketId] = useState<string>("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const router = useRouter();

  const handleSend = async (ticketId: string, receiverName: string) => {
    const url = `${window.location.origin}/survey/${ticketId}`;
    const confirmed = confirm(`${receiverName}에게 링크를 발송하시겠어요?\n\n${url}`);
    if (!confirmed) return;
    try {
      await navigator.clipboard.writeText(url);
      alert("링크가 클립보드에 복사됐어요! 친구에게 보내주세요 🎁");
    } catch {
      alert(`링크를 직접 복사해주세요:\n${url}`);
    }
  };

  const handleCancel = async (ticketId: string) => {
    const confirmed = confirm("티켓을 회수하면 크레딧 1개가 환급돼요.\n정말 회수하시겠어요?");
    if (!confirmed) return;

    setCancellingId(ticketId);
    try {
      const { error: ticketError } = await supabase!
        .from("Ticket")
        .update({ status: "cancelled", deleted_yn: true })
        .eq("ticket_id", ticketId);

      if (ticketError) return alert("회수 중 오류가 발생했어요.");

      const { error: creditError } = await supabase!
        .from("User")
        .update({ credits: credits + 1 })
        .eq("id", userId);

      if (creditError) return alert("크레딧 환급 중 오류가 발생했어요.");

      router.refresh();
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className={styles["tickets-container"]}>
      <button
        className={styles["tickets-new-btn"]}
        onClick={() => setShowNewModal(true)}
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
        <div className={styles["tickets-empty"]}>아직 생성된 티켓이 없습니다.</div>
      ) : (
        <div className={styles["tickets-list"]}>
          {tickets.map((ticket) => {
            const status = STATUS_LABEL[ticket.status] ?? STATUS_LABEL["init"];
            return (
              <div
                key={ticket.ticket_id}
                className={styles["ticket-item"]}
                onClick={() => setShowModalTicketId(ticket.ticket_id)}
                style={{ cursor: "pointer" }}
              >
                <div className={styles["ticket-info"]}>
                  <div className={styles["ticket-badge"]}>
                    <span
                      className={styles["ticket-badge-dot"]}
                      style={{ backgroundColor: status.color }}
                    />
                    <span style={{ color: status.color }}>{status.label}</span>
                  </div>
                  <div className={styles["ticket-name"]}>
                    <Mails
                      size={14}
                      color={"#64748b"}
                    />{" "}
                    {ticket.receiver_name}
                  </div>
                  <div className={styles["ticket-comment"]}>
                    <MessageSquareMore size={14} /> {ticket.comment}
                  </div>
                  <div className={styles["ticket-date"]}>
                    <CalendarClock size={14} /> {formatDate(ticket.created_at)}
                  </div>
                </div>

                {/* 액션 버튼 */}
                <div className={styles["ticket-actions"]}>
                  {/* init: 발송하기 + 회수하기 */}
                  {ticket.status === "init" && (
                    <>
                      <button
                        className={`${styles["ticket-action-btn"]} ${styles["yellow"]}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSend(ticket.ticket_id, ticket.receiver_name);
                        }}
                      >
                        발송하기
                      </button>
                      <button
                        className={`${styles["ticket-action-btn"]} ${styles["gray"]}`}
                        disabled={cancellingId === ticket.ticket_id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCancel(ticket.ticket_id);
                        }}
                      >
                        {cancellingId === ticket.ticket_id ? "회수 중…" : "회수하기"}
                      </button>
                    </>
                  )}

                  {/* complete: 결과보기 */}
                  {ticket.status === "complete" && (
                    <button
                      className={`${styles["ticket-action-btn"]} ${styles["blue"]}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/survey/${ticket.ticket_id}/result`);
                      }}
                    >
                      결과보기
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showNewModal && (
        <TicketNewModal
          userId={userId}
          credits={credits}
          onClose={() => setShowNewModal(false)}
          onSuccess={() => {
            setShowNewModal(false);
            router.refresh();
          }}
        />
      )}
      {showModalTicketId && (
        <TicketDetailModal
          ticketId={showModalTicketId}
          onClose={() => setShowModalTicketId("")}
          onFetched={() => {
            setShowModalTicketId("");
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
