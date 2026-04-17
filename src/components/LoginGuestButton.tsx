"use client";

import { supabase } from "@/lib/supabase";
import styles from "./allComponents.module.css";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    router.push("/main");
  };

  return (
    <button
      onClick={handleLogout}
      className={styles["login-btn-guest"]}
    >
      비회원 이용하기
    </button>
  );
}
