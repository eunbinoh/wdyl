"use client";

import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LogOut, Wallet, IterationCcw } from "lucide-react";
import Image from "next/image";
import styles from "./allComponents.module.css";
import CreditChargeModal from "./ChargeCreditModal";

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
  const handleGuest = () => {
    router.push("/login");
    router.refresh();
  };

  const [showCharge, setShowCharge] = useState(false);
  const [isRefund, setIsRefund] = useState(false);

  return (
    <>
      <div className={styles["profile-container"]}>
        {/* 상단 네비게이션 */}
        <div className={styles["profile-nav"]}>
          <Image
            onClick={() => router.push("/")}
            src="/wdyl_logo.png"
            alt="WDYL"
            width={80}
            height={38}
            style={{ objectFit: "contain", cursor: "pointer" }}
          />
          <button
            className={styles["profile-logout-btn"]}
            onClick={nickname !== "GUEST" ? handleLogout : handleGuest}
          >
            <LogOut size={14} />
            <span>{nickname !== "GUEST" ? "로그아웃" : "회원 로그인"}</span>
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
          <div
            className={styles["credit-card-amount"]}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
          >
            <div>
              {credits.toLocaleString()}
              <span className={styles["credit-card-unit"]}>크레딧</span>
            </div>
            <button
              onClick={() => {
                setIsRefund(true);
              }}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                marginTop: 16,
                gap: 4,
                fontSize: 11,
                color: "#0062CC",
                opacity: 0.7,
              }}
            >
              <IterationCcw size={14} />
              RETURN
            </button>
          </div>

          <button
            className={styles["credit-charge-btn"]}
            onClick={() => {
              setShowCharge(true);
              setIsRefund(false);
            }}
          >
            크레딧 충전하기
          </button>
        </div>
      </div>
      {(showCharge || isRefund) && (
        <CreditChargeModal
          userId={userId}
          isRefund={isRefund}
          onClose={() => {
            setShowCharge(false);
            setIsRefund(false);
          }}
        />
      )}
    </>
  );
}
