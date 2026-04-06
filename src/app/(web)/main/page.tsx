import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MyProfile from "@/components/MyProfile";
import MyTickets from "@/components/MyTickets";
import { Suspense } from "react";
import ToastAlert from "@/components/ToastAlert";
import WithdrawButton from "@/components/WithDrawButton";

async function getUser() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
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
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase.from("User").select("*").eq("id", user.id).single();

  return { user, profile };
}

export default async function MainPage() {
  const { user, profile } = await getUser();

  const avatarUrl = user.user_metadata?.avatar_url;
  const nickname = profile?.nickname ?? user.user_metadata?.name ?? "사용자";
  const credits = profile?.credits ?? 0;
  const userId = user.user_metadata?.id ?? user.id;

  return (
    <main className="min-h-screen bg-[#f3efdc]">
      <MyProfile
        userId={userId}
        nickname={nickname}
        email={profile?.email ?? ""}
        avatarUrl={avatarUrl}
        credits={credits}
      />
      <MyTickets
        userId={userId}
        credits={credits}
      />
      <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 32px", marginBottom: 10 }}>
        <WithdrawButton userId={userId} />
      </div>
      <Suspense fallback={null}>
        <ToastAlert />
      </Suspense>
    </main>
  );
}
