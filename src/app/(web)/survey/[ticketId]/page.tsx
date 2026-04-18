import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import SurveyClient from "./SurveyClient";

export default async function SurveyPage({ params }: { params: Promise<{ ticketId: string }> }) {
  const { ticketId } = await params;
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

  const { data: ticket } = await supabase
    .from("Ticket")
    .select("ticket_id, receiver_name, comment, theme, status")
    .eq("ticket_id", ticketId)
    .single();

  if (!ticket) return notFound();

  const { data: categories } = await supabase
    .from("Category")
    .select("category_code, name")
    .eq("active", true)
    .order("sort");
  return (
    <SurveyClient
      ticket={ticket}
      categories={categories ?? []}
    />
  );
}
