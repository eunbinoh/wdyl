import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function parseTossKSTPaidTs(paidTs: string | undefined): string {
  if (!paidTs) return new Date().toISOString();
  return new Date(paidTs.replace(" ", "T") + "+09:00").toISOString();
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const payToken = searchParams.get("payToken");
  const orderNo = searchParams.get("orderNo");

  if (!payToken || !orderNo) {
    console.error("토스페이 콜백 파라미터 누락:", Object.fromEntries(searchParams));
    return NextResponse.redirect(new URL("/main?payment=cancel", request.url));
  }

  // 토스페이 v2 결제 상태 검증
  const statusRes = await fetch("https://pay.toss.im/api/v2/status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      apiKey: process.env.TOSS_PAY_API_KEY,
      payToken,
    }),
  });

  if (!statusRes.ok) {
    console.error("토스페이 상태 확인 실패:", await statusRes.text());
    return NextResponse.redirect(new URL("/main?payment=error", request.url));
  }

  const statusData = await statusRes.json();

  if (statusData.code !== 0 || statusData.payStatus !== "PAY_COMPLETE") {
    console.error("토스페이 결제 미완료:", statusData);
    return NextResponse.redirect(new URL("/main?payment=error", request.url));
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {},
    },
  });

  const transactionId = statusData.transactions?.[0]?.transactionId ?? payToken;

  // 멱등 업데이트: pay_id가 null일 때만 처리 (webhook과 동시 실행 시 1회만 적용)
  const { data: updatedRows, error: updateError } = await supabase
    .from("Payment")
    .update({
      pay_id: transactionId,
      paid_at: parseTossKSTPaidTs(statusData.paidTs),
    })
    .eq("order_id", orderNo)
    .is("pay_id", null)
    .select();

  if (updateError) {
    console.error("Payment update 에러:", updateError);
    return NextResponse.redirect(new URL("/main?payment=error", request.url));
  }

  // updatedRows가 비어있으면 webhook이 이미 처리한 것 → 그래도 success 페이지로
  if (updatedRows && updatedRows.length > 0) {
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
  }

  return NextResponse.redirect(new URL("/main?payment=success", request.url));
}
