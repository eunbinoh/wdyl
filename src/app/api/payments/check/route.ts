import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function parseTossKSTPaidTs(paidTs: string | undefined): string {
  if (!paidTs) return new Date().toISOString();
  return new Date(paidTs.replace(" ", "T") + "+09:00").toISOString();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderNo = searchParams.get("orderNo");

  if (!orderNo) {
    return NextResponse.json({ paid: false }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {},
    },
  });

  // 1) DB에서 이미 처리된 결제인지 즉시 확인
  const { data: existing } = await supabase.from("Payment").select("pay_id").eq("order_id", orderNo).maybeSingle();

  if (existing?.pay_id) {
    return NextResponse.json({ paid: true });
  }

  // 2) 미처리 상태면 토스 status API로 직접 검증 (webhook 지연 대응)
  try {
    const statusRes = await fetch("https://pay.toss.im/api/v2/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        apiKey: process.env.TOSS_PAY_API_KEY,
        orderNo,
      }),
    });
    const statusData = await statusRes.json();

    if (statusData.code !== 0 || statusData.payStatus !== "PAY_COMPLETE") {
      return NextResponse.json({ paid: false });
    }

    // 3) 토스가 완료 상태로 응답하면 webhook 처리
    const transactionId = statusData.transactions?.[0]?.transactionId ?? statusData.payToken ?? orderNo;
    const { data: updatedRows } = await supabase
      .from("Payment")
      .update({
        pay_id: transactionId,
        paid_at: parseTossKSTPaidTs(statusData.paidTs),
      })
      .eq("order_id", orderNo)
      .is("pay_id", null)
      .select();

    if (updatedRows && updatedRows.length > 0) {
      const payment = updatedRows[0];
      const { data: user } = await supabase.from("User").select("credits").eq("id", payment.user_id).single();
      const currentCredits = user?.credits ?? 0;
      await supabase
        .from("User")
        .update({ credits: currentCredits + payment.credit })
        .eq("id", payment.user_id);
    }

    return NextResponse.json({ paid: true });
  } catch (e) {
    console.error("check 엔드포인트 토스 status 호출 실패:", e);
    return NextResponse.json({ paid: false });
  }
}
