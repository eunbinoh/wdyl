import { createServerClient } from "@supabase/ssr";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import MyProfile from "@/components/MyProfile";
import MyTickets from "@/components/MyTickets";
import ReferralApplier from "@/components/ReferralApplier";
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
  const { data } = await supabase.auth.getUser();
  const guestId = "6efe9d03-0070-44a2-9896-21f655834288";
  const user = data?.user
    ? data.user
    : {
        id: guestId,
        user_metadata: {
          id: guestId,
          name: "비회원",
          email: "guest@wdyl.com",
          avatar_url: "",
        },
      };

  const { data: profile } = await supabase
    .from("User")
    .select("*")
    .eq("id", user?.id ?? guestId)
    .single();

  return { user, profile, isAuthenticated: !!data?.user };
}

type MainPageProps = {
  searchParams: Promise<{
    openTicket?: string | string[];
  }>;
};

export default async function MainPage({ searchParams }: MainPageProps) {
  const { user, profile, isAuthenticated } = await getUser();
  const params = await searchParams;
  const openTicket = Array.isArray(params.openTicket) ? params.openTicket[0] : params.openTicket;

  if (!isAuthenticated && openTicket) {
    const next = `/main?openTicket=${encodeURIComponent(openTicket)}`;
    redirect(`/login?next=${encodeURIComponent(next)}`);
  }

  const avatarUrl = user?.user_metadata?.avatar_url;
  const nickname = profile?.nickname;
  const credits = profile?.credits ?? 0;
  const userId = user?.id;

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
      {nickname !== "GUEST" && (
        <div style={{ display: "flex", justifyContent: "center", padding: "16px 0 32px", marginBottom: 10 }}>
          <WithdrawButton />
        </div>
      )}
      <Suspense fallback={null}>
        <ToastAlert />
      </Suspense>
      {nickname !== "GUEST" && userId && <ReferralApplier userId={userId} />}
    </main>
  );
}
