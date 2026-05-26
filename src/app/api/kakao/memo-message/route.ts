import { createClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { refreshKakaoAccessToken } from "@/lib/kakaoServer";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: { persistSession: false },
});

export async function POST(request: NextRequest) {
  try {
    const { ticketId } = await request.json();

    if (typeof ticketId !== "string") {
      return NextResponse.json({ error: "invalid_request" }, { status: 400 });
    }

    const { data: ticket, error: ticketError } = await supabase
      .from("Ticket")
      .select("user_id")
      .eq("ticket_id", ticketId)
      .single();

    if (ticketError || !ticket?.user_id) {
      console.error("[kakao/memo-message] ticket fetch error:", ticketError);
      return NextResponse.json({ error: "ticket_not_found" }, { status: 404 });
    }

    const { data: sender, error: senderError } = await supabase
      .from("User")
      .select("kakao_refresh_token")
      .eq("id", ticket.user_id)
      .single();

    if (senderError || !sender?.kakao_refresh_token) {
      console.error("[kakao/memo-message] sender refresh token fetch error:", senderError);
      return NextResponse.json({ error: "sender_kakao_refresh_token_not_found" }, { status: 409 });
    }

    const { accessToken, refreshToken } = await refreshKakaoAccessToken(sender.kakao_refresh_token);

    if (refreshToken) {
      const { error: refreshTokenError } = await supabase
        .from("User")
        .update({ kakao_refresh_token: refreshToken })
        .eq("id", ticket.user_id);

      if (refreshTokenError) {
        console.error("[kakao/memo-message] refresh token update error:", refreshTokenError);
      }
    }

    const body = new URLSearchParams({
      template_id: "133400",
      template_args: JSON.stringify({
        ticket: ticketId,
      }),
    });

    const response = await fetch("https://kapi.kakao.com/v2/api/talk/memo/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
      body,
    });
    const result = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("[kakao/memo-message] send failed:", result);
      return NextResponse.json({ error: "kakao_send_failed", detail: result }, { status: response.status });
    }

    return NextResponse.json(result);
  } catch (e) {
    console.error("[kakao/memo-message] server error:", e);
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}
