import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { refreshKakaoAccessToken } from "@/lib/kakaoServer";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const TALK_MESSAGE_SCOPE = "talk_message";

type KakaoScope = {
  id?: string;
  agreed?: boolean;
};

export async function GET() {
  try {
    const cookieStore = await cookies();
    const authClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ hasConsent: false, reason: "unauthorized" }, { status: 401 });
    }

    const adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const { data: profile, error: profileError } = await adminClient
      .from("User")
      .select("kakao_refresh_token")
      .eq("id", user.id)
      .single();

    if (profileError || !profile?.kakao_refresh_token) {
      return NextResponse.json({ hasConsent: false, reason: "token_not_found" });
    }

    let accessToken: string;
    let refreshToken: string | undefined;
    try {
      const tokens = await refreshKakaoAccessToken(profile.kakao_refresh_token);
      accessToken = tokens.accessToken;
      refreshToken = tokens.refreshToken;
    } catch (e) {
      console.error("[kakao/message-consent/status] refresh token expired:", e);
      return NextResponse.json({ hasConsent: false, reason: "token_expired" }, { status: 401 });
    }

    const params = new URLSearchParams({
      scopes: JSON.stringify([TALK_MESSAGE_SCOPE]),
    });

    const kakaoResponse = await fetch(`https://kapi.kakao.com/v2/user/scopes?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      cache: "no-store",
    });

    const kakaoData = await kakaoResponse.json().catch(() => null);

    if (!kakaoResponse.ok) {
      console.error("[kakao/message-consent/status] scope check failed:", kakaoData);
      return NextResponse.json({
        hasConsent: false,
        reason: "scope_check_failed",
        detail: kakaoData,
      });
    }

    const talkMessageScope = (kakaoData?.scopes as KakaoScope[] | undefined)?.find(
      (scope) => scope.id === TALK_MESSAGE_SCOPE
    );

    return NextResponse.json({
      hasConsent: talkMessageScope?.agreed === true,
      reason: talkMessageScope?.agreed === true ? null : "scope_not_agreed",
    });
  } catch (e) {
    console.error("[kakao/message-consent/status] server error:", e);
    return NextResponse.json({ hasConsent: false, reason: "server_error" }, { status: 500 });
  }
}
