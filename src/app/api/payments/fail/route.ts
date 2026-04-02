import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const message = searchParams.get("message") ?? "결제에 실패했어요.";
  console.error("토스 결제 실패:", message);
  return NextResponse.redirect(new URL(`/main?payment=fail`, request.url));
}
