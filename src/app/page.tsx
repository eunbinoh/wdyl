"use client";

import Link from "next/link";
import Image from "next/image";
import SubTitleAnimation from "@/components/AnimationSubTitle";
import { useEffect, useState } from "react";
import { Share2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
  const [hoveredTip, setHoveredTip] = useState<number | null>(null);
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

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
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#FAFAFA",
        fontFamily: "'Apple SD Gothic Neo', 'Pretendard', sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .tip-card { transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .tip-card:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 12px 32px rgba(249,178,51,0.15); }
        .plan-card { transition: all 0.2s ease; }
        .plan-card:hover { transform: translateY(-3px); }
        .cta-btn { transition: all 0.2s ease; }
        .cta-btn:hover { transform: scale(1.03); box-shadow: 0 8px 24px rgba(254,229,0,0.5); }
        .login-btn { transition: all 0.2s ease; }
        .login-btn:hover, .login-btn:active { background: #f9b233 !important; color: #fff !important; }
        .promo-tag { animation: float 3s ease-in-out infinite; }
      `}</style>

      {/* 헤더 */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "20px 28px",
          maxWidth: 960,
          margin: "0 auto",
          animation: "fadeUp 0.5s ease both",
        }}
      >
        <Image
          src="/wdyl_logo.png"
          alt="WDYL"
          width={80}
          height={38}
          style={{ objectFit: "contain" }}
        />
        <Link
          href={user ? "/main" : "/login"}
          className="login-btn"
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#f9b233",
            background: "rgb(250, 243, 230)",
            border: "1px solid #f9b233",
            borderRadius: "12px",
            height: "32px",
            padding: "6px 12px",
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          {user ? `${user.nickname}님의 마이페이지` : "로그인"}
        </Link>
      </header>

      {/* 히어로 */}
      <section
        style={{
          textAlign: "center",
          padding: "60px 24px 56px",
          maxWidth: 600,
          margin: "0 auto",
          animation: "fadeUp 0.6s ease 0.1s both",
        }}
      >
        <div
          style={{
            display: "inline-block",
            fontSize: 12,
            fontWeight: 700,
            color: "#F9B233",
            background: "#FEF8EC",
            border: "1px solid #F9B23340",
            borderRadius: 20,
            padding: "6px 16px",
            letterSpacing: 1.5,
            marginBottom: 24,
          }}
        >
          WHAT DO YOU LIKE
        </div>
        <SubTitleAnimation />
        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: "#1C1C1C",
            lineHeight: 1.35,
            marginTop: 16,
            marginBottom: 16,
            letterSpacing: -1,
          }}
        >
          선물 고민, 이제 그만.
          <br />
          AI 대신 물어봐드릴게요
        </h1>
        <p
          style={{
            fontSize: 15,
            color: "#64748b",
            lineHeight: 1.9,
            marginBottom: 40,
          }}
        >
          링크 하나로 친구의 속마음을 읽어오고
          <br />
          당신의 취향저격 선물에 감동할수있도록
        </p>
      </section>

      {/* 이용팁 */}
      <section style={{ padding: "0 0 64px", width: "100%" }}>
        <div
          style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: "0 24px",
            animation: "fadeUp 0.6s ease 0.3s both",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 2, marginBottom: 20 }}>
            WHEN TO USE
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, textAlign: "left" }}>
            {TIPS.map((tip, i) => (
              <div
                key={i}
                className="tip-card"
                onMouseEnter={() => setHoveredTip(i)}
                onMouseLeave={() => setHoveredTip(null)}
                style={{
                  background: hoveredTip === i ? "#FEF8EC" : "#fff",
                  border: `1.5px solid ${hoveredTip === i ? "#F9B233" : "#F1F5F9"}`,
                  borderRadius: 14,
                  padding: "16px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: 16,
                }}
              >
                <div style={{ fontSize: 26, flexShrink: 0 }}>{tip.emoji}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "#1C1C1C", marginBottom: 3 }}>{tip.title}</div>
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6, wordBreak: "keep-all" }}>
                    {tip.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 이용 흐름 */}
      <section
        style={{
          padding: "0 24px 64px",
          maxWidth: 720,
          margin: "40px auto",
          animation: "fadeUp 0.6s ease 0.2s both",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#94A3B8",
            letterSpacing: 2,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          HOW TO USE
        </div>
        <div
          style={{
            display: "flex",
            gap: 0,
            background: "#fff",
            borderRadius: 20,
            border: "1px solid #F1F5F9",
            overflow: "hidden",
          }}
        >
          {[
            { step: "01", emoji: "🎁", label: "티켓 만들기" },
            { step: "02", emoji: "📨", label: "링크 발송" },
            { step: "03", emoji: "🏆", label: "결과 확인" },
          ].map((item, i) => (
            <div
              key={i}
              style={{
                flex: 1,
                padding: "24px 12px",
                textAlign: "center",
                borderRight: i < 2 ? "1px solid #F1F5F9" : "none",
              }}
            >
              <div style={{ fontSize: 28, marginBottom: 8 }}>{item.emoji}</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: "#64748b", marginBottom: 4 }}>STEP {item.step}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#1C1C1C" }}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 프로모션 */}
      <section
        style={{
          padding: "0 24px 64px",
          maxWidth: 720,
          margin: "40px auto",
          animation: "fadeUp 0.6s ease 0.4s both",
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: "#94A3B8",
            letterSpacing: 2,
            marginBottom: 20,
            textAlign: "center",
          }}
        >
          PRICING
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            marginBottom: 20,
            maxWidth: 400,
            margin: "0 auto 20px",
          }}
        >
          {PLANS.map((plan, i) => (
            <div
              key={i}
              className="plan-card"
              onMouseEnter={() => setHoveredPlan(i)}
              onMouseLeave={() => setHoveredPlan(null)}
              style={{
                background: hoveredPlan === i ? "#1C1C1C" : "#fff",
                border: `1.5px solid ${hoveredPlan === i ? "#1C1C1C" : "#F1F5F9"}`,
                borderRadius: 14,
                padding: "18px 20px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: hoveredPlan === i ? "#fff" : "#1C1C1C" }}>
                  {plan.credits}크레딧
                </div>
                {plan.tag && (
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: plan.tag.includes("인기") ? "#0062CC" : "#f9b233",
                      background: plan.tag.includes("인기") ? "#EFF6FF" : "#FEF9EC",
                      padding: "3px 10px",
                      borderRadius: 20,
                    }}
                  >
                    {plan.tag}
                  </div>
                )}
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: hoveredPlan === i ? "#FFF" : "#000" }}>
                {plan.price.toLocaleString()}원
              </div>
            </div>
          ))}
        </div>

        {/* 추천 크레딧 */}
        <div
          style={{
            background: "#EFF6FF",
            border: "1px solid #BFDBFE",
            borderRadius: 14,
            padding: "16px 20px",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            maxWidth: 400,
            margin: "0 auto",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              className="promo-tag"
              style={{ fontSize: 28 }}
            >
              🎉
            </div>
            <div className="flex-1 break-keep break-words">
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1e40af", marginBottom: 3 }}>
                공유하기 / 추천하기 이벤트로 무료 크레딧 획득하세요 !
              </div>
              <div style={{ fontSize: 13, color: "#3b82f6", lineHeight: 1.6 }}>
                친구에게 WDYL 공유/추천 하면
                <br />
                1회당 크레딧 1개를 드려요
                <br />
                (최대 3회, 회원 로그인)
              </div>
            </div>
          </div>
          <button
            onClick={handleKakaoShare}
            style={{
              background: "#1d4ed8",
              border: "none",
              borderRadius: 10,
              padding: "10px 0",
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 6,
              cursor: "pointer",
            }}
          >
            <Share2
              size={16}
              color="#fff"
            />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#fff" }}>공유하기</span>
          </button>
        </div>
      </section>

      {/* CTA 하단 */}
      <section
        style={{
          textAlign: "center",
          padding: "0 24px 80px",
          animation: "fadeUp 0.6s ease 0.5s both",
        }}
      >
        <Link
          href="/login"
          className="cta-btn"
          style={{
            display: "inline-block",
            background: "#f9b233",
            color: "#fff",
            fontWeight: 800,
            fontSize: 16,
            borderRadius: 16,
            padding: "14px 48px",
            textDecoration: "none",
            letterSpacing: -0.3,
          }}
        >
          지금 바로 시작하기
        </Link>
      </section>

      <footer
        style={{
          textAlign: "center",
          padding: "24px",
          borderTop: "1px solid #F1F5F9",
          fontSize: 12,
          color: "#94A3B8",
          lineHeight: 2,
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <Link
            href="/terms"
            style={{ color: "#94A3B8", textDecoration: "none" }}
          >
            이용약관
          </Link>
          &nbsp;|&nbsp;
          <Link
            href="/privacy"
            style={{ color: "#94A3B8", textDecoration: "none" }}
          >
            개인정보처리방침
          </Link>
        </div>

        <div
          className="mb-1 text-slate-500"
          style={{ wordBreak: "keep-all" }}
        >
          레오코퍼레이션 &nbsp;|&nbsp; 대표:노은비 &nbsp;|&nbsp; 사업자번호:717-28-01232
        </div>
        <div className="mb-1 text-slate-500">전화번호: 050-26680-0145 &nbsp;|&nbsp; 문의: jeyUnnie@gmail.com</div>
        <div className="mb-2 text-slate-500">사업장 주소: 서울시 강서구 양천로 65길 40</div>
        <div className="text-slate-500">© 2026 WDYL. All rights reserved.</div>
      </footer>
    </main>
  );
}
