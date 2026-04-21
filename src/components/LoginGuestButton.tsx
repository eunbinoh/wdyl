"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import styles from "./allComponents.module.css";

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
    router.push("/main");
    setLoading(false);
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className={styles["login-btn-guest"]}
      style={{
        opacity: loading ? 0.7 : 1,
        cursor: loading ? "not-allowed" : "pointer",
      }}
    >
      비회원 이용하기
    </button>
  );
}
