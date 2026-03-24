"use client";

import { supabase } from "@/lib/supabase";
import styles from "./components.module.css";
import { useState } from "react";

export default function LoginButton() {
  const [loading, setLoading] = useState(false);

  const handleKakaoLogin = async () => {
    if (loading) return;
    setLoading(true);
    const { error } = await supabase!.auth.signInWithOAuth({
      provider: "kakao",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
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
