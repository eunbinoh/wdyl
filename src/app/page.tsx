"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import SubTitleAnimation from "@/components/AnimationSubTitle";

const TIPS = [
  { emoji: "🤷", title: "뭘 좋아할지 모르겠을 때", desc: "친구의 최근 필요품, 원픽을 대신 알아올게요!" },
  { emoji: "😳", title: "물어봐도 대답 듣기 어려울 때", desc: "결정장애 친구라도 선택지로 간편하게 초이스!" },
  {
    emoji: "🎯",
    title: "장르만 알려주면 직접 고르고싶을 때",
    desc: "선물은 내가 직접 고르되, 방향만 잡고 싶을 때 딱 !",
  },
  {
    emoji: "💌",
    title: "센스 있는 선물을 하고 싶을 때",
    desc: "까다로운 친구의 맘에 쏙드는 선물 픽!",
  },
  {
    emoji: "😅",
    title: "선물하긴 해야되는데 고르기 살짝 귀찮을 때",
    desc: "맨날 똑같은 상품권 성의 없어 보이지 않도록.",
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
        .plan-card { transition: all 0.2s ease; cursor: pointer; }
        .plan-card:hover { transform: translateY(-3px); }
        .cta-btn { transition: all 0.2s ease; }
        .cta-btn:hover { transform: scale(1.03); box-shadow: 0 8px 24px rgba(254,229,0,0.5); }
        .login-btn { transition: all 0.2s ease; }
        .login-btn:hover { background: #f9b233 !important; color: #fff !important; }
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
          href="/login"
          className="login-btn"
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: "#f9b233",
            background: "rgb(250, 243, 230)",
            border: "1.5px solid #f9b233",
            borderRadius: 20,
            padding: "8px 20px",
            textDecoration: "none",
          }}
        >
          로그인
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
                  <div style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{tip.desc}</div>
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
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
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
            background: "#F0FDF4",
            border: "1px solid #BBF7D0",
            borderRadius: 14,
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            className="promo-tag"
            style={{ fontSize: 28 }}
          >
            🎉
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#166534", marginBottom: 3 }}>
              친구 추천하면 1크레딧 무료!
            </div>
            <div style={{ fontSize: 13, color: "#16a34a", lineHeight: 1.6 }}>
              친구에게 WDYL을 공유하기 / 추천하기 하면
              <br />
              추천 1회당 크레딧 1개를 드려요 (최대 3개)
            </div>
          </div>
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
            background: "#FEE500",
            color: "#1C1C1C",
            fontWeight: 800,
            fontSize: 16,
            borderRadius: 16,
            padding: "18px 48px",
            textDecoration: "none",
            letterSpacing: -0.3,
          }}
        >
          지금 바로 시작하기
        </Link>
      </section>

      {/* 푸터 */}
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
        문의: jeyUnnie@gmail.com
        <br />© 2026 WDYL. All rights reserved.
      </footer>
    </main>
  );
}
