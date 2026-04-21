import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  console.log("[kakao-callback] hit:", Object.fromEntries(searchParams));

  const type = searchParams.get("type");
  const ticket_id = searchParams.get("ticket_id");
  const user_id = searchParams.get("user_id");

  if (type === "send" && ticket_id) {
    const { error } = await supabase
      .from("Ticket")
      .update({ status: "sent" })
      .eq("ticket_id", ticket_id)
      .eq("status", "created");

    if (error) console.error("[kakao-callback] ticket update error:", error);
  }

  if (type === "share" && user_id) {
    const { data: user, error: fetchError } = await supabase
      .from("User")
      .select("share_cnt, credits")
      .eq("id", user_id)
      .single();

    if (fetchError || !user) {
      console.error("[kakao-callback] user fetch error:", fetchError);
      return new NextResponse("OK", { status: 200 });
    }

    if (user.share_cnt < 4) {
      const { error } = await supabase
        .from("User")
        .update({
          share_cnt: user.share_cnt + 1,
          credits: user.credits + 1,
        })
        .eq("id", user_id);

      if (error) console.error("[kakao-callback] user update error:", error);
    }
  }

  return new NextResponse("OK", { status: 200 });
}
