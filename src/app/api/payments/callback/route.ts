import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function parseTossKSTPaidTs(paidTs: string | undefined): string {
  if (!paidTs) return new Date().toISOString();
  return new Date(paidTs.replace(" ", "T") + "+09:00").toISOString();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { status, payToken, orderNo, transactionId, amount, paidTs } = body;

    if (status !== "PAY_COMPLETE" || !orderNo || !payToken) {
      return NextResponse.json({ code: -1, message: "INVALID_PAYLOAD" }, { status: 400 });
    }

    // 위변조 방지: status API 재확인
    const statusRes = await fetch("https://pay.toss.im/api/v2/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: process.env.TOSS_PAY_API_KEY,
        payToken,
      }),
    });
    const statusData = await statusRes.json();
    if (statusData.code !== 0 || statusData.payStatus !== "PAY_COMPLETE") {
      console.error("webhook status 불일치:", statusData);
      return NextResponse.json({ code: -1, message: "STATUS_MISMATCH" }, { status: 400 });
    }
    if (Number(statusData.amount) !== Number(amount)) {
      console.error("webhook 금액 불일치:", { webhook: amount, status: statusData.amount });
      return NextResponse.json({ code: -1, message: "AMOUNT_MISMATCH" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    });

    // 멱등 업데이트: pay_id가 null일 때만 처리 → 동시 처리 시 1회만 적용
    const { data: updatedRows, error: updateError } = await supabase
      .from("Payment")
      .update({
        pay_id: transactionId ?? payToken,
        paid_at: parseTossKSTPaidTs(paidTs),
      })
      .eq("order_id", orderNo)
      .is("pay_id", null)
      .select();

    if (updateError) {
      console.error("Payment update 에러:", updateError);
      return NextResponse.json({ code: -1, message: "DB_ERROR" }, { status: 500 });
    }

    if (!updatedRows || updatedRows.length === 0) {
      // success route가 이미 처리한 케이스
      return NextResponse.json({ code: 0, message: "ALREADY_PROCESSED" });
    }

    const payment = updatedRows[0];

    await supabase
      .from("Payment")
      .update({ available_cnt: payment.credit })
      .eq("pay_id", payment.pay_id);

    const { data: user } = await supabase.from("User").select("credits").eq("id", payment.user_id).single();
    const currentCredits = user?.credits ?? 0;
    await supabase
      .from("User")
      .update({ credits: currentCredits + payment.credit })
      .eq("id", payment.user_id);

    return NextResponse.json({ code: 0 });
  } catch (e) {
    console.error("webhook 처리 실패:", e);
    return NextResponse.json({ code: -1, message: "SERVER_ERROR" }, { status: 500 });
  }
}
