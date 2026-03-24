import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MyProfile from "@/components/MyProfile";
import MyTickets from "@/components/MyTickets";

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
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: profile } = await supabase
    .from("User")
    .select("*")
    .eq("id", user.id)
    .single();

  // 티켓 현황 (init + progress = 사용중, complete = 완료)
  const { data: tickets } = await supabase
    .from("Ticket")
    .select("id, status, to_name, theme, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return { user, profile, tickets: tickets ?? [] };
}

export default async function MainPage() {
  const { user, profile, tickets } = await getUser();

  const avatarUrl = user.user_metadata?.avatar_url;
  const nickname = profile?.nickname ?? user.user_metadata?.name ?? "사용자";
  const credits = profile?.credits ?? 0;
  const userId = user.user_metadata?.id ?? user.id;

  return (
    <main className="min-h-screen bg-[#f3efdc]">
      <MyProfile
        nickname={nickname}
        email={profile?.email ?? ""}
        avatarUrl={avatarUrl}
        credits={credits}
      />
      <MyTickets userId={userId} credits={credits} tickets={tickets} />
    </main>
  );
}
