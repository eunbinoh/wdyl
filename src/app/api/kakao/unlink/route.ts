import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { accessToken } = await req.json();

    if (!accessToken) {
      return NextResponse.json({ code: -1, message: "INVALID_PARAMS" }, { status: 400 });
    }

    const response = await fetch("https://kapi.kakao.com/v1/user/unlink", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      console.error("[kakao/unlink] failed:", data);
      return NextResponse.json({ code: -1, message: "KAKAO_UNLINK_FAILED", detail: data }, { status: response.status });
    }

    return NextResponse.json({ code: 0, data });
  } catch (e) {
    console.error("[kakao/unlink] server error:", e);
    return NextResponse.json({ code: -1, message: "SERVER_ERROR" }, { status: 500 });
  }
}
