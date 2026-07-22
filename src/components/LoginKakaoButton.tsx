"use client";

import { supabase } from "@/lib/supabase";
import styles from "./allComponents.module.css";
import { sendGAEvent } from "@next/third-parties/google";

type Props = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export default function LoginKakaoButton({ loading, setLoading }: Props) {
  const handleKakaoLogin = async () => {
    if (loading) return;
    setLoading(true);
    sendGAEvent({
      event: "button_click",
      category: "login_method",
      action: "kakao_login",
      label: "카카오_로그인",
    });
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : "/main";
    const callbackUrl = new URL("/api/auth/callback", window.location.origin);
    callbackUrl.searchParams.set("next", safeNext);

    const { error } = await supabase!.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: callbackUrl.toString(),
        scopes: "account_email profile_nickname profile_image talk_message",
      },
    });
    if (error) {
      console.error("카카오 로그인 에러:", error.message);
      alert("로그인 중 에러가 발생했습니다.");
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleKakaoLogin}
      disabled={loading}
      className={styles["login-btn-kakao"]}
      style={{
        opacity: loading ? 0.7 : 1,
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      {loading ? (
        <span
          style={{
            display: "inline-block",
            width: 16,
            height: 16,
            border: "2px solid #191919",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "loading-spinner 0.9s linear infinite",
          }}
        />
      ) : (
        "카카오로 시작하기"
      )}
    </button>
  );
}
