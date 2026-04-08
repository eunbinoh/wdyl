"use client";

import styles from "./allComponents.module.css";
import { useRouter } from "next/navigation";

export default function LoginButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push("/main")}
      className={styles["login-btn-guest"]}
    >
      비회원 이용하기
    </button>
  );
}
