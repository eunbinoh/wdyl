import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const formatPaidAt = (dateStr: string): string => {
  const d = new Date(dateStr);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yy}-${mm}-${dd} ${hh}:${min}`;
};

async function sendTelegramAlert(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text }),
    });
    if (!res.ok) {
      console.error("Telegram 알림 전송 실패:", await res.text());
    }
  } catch (e) {
    console.error("Telegram 알림 전송 예외:", e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, payIds } = await req.json();

    if (!userId || !Array.isArray(payIds) || payIds.length === 0) {
      return NextResponse.json({ code: -1, message: "INVALID_PARAMS" }, { status: 400 });
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: payments, error: fetchError } = await supabase
      .from("Payment")
      .select("pay_id, amount, credit, paid_at")
      .eq("user_id", userId)
      .in("pay_id", payIds);

    if (fetchError) {
      console.error("환불 요청 결제 조회 실패:", fetchError);
      return NextResponse.json({ code: -1, message: "DB_ERROR", detail: fetchError.message }, { status: 500 });
    }

    const { data: updated, error: updateError } = await supabase
      .from("Payment")
      .update({ status: "refund_req" })
      .eq("user_id", userId)
      .in("pay_id", payIds)
      .select("pay_id");

    if (updateError) {
      console.error("환불 요청 status 업데이트 실패:", updateError);
      return NextResponse.json({ code: -1, message: "DB_ERROR", detail: updateError.message }, { status: 500 });
    }

    if (!updated || updated.length === 0) {
      console.error("환불 요청 업데이트 0행 (RLS 또는 매칭 실패):", { userId, payIds });
      return NextResponse.json({ code: -1, message: "NO_ROWS_UPDATED" }, { status: 500 });
    }

    const rows = payments ?? [];
    const totalAmount = rows.reduce((s, p) => s + (p.amount ?? 0), 0);
    const totalCredit = rows.reduce((s, p) => s + (p.credit ?? 0), 0);
    const itemLines = rows
      .map(
        (p, i) =>
          `${i + 1}. ${p.pay_id} / ${(p.amount ?? 0).toLocaleString()}원 / ${p.credit}크레딧 / ${formatPaidAt(p.paid_at)}`
      )
      .join("\n");

    const text = [
      `[WDYL] 크레딧 환불 요청`,
      ``,
      `사용자 ID: ${userId}`,
      `요청 건수: ${rows.length}건`,
      `요청 크레딧: ${totalCredit}`,
      `요청 총액: ${totalAmount.toLocaleString()}원`,
      ``,
      `[내역]`,
      itemLines,
    ].join("\n");

    await sendTelegramAlert(text);

    return NextResponse.json({ code: 0 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ code: -1, message: "SERVER_ERROR" }, { status: 500 });
  }
}
