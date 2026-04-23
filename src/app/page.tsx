"use client";

import Link from "next/link";
import Image from "next/image";
import SubTitleAnimation from "@/components/AnimationSubTitle";
import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import styles from "./page.module.css";

const TIPS = [
  {
    emoji: "🤷",
    title: "뭘 좋아할지 모르겠을 때",
    desc: "친구한테 요즘 제일 필요한게 뭔지, 최근 관심사 원픽은 뭔지 콕 짚어드려요.",
  },
  {
    emoji: "😳",
    title: "물어봐도 대답 듣기 어려울 때",
    desc: "결정장애 친구라도 취향 월드컵 통해서 쉽고 빠르게 초이스 할 수 있어요.",
  },
  {
    emoji: "🎯",
    title: "장르만 알려주면 직접 고르고싶을 때",
    desc: "위시리스트는 알겠는데 가격이 부담될때, 차순위 카테고리도 알려드려요.",
  },
  {
    emoji: "💌",
    title: "센스 있는 선물을 하고 싶을 때",
    desc: "까다로운 친구한테도 알잘딱깔센!",
  },
  {
    emoji: "😅",
    title: "선물하긴 해야되는데 살짝 귀찮을 때",
    desc: "매번 똑같은 선물도 좋지만 관심 한스푼+",
  },
];

const PLANS = [
  { credits: 1, price: 990, tag: null },
  { credits: 5, price: 3500, tag: "인기 PICK" },
  { credits: 10, price: 5000, tag: "개당 500원" },
];

export default function LandingPage() {
  const [user, setUser] = useState<{ id: string; nickname: string } | null>(null);

  useEffect(() => {
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
    if (!window.Kakao) return;
    if (!window.Kakao.isInitialized()) {
      window.Kakao.init(process.env.NEXT_PUBLIC_KAKAO_JS_KEY);
    }
    window.Kakao.Share.sendDefault({
      objectType: "text",
      text: "친구가 원하는 선물을 물어보세요!\n🎁 WDYL - 너가 뭘 좋아할지 몰라서",
      link: {
        mobileWebUrl: "https://wdyl.vercel.app/",
        webUrl: "https://wdyl.vercel.app/",
      },
      serverCallbackArgs: {
        type: "share",
        user_id: user?.id,
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

      {/* 히어로 */}
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

      {/* 이용팁 */}
      <section className={styles.tipsSection}>
        <div className={styles.tipsInner}>
          <div className={styles.sectionLabel}>WHEN TO USE</div>
          <div className={styles.tipsList}>
            {TIPS.map((tip, i) => (
              <div key={i} className={styles.tipCard}>
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

      {/* 이용 흐름 */}
      <section className={styles.howSection}>
        <div className={styles.sectionLabel}>HOW TO USE</div>
        <div className={styles.howGrid}>
          {[
            { step: "01", emoji: "🎁", label: "티켓 만들기" },
            { step: "02", emoji: "📨", label: "링크 발송" },
            { step: "03", emoji: "🏆", label: "결과 확인" },
          ].map((item, i) => (
            <div key={i} className={styles.howStep}>
              <div className={styles.howStepEmoji}>{item.emoji}</div>
              <div className={styles.howStepLabel}>STEP {item.step}</div>
              <div className={styles.howStepName}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 프로모션 */}
      <section className={styles.pricingSection}>
        <div className={styles.sectionLabel}>PRICING</div>
        <div className={styles.planList}>
          {PLANS.map((plan, i) => (
            <div key={i} className={styles.planCard}>
              <div className={styles.planCardLeft}>
                <div className={styles.planCredits}>{plan.credits}크레딧</div>
                {plan.tag && (
                  <div className={plan.tag.includes("인기") ? styles.tagPopular : styles.tagCheap}>
                    {plan.tag}
                  </div>
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
              <div className={styles.promoTitle}>
                공유하기 / 추천하기 이벤트로 무료 크레딧 획득하세요 !
              </div>
              <div className={styles.promoDesc}>
                친구에게 WDYL 공유/추천 하면
                <br />
                1회당 크레딧 1개를 드려요
                <br />
                (최대 3회, 회원 로그인)
              </div>
            </div>
          </div>
          <button onClick={handleKakaoShare} className={styles.shareBtn}>
            <Share2 size={16} color="#fff" />
            <span className={styles.shareBtnText}>공유하기</span>
          </button>
        </div>
      </section>

      {/* CTA 하단 */}
      <section className={styles.ctaSection}>
        <Link href="/login" className={styles.ctaBtn}>
          지금 바로 시작하기
        </Link>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <Link href="/terms" className={styles.footerLink}>이용약관</Link>
          &nbsp;|&nbsp;
          <Link href="/privacy" className={styles.footerLink}>개인정보처리방침</Link>
        </div>
        <div className="mb-1 text-slate-500 break-keep">
          레오코퍼레이션 &nbsp;|&nbsp; 대표:노은비 &nbsp;|&nbsp; 사업자번호:717-28-01232
        </div>
        <div className="mb-1 text-slate-500">전화번호: 050-26680-0145 &nbsp;|&nbsp; 문의: jeyUnnie@gmail.com</div>
        <div className="mb-2 text-slate-500">사업장 주소: 서울시 강서구 양천로 65길 40</div>
        <div className="text-slate-500">© 2026 WDYL. All rights reserved.</div>
      </footer>
    </main>
  );
}
