import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

export async function POST(req: NextRequest) {
  try {
    const { userId, refId } = await req.json();

    if (!userId || !refId) {
      return NextResponse.json({ code: -1, message: "INVALID_PARAMS" }, { status: 400 });
    }

    if (userId === refId) {
      return NextResponse.json({ code: -1, message: "SELF_REFERRAL" }, { status: 400 });
    }

    // 가입자 조회 — 이미 ref_id 가 있으면 중복 적용 방지
    const { data: invitee, error: inviteeError } = await supabase
      .from("User")
      .select("id, ref_id")
      .eq("id", userId)
      .single();

    if (inviteeError || !invitee) {
      console.error("[referral/apply] invitee fetch error:", inviteeError);
      return NextResponse.json({ code: -1, message: "INVITEE_NOT_FOUND" }, { status: 404 });
    }

    if (invitee.ref_id) {
      return NextResponse.json({ code: 0, message: "ALREADY_APPLIED" });
    }

    // 추천인 조회
    const { data: referrer, error: referrerError } = await supabase
      .from("User")
      .select("id, share_cnt, credits")
      .eq("id", refId)
      .single();

    if (referrerError || !referrer) {
      console.error("[referral/apply] referrer fetch error:", referrerError);
      return NextResponse.json({ code: -1, message: "REFERRER_NOT_FOUND" }, { status: 404 });
    }

    // 가입자에 ref_id 기록
    const { error: setRefError } = await supabase.from("User").update({ ref_id: refId }).eq("id", userId);

    if (setRefError) {
      console.error("[referral/apply] set ref_id error:", setRefError);
      return NextResponse.json({ code: -1, message: "DB_ERROR", detail: setRefError.message }, { status: 500 });
    }

    // 추천인 share_cnt +1, share_cnt < 3 인 경우에만 credit +1
    const currentShareCnt = referrer.share_cnt ?? 0;
    const currentCredits = referrer.credits ?? 0;
    const { error: rewardError } = await supabase
      .from("User")
      .update({
        share_cnt: currentShareCnt + 1,
        credits: currentShareCnt < 3 ? currentCredits + 1 : currentCredits,
      })
      .eq("id", refId);

    if (rewardError) {
      console.error("[referral/apply] reward update error:", rewardError);
      return NextResponse.json({ code: -1, message: "DB_ERROR", detail: rewardError.message }, { status: 500 });
    }

    return NextResponse.json({ code: 0 });
  } catch (e) {
    console.error("[referral/apply] server error:", e);
    return NextResponse.json({ code: -1, message: "SERVER_ERROR" }, { status: 500 });
  }
}
