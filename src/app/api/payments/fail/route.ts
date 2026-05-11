import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  console.error("토스페이 결제 취소/실패:", Object.fromEntries(searchParams));
  return NextResponse.redirect(new URL("/main?payment=fail", request.url));
}
