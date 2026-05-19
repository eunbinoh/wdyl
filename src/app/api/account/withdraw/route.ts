import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type SupabaseResult = {
  error: { message?: string } | null;
};

async function withRetry<T extends SupabaseResult>(operation: () => PromiseLike<T>, label: string, retries = 2): Promise<T> {
  let lastError: unknown;
  let lastResult: T | null = null;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      const result = await operation();
      if (!result.error) return result;

      lastResult = result;
      console.error(`[account/withdraw] ${label} failed:`, result.error);
    } catch (error) {
      lastError = error;
      console.error(`[account/withdraw] ${label} failed:`, error);
    }
  }

  if (lastResult) return lastResult;
  throw lastError;
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const authClient = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll() {},
        },
      }
    );

    const {
      data: { user },
      error: userError,
    } = await authClient.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ code: -1, message: "UNAUTHORIZED" }, { status: 401 });
    }

    const adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const withdrawnAt = new Date().toISOString();
    const { count: withdrawnUpdateCount, error: withdrawnUpdateError } = await withRetry(
      () =>
        adminClient
          .from("WithdrawnUser")
          .update({ withdrawn_at: withdrawnAt }, { count: "exact" })
          .eq("id", user.id),
      "WithdrawnUser update"
    );

    if (withdrawnUpdateError) {
      console.error("[account/withdraw] WithdrawnUser update error:", withdrawnUpdateError);
      return NextResponse.json(
        { code: -1, message: "WITHDRAWN_LOG_ERROR", detail: withdrawnUpdateError.message },
        { status: 500 }
      );
    }

    if (!withdrawnUpdateCount) {
      const { error: withdrawnInsertError } = await withRetry(
        () =>
          adminClient.from("WithdrawnUser").insert({
            id: user.id,
            email: user.email,
            withdrawn_at: withdrawnAt,
          }),
        "WithdrawnUser insert"
      );

      if (withdrawnInsertError) {
        console.error("[account/withdraw] WithdrawnUser insert error:", withdrawnInsertError);
        return NextResponse.json(
          { code: -1, message: "WITHDRAWN_LOG_ERROR", detail: withdrawnInsertError.message },
          { status: 500 }
        );
      }
    }

    const { error: deleteError } = await withRetry(
      () => adminClient.from("User").delete({ count: "exact" }).eq("id", user.id),
      "User delete"
    );

    if (deleteError) {
      console.error("[account/withdraw] User delete error:", deleteError);
      return NextResponse.json({ code: -1, message: "DB_ERROR", detail: deleteError.message }, { status: 500 });
    }

    const { error: authDeleteError } = await withRetry(
      () => adminClient.auth.admin.deleteUser(user.id),
      "auth user delete"
    );

    if (authDeleteError) {
      console.error("[account/withdraw] auth user delete error:", authDeleteError);
      return NextResponse.json({ code: -1, message: "AUTH_DELETE_ERROR", detail: authDeleteError.message }, { status: 500 });
    }

    return NextResponse.json({ code: 0 });
  } catch (e) {
    console.error("[account/withdraw] server error:", e);
    return NextResponse.json({ code: -1, message: "SERVER_ERROR" }, { status: 500 });
  }
}
