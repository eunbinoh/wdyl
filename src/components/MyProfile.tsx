"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut, Wallet } from "lucide-react";
import styles from "./allComponents.module.css";
import CreditChargeModal from "./ChargeCreditModal";
import { useState } from "react";

type Props = {
  userId: string;
  nickname: string;
  email: string;
  avatarUrl?: string;
  credits: number;
};

export default function ProfileCard({ userId, nickname, email, avatarUrl, credits }: Props) {
  const router = useRouter();
  const handleLogout = async () => {
    await supabase?.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const [showCharge, setShowCharge] = useState(false);

  return (
    <>
      <div className={styles["profile-container"]}>
        {/* 상단 네비게이션 */}
        <div className={styles["profile-nav"]}>
          <Image
            src="/wdyl_logo.png"
            alt="WDYL"
            width={80}
            height={38}
            style={{ objectFit: "contain" }}
          />
          <button
            className={styles["profile-logout-btn"]}
            onClick={handleLogout}
          >
            <LogOut size={14} />
            <span>로그아웃</span>
          </button>
        </div>

        {/* 프로필 섹션 */}
        <div className={styles["profile-section"]}>
          <div className={styles["profile-avatar-wrap"]}>
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={nickname}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div className={styles["profile-avatar-fallback"]}>🙂</div>
            )}
          </div>
          <h2 className={styles["profile-nickname"]}>{nickname}</h2>
          <p className={styles["profile-email"]}>{email}</p>
        </div>

        {/* 크레딧 카드 */}
        <div className={styles["credit-card"]}>
          <div className={styles["credit-card-label"]}>
            <Wallet size={14} />
            <span>내 지갑</span>
          </div>
          <div className={styles["credit-card-amount"]}>
            {credits.toLocaleString()}
            <span className={styles["credit-card-unit"]}>크레딧</span>
          </div>
          <button
            className={styles["credit-charge-btn"]}
            onClick={() => setShowCharge(true)}
          >
            크레딧 충전하기
          </button>
        </div>
      </div>
      {showCharge && (
        <CreditChargeModal
          userId={userId}
          onClose={() => setShowCharge(false)}
        />
      )}
    </>
  );
}
