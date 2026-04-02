import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const paymentKey = searchParams.get("paymentKey");
  const orderId = searchParams.get("orderId");
  const amount = searchParams.get("amount");
  const userId = searchParams.get("userId");
  const credits = Number(searchParams.get("credits"));

  if (!paymentKey || !orderId || !amount || !credits || !userId) {
    return NextResponse.redirect(new URL("/main?payment=cancel", request.url));
  }
  // 토스 결제 승인
  const confirmRes = await fetch(`https://api.tosspayments.com/v1/payments/${paymentKey}`, {
    method: "GET",
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.TOSS_SECRET_KEY}:`).toString("base64")}`,
    },
  });

  if (!confirmRes.ok) {
    console.error("토스 승인 실패:", await confirmRes.text());
    return NextResponse.redirect(new URL("/main?payment=error", request.url));
  }

  // Supabase 크레딧 추가 + 결제 내역 저장
  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {},
    },
  });

  // 현재 크레딧 조회
  const { data: user } = await supabase.from("User").select("credits").eq("id", userId).single();

  const currentCredits = user?.credits ?? 0;

  // 크레딧 업데이트
  await supabase
    .from("User")
    .update({ credits: currentCredits + credits })
    .eq("id", userId);

  // 결제 내역 저장
  const { error: paymentError } = await supabase.from("Payment").insert({
    user_id: userId,
    order_id: orderId,
    amount: Number(amount),
    credit: credits,
    pay_id: paymentKey,
    paid_at: new Date().toISOString(),
  });
  if (paymentError) console.error("Payment insert 에러:", paymentError);

  return NextResponse.redirect(new URL("/main?payment=success", request.url));
}
