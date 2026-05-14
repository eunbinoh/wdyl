import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ code: -1, message: "INVALID_PARAMS" }, { status: 400 });
    }

    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: payment, error: fetchError } = await supabase
      .from("Payment")
      .select("pay_id, available_cnt")
      .eq("user_id", userId)
      .or("status.is.null,status.not.in.(refund_req,refund_done,use_done)")
      .not("pay_id", "is", null)
      .order("paid_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (fetchError) {
      console.error("restore Payment 조회 실패:", fetchError);
      return NextResponse.json({ code: -1, message: "DB_ERROR", detail: fetchError.message }, { status: 500 });
    }

    if (!payment) {
      return NextResponse.json({ code: 0 });
    }

    const nextAvailable = (payment.available_cnt ?? 0) + 1;

    const { error: updateError } = await supabase
      .from("Payment")
      .update({ available_cnt: nextAvailable })
      .eq("pay_id", payment.pay_id);

    if (updateError) {
      console.error("restore Payment 업데이트 실패:", updateError);
      return NextResponse.json({ code: -1, message: "DB_ERROR", detail: updateError.message }, { status: 500 });
    }

    return NextResponse.json({ code: 0, pay_id: payment.pay_id, available_cnt: nextAvailable });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ code: -1, message: "SERVER_ERROR" }, { status: 500 });
  }
}
