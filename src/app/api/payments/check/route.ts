import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const orderNo = searchParams.get("orderNo");

  if (!orderNo) {
    return NextResponse.json({ paid: false }, { status: 400 });
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: () => {},
    },
  });

  const { data } = await supabase.from("Payment").select("pay_id").eq("order_id", orderNo).maybeSingle();

  return NextResponse.json({ paid: Boolean(data?.pay_id) });
}
