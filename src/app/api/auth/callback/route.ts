import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

function getNickname(userMetadata: Record<string, unknown>) {
  return (
    (typeof userMetadata.name === "string" && userMetadata.name) ||
    (typeof userMetadata.nickname === "string" && userMetadata.nickname) ||
    (typeof userMetadata.full_name === "string" && userMetadata.full_name) ||
    "USER"
  );
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/main";

  if (code) {
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

    const {
      data: { session, user },
      error,
    } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      if (user) {
        const adminClient = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!,
          {
            auth: { persistSession: false, autoRefreshToken: false },
          }
        );

        const { data: profile, error: profileError } = await adminClient
          .from("User")
          .select("id")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          console.error("[auth/callback] User profile fetch error:", profileError);
          await supabase.auth.signOut();
          return NextResponse.redirect(`${origin}/login?error=auth`);
        }

        if (!profile) {
          const { error: insertError } = await adminClient.from("User").insert({
            id: user.id,
            email: user.email ?? "",
            nickname: getNickname(user.user_metadata),
            credits: 0,
            share_cnt: 0,
          });

          if (insertError) {
            console.error("[auth/callback] User profile insert error:", insertError);
            await supabase.auth.signOut();
            return NextResponse.redirect(`${origin}/login?error=auth`);
          }
        }

        if (session?.provider_refresh_token) {
          const { error: tokenError } = await adminClient
            .from("User")
            .update({
              kakao_refresh_token: session.provider_refresh_token,
            })
            .eq("id", user.id);

          if (tokenError) {
            console.error("[auth/callback] Kakao refresh token update error:", tokenError);
          }
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }

    console.error("exchangeCodeForSession 에러:", error);
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
