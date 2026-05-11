import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { orderNo, amount, productDesc, credits, userId } = await req.json();

    if (!orderNo || !amount || !credits || !userId) {
      return NextResponse.json({ code: -1, message: "INVALID_PARAMS" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    // 결제 인텐트 사전 삽입 (webhook/success에서 orderNo로 lookup)
    const { error: insertError } = await supabase.from("Payment").insert({
      user_id: userId,
      order_id: orderNo,
      amount,
      credit: credits,
    });
    if (insertError) {
      console.error("Payment intent 저장 실패:", insertError);
      return NextResponse.json({ code: -1, message: "DB_ERROR", detail: insertError.message }, { status: 500 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!baseUrl || !process.env.TOSS_PAY_API_KEY) {
      console.error("환경변수 누락:", { baseUrl, hasApiKey: !!process.env.TOSS_PAY_API_KEY });
      return NextResponse.json({ code: -1, message: "ENV_MISSING" }, { status: 500 });
    }

    const response = await fetch("https://pay.toss.im/api/v2/payments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderNo,
        amount,
        amountTaxFree: 0,
        productDesc,
        apiKey: process.env.TOSS_PAY_API_KEY,
        autoExecute: true,
        resultCallback: `${baseUrl}/api/payments/callback`,
        callbackVersion: "V2",
        retUrl: `${baseUrl}/api/payments/success`,
        retCancelUrl: `${baseUrl}/api/payments/fail`,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ code: -1, message: "SERVER_ERROR" }, { status: 500 });
  }
}
