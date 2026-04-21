"use client";

import { useEffect, useState } from "react";
import { Mails, MessageSquareMore, CalendarClock, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Status, Ticket } from "@/types";
import styles from "./allComponents.module.css";
import TicketNewModal from "./TicketNewModal";
import TicketDetailModal from "./TicketDetailModal";
import TicketResultModal from "./TicketResultModal";
import TicketSendModal from "./TicketSendModal";

type Props = {
  userId: string;
  credits: number;
};

const STATUS_LABEL: Record<Status, { label: string; color: string; bg: string }> = {
  created: { label: "발송대기", color: "#64748b", bg: "#f1f5f9" },
  sent: { label: "발송완료", color: "#64748b", bg: "#f1f5f9" },
  progress: { label: "참여중", color: "#16a34a", bg: "#f0fdf4" },
  complete: { label: "참여완료", color: "#0062CC", bg: "#eff6ff" },
  cancelled: { label: "발송취소", color: "#ef4444", bg: "#fef2f2" },
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

export default function MyTickets({ userId, credits }: Props) {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [showModalTicketId, setShowModalTicketId] = useState<string>("");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [resultTicket, setResultTicket] = useState<Ticket | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [totalTickets, setTotalTickets] = useState(0);
  const [loadingAll, setLoadingAll] = useState(false);
  const visibleTickets = showAll ? tickets : tickets.slice(0, 10);
  const [resendTicket, setResendTicket] = useState<Ticket | null>(null);

  const router = useRouter();

  const getTickets = async (limit?: number) => {
    const { data, count } = await supabase!
      .from("Ticket")
      .select("ticket_id, receiver_name, comment, theme, status, created_at, result", { count: "exact" })
      .eq("user_id", userId)
      .eq("deleted_yn", false)
      .order("created_at", { ascending: false })
      .limit(limit ?? 99);

    setTickets(data ?? []);
    setTotalTickets(count ?? 0);
  };

  useEffect(() => {
    getTickets(10);

    const handleFocus = () => {
      getTickets(10);
      router.refresh();
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

  const handleKakaoSend = (ticketId: string, receiverName: string) => {
    const surveyUrl = `https://wdyl.vercel.app/survey/${ticketId}`;
    if (!window.Kakao) {
      return;
    }
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }
    window.Kakao.Share.sendDefault({
      objectType: "text",
      text: `${receiverName}님, 취향을 분석해드려요🎁`,
      link: {
        mobileWebUrl: surveyUrl,
        webUrl: surveyUrl,
      },
      serverCallbackArgs: {
        type: "send",
        ticket_id: ticketId,
      },
    });
  };

  const handleShowAll = async () => {
    setShowAll((prev) => !prev);
    setLoadingAll(true);
    await getTickets(showAll ? 10 : undefined);

    setLoadingAll(false);
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

      await getTickets(10);
      router.refresh();
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className={styles["tickets-container"]}>
      <button
        className={styles["tickets-new-btn"]}
        onClick={() => {
          if (credits < 1) {
            return alert("크레딧이 부족해요. 충전 후 이용해주세요.");
          } else {
            setShowNewModal(true);
          }
        }}
      >
        NEW 티켓 만들기
      </button>

      <div className={styles["tickets-header"]}>
        <span className={styles["tickets-header-title"]}>생성된 티켓</span>
        <span className={"text-xs text-slate-500 mr-2 mt-1"}>TOTAL {totalTickets}</span>
      </div>

      {tickets.length === 0 ? (
        <div className={styles["tickets-empty"]}>아직 생성된 티켓이 없습니다.</div>
      ) : (
        <div className={styles["tickets-list"]}>
          {visibleTickets.map((ticket, index) => {
            const status = STATUS_LABEL[ticket.status] ?? STATUS_LABEL["created"];
            return (
              <div key={ticket.ticket_id}>
                <div
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
                      <CalendarClock size={14} /> {formatDate(ticket.created_at ?? "")}
                    </div>
                  </div>

                  {/* 액션 버튼 */}
                  <div className={styles["ticket-actions"]}>
                    {/* created: 발송하기 + 회수하기 */}
                    {(ticket.status === "created" || ticket.status === "sent") && (
                      <>
                        <button
                          className={`${styles["ticket-action-btn"]} ${ticket.status === "created" ? styles["yellow"] : styles["green"]}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            ticket.status === "created"
                              ? handleKakaoSend(ticket.ticket_id, ticket.receiver_name)
                              : setResendTicket(ticket);
                          }}
                        >
                          {ticket.status === "created" ? "발송하기" : "재발송"}
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
                          setResultTicket(ticket);
                        }}
                      >
                        결과보기
                      </button>
                    )}
                  </div>
                </div>
                {totalTickets > 10 && index === tickets.length - 1 && (
                  <span
                    className={styles["tickets-header-more"]}
                    onClick={handleShowAll}
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      padding: "12px 0",
                      cursor: "pointer",
                    }}
                  >
                    {showAll ? "접기" : "더보기"}{" "}
                    <ChevronDown
                      size={14}
                      style={{ transform: showAll ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}
                    />
                  </span>
                )}
              </div>
            );
          })}
          {resultTicket && (
            <TicketResultModal
              ticketId={resultTicket.ticket_id}
              receiverName={resultTicket.receiver_name}
              onClose={() => setResultTicket(null)}
            />
          )}
          {resendTicket && (
            <TicketSendModal
              ticketId={resendTicket.ticket_id}
              receiverName={resendTicket.receiver_name}
              onClose={() => setResendTicket(null)}
            />
          )}
        </div>
      )}

      {showNewModal && (
        <TicketNewModal
          userId={userId}
          credits={credits}
          onClose={() => setShowNewModal(false)}
          onSuccess={() => {
            setShowNewModal(false);
            getTickets(10);
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
            getTickets(10);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
