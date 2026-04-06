"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function WithdrawButton({ userId }: { userId: string }) {
  const router = useRouter();

  const handleWithdraw = async () => {
    const confirmed = confirm("정말 탈퇴하시겠어요?\n미사용 크레딧은 환불되지 않으며, 모든 데이터가 삭제됩니다.");
    if (!confirmed) return;

    const { error } = await supabase!.from("User").update({ deleted_at: new Date().toISOString() }).eq("id", userId);

    if (error) return alert("탈퇴 처리 중 오류가 발생했어요.");

    await supabase!.auth.signOut();
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
