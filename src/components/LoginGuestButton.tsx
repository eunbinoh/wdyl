"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import styles from "./allComponents.module.css";
import { sendGAEvent } from "@next/third-parties/google";

type Props = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
};

export default function LoginButton({ loading, setLoading }: Props) {
  const router = useRouter();

  const handleLogout = async () => {
    if (loading) return;
    setLoading(true);
    await supabase?.auth.signOut();

    sendGAEvent("event", "button_click", {
      category: "login_method",
      action: "guest_login",
      label: "비회원_로그인",
    });

    router.push("/main");
    setLoading(false);
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={styles["login-btn-guest"]}
      style={{
        opacity: loading ? 0.6 : 1,
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      비회원 이용하기
    </button>
  );
}
