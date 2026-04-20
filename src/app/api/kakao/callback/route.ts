import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  // 1. URL에서 ticket_id 추출 (req.query 대신 사용)
  const { searchParams } = new URL(request.url);
  const ticket_id = searchParams.get("ticket_id");
  const user_id = searchParams.get("user_id");
  const type = searchParams.get("type");

  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    }
  );

  if (type === "send" && ticket_id) {
    const ticket_id = searchParams.get("ticket_id");
    if (!ticket_id) return new NextResponse("Missing ticket_id", { status: 400 });

    await supabase.from("Ticket").update({ status: "sent" }).eq("id", ticket_id).eq("status", "created");

    return new NextResponse("OK", { status: 200 });
  }

  if (type === "share" && user_id) {
    const user_id = searchParams.get("user_id");
    if (!user_id) return new NextResponse("OK", { status: 200 });

    // 1. 유저의 현재 share_cnt 확인
    const { data: user, error: fetchError } = await supabase
      .from("User")
      .select("share_cnt, credits")
      .eq("id", user_id)
      .single();

    if (fetchError || !user) return new NextResponse("OK", { status: 200 });

    // 2. 공유 횟수가 3회 이하일 때만 업데이트 실행
    if (user.share_cnt < 4) {
      await supabase
        .from("User")
        .update({
          share_cnt: user.share_cnt + 1,
          credits: user.credits + 1,
        })
        .eq("id", user_id);
    }

    return new NextResponse("OK", { status: 200 });
  }

  return new NextResponse("OK", { status: 200 });
}
