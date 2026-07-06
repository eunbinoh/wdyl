"use client";

import Link from "next/link";
import Image from "next/image";
import SubTitleAnimation from "@/components/AnimationSubTitle";
import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";
import KakaoShareModal from "@/components/KakaoShareModal";
import MarketingSection from "@/components/MarketingSection";
import { USE_TIPS, PRICE } from "@/lib/constants";

export default function LandingPage() {
  const [user, setUser] = useState<{ id: string; nickname: string } | null>(null);
  const [showKakaoShareModal, setShowKakaoShareModal] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get("ref");
    if (ref) {
      localStorage.setItem("wdyl_ref_id", ref);
      window.history.replaceState(null, "", "/");
    }

    const fetchUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase!.auth.getUser();
      if (!authUser) return;
      const { data } = await supabase!.from("User").select("id, nickname").eq("id", authUser.id).single();
      if (data) setUser(data);
    };
    fetchUser();
  }, []);

  const handleKakaoShare = () => {
    if (!user?.id) {
      setShowKakaoShareModal(true);
      return;
    }
    if (!window.Kakao) return;
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }
    window.Kakao.Share.sendCustom({
      templateId: 133105,
      templateArgs: {
        ref: user?.id,
      },
      serverCallbackArgs: {
        type: "share",
        user_id: user?.id,
      },
      pickerSettings: {
        type: "friend",
        limit: 1,
      },
    });
  };

  return (
    <main className={styles.main}>
      {/* 헤더 */}
      <header className={styles.header}>
        <Image
          src="/wdyl_logo.png"
          alt="WDYL"
          width={80}
          height={38}
          className={styles.logo}
        />
        <Link
          href={user ? "/main" : "/login"}
          className={styles.loginBtn}
        >
          {user ? `${user.nickname}님의 마이페이지` : "로그인"}
        </Link>
      </header>

      {/* 메인 카피라이터 */}
      <section className={styles.hero}>
        <div className={styles.heroBadge}>WHAT DO YOU LIKE</div>
        <SubTitleAnimation />
        <h1 className={styles.heroTitle}>
          선물 고민, 이제 그만.
          <br />
          AI 대신 물어봐드릴게요
        </h1>
        <p className={styles.heroDesc}>
          링크 하나로 친구의 속마음을 읽어오고
          <br />
          당신의 취향저격 선물에 감동할수있도록
        </p>
      </section>

      <MarketingSection />

      {/* 이용팁 */}
      <section className={styles.tipsSection}>
        <div className={styles.tipsInner}>
          <div className={styles.sectionLabel}>WHEN TO USE</div>
          <div className={styles.tipsList}>
            {USE_TIPS.map((tip, i) => (
              <div
                key={i}
                className={styles.tipCard}
              >
                <div className={styles.tipEmoji}>{tip.emoji}</div>
                <div>
                  <div className={styles.tipTitle}>{tip.title}</div>
                  <div className={styles.tipDesc}>{tip.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* 프로모션 */}
      <section className={styles.pricingSection}>
        <div className={styles.sectionLabel}> TICKET _ PRICE</div>
        <div className={styles.planList}>
          {PRICE.map((plan, i) => (
            <div
              key={i}
              className={styles.planCard}
            >
              <div className={styles.planCardLeft}>
                <div className={styles.planCredits}>{plan.credits}크레딧</div>
                {plan.tag && (
                  <div className={plan.tag.includes("인기") ? styles.tagPopular : styles.tagCheap}>{plan.tag}</div>
                )}
              </div>
              <div className={styles.planPrice}>{plan.price.toLocaleString()}원</div>
            </div>
          ))}
        </div>

        {/* 추천 크레딧 */}
        <div className={styles.promoBox}>
          <div className={styles.promoRow}>
            <div className={styles.promoEmoji}>🎉</div>
            <div className={styles.promoContent}>
              <div className={styles.promoTitle}>공유하기 / 추천하기 이벤트로 무료 크레딧 획득하세요 !</div>
              <div className={styles.promoDesc}>
                친구에게 WDYL 공유한 링크로 회원가입시
                <br />
                1회당 크레딧 1개를 드려요
                <br />
                (최대 3회, 로그인 필요)
              </div>
            </div>
          </div>
          <button
            onClick={handleKakaoShare}
            className={styles.shareBtn}
          >
            <Share2
              size={16}
              color="#fff"
            />
            <span className={styles.shareBtnText}>공유하기</span>
          </button>
        </div>
      </section>

      {/* CTA 하단 */}
      <section className={styles.ctaSection}>
        <Link
          href={user ? "/main" : "/login"}
          className={styles.ctaBtn}
        >
          지금 바로 시작하기
        </Link>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link
            href="/terms"
            className={styles.footerLink}
          >
            이용약관
          </Link>
          &nbsp;|&nbsp;
          <Link
            href="/privacy"
            className={styles.footerLink}
          >
            개인정보처리방침
          </Link>
        </div>
        <div className="mb-1 text-slate-500 break-keep">
          레오코퍼레이션 &nbsp;|&nbsp; 대표 노은비 &nbsp;|&nbsp; 사업자번호 717-28-01232
        </div>
        <div className="mb-1 text-slate-500">문의 ) 050-26680-0145 &nbsp;|&nbsp; jeyUnnie@gmail.com</div>
        <div className="mb-2 text-slate-500">서울시 강서구 양천로 65길 40</div>
        <div className="text-slate-500">© 2026 WDYL. All rights reserved.</div>
      </footer>
      {showKakaoShareModal && <KakaoShareModal onClose={() => setShowKakaoShareModal(false)} />}
    </main>
  );
}
