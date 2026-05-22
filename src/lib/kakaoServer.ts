type KakaoRefreshResponse = {
  access_token?: string;
  refresh_token?: string;
  token_type?: string;
  expires_in?: number;
  refresh_token_expires_in?: number;
  error?: string;
  error_description?: string;
};

export async function refreshKakaoAccessToken(refreshToken: string) {
  const clientId = process.env.KAKAO_REST_API_KEY;

  if (!clientId) {
    throw new Error("KAKAO_REST_API_KEY 환경 변수가 설정되지 않았습니다.");
  }

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: clientId,
    refresh_token: refreshToken,
  });

  if (process.env.KAKAO_CLIENT_SECRET) {
    body.set("client_secret", process.env.KAKAO_CLIENT_SECRET);
  }

  const response = await fetch("https://kauth.kakao.com/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body,
    cache: "no-store",
  });

  const data = (await response.json().catch(() => null)) as KakaoRefreshResponse | null;

  if (!response.ok || !data?.access_token) {
    console.error("[kakao] token refresh failed:", data);
    throw new Error("KAKAO_TOKEN_REFRESH_FAILED");
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  };
}
