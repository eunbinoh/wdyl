"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

function clearStoredTokens() {
  const removeAuthKeys = (storage: Storage) => {
    Object.keys(storage).forEach((key) => {
      const normalizedKey = key.toLowerCase();
      if (key.startsWith("sb-") || key.startsWith("wdyl_") || normalizedKey.includes("kakao")) {
        storage.removeItem(key);
      }
    });
  };

  removeAuthKeys(localStorage);
  removeAuthKeys(sessionStorage);
}

export default function WithdrawButton() {
  const router = useRouter();

  const handleWithdraw = async () => {
    const confirmed = confirm("정말 탈퇴하시겠어요?\n미사용 크레딧은 환불되지 않으며, 모든 데이터가 삭제됩니다.");
    if (!confirmed) return;

    const {
      data: { session },
    } = await supabase!.auth.getSession();
    const kakaoAccessToken = session?.provider_token;

    const deleteResponse = await fetch("/api/account/withdraw", {
      method: "POST",
    });

    if (!deleteResponse.ok) return alert("계정 삭제 처리 중 오류가 발생했어요.");

    if (kakaoAccessToken) {
      const unlinkResponse = await fetch("/api/kakao/unlink", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: kakaoAccessToken }),
      });

      if (!unlinkResponse.ok) {
        console.error("카카오 연결 끊기 실패:", await unlinkResponse.text());
      }
    }

    await supabase!.auth.signOut();
    clearStoredTokens();
    router.push("/");
  };

  return (
    <button
      onClick={handleWithdraw}
      style={{
        fontSize: 14,
        color: "#64748b",
        background: "none",
        border: "none",
        cursor: "pointer",
        textDecoration: "underline",
      }}
    >
      서비스 탈퇴하기
    </button>
  );
}
