import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  console.error("토스페이 결제 취소/실패:", Object.fromEntries(searchParams));

  const orderNo = searchParams.get("orderNo");
  if (orderNo) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );

    // 미완료 인텐트만 삭제 (이미 결제 완료된 건은 보호)
    const { error } = await supabase.from("Payment").delete().eq("order_id", orderNo).is("pay_id", null);
    if (error) console.error("취소 인텐트 삭제 실패:", error);
  }

  return NextResponse.redirect(new URL("/main?payment=fail", request.url));
}
