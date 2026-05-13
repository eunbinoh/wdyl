import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, payIds } = await req.json();

    if (!userId || !Array.isArray(payIds) || payIds.length === 0) {
      return NextResponse.json({ code: -1, message: "INVALID_PARAMS" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    });

    const { error: updateError } = await supabase
      .from("Payment")
      .update({ status: "refund_req" })
      .eq("user_id", userId)
      .in("pay_id", payIds);

    if (updateError) {
      console.error("환불 요청 status 업데이트 실패:", updateError);
      return NextResponse.json({ code: -1, message: "DB_ERROR", detail: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ code: 0 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ code: -1, message: "SERVER_ERROR" }, { status: 500 });
  }
}
