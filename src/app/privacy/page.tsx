import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main
      style={{
        maxWidth: 720,
        margin: "0 auto",
        padding: "40px 24px 80px",
        fontFamily: "'Apple SD Gothic Neo', sans-serif",
        color: "#1C1C1C",
        lineHeight: 1.8,
        backgroundColor: "#ffffff",
      }}
    >
      <Link
        href="/"
        style={{ fontSize: 13, color: "#94A3B8", textDecoration: "none" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <ChevronLeft size={16} /> 홈으로
        </div>
      </Link>

      <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 24, marginBottom: 8 }}>개인정보처리방침</h1>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 40 }}>시행일: 2026년 1월 1일</p>

      {[
        {
          title: "제1조 (수집하는 개인정보)",
          content: `서비스는 카카오 소셜 로그인을 통해 다음의 정보를 수집합니다.\n- 닉네임\n- 프로필 이미지\n- 이메일 주소\n\n서비스 이용 과정에서 생성되는 정보(티켓 정보, 결제 내역, 크레딧 잔액)도 수집됩니다.`,
        },
        {
          title: "제2조 (개인정보의 수집 및 이용 목적)",
          content: `수집한 개인정보는 다음의 목적으로만 이용됩니다.\n- 회원 식별 및 서비스 제공\n- 결제 처리 및 크레딧 관리\n- 고객 문의 응대\n- 서비스 개선 및 통계 분석`,
        },
        {
          title: "제3조 (개인정보의 보유 및 이용 기간)",
          content: `개인정보는 서비스 탈퇴 시까지 보유합니다.\n단, 관계 법령에 따라 일정 기간 보관이 필요한 경우 해당 기간 동안 보관합니다.\n- 결제 관련 기록: 5년 (전자상거래법)\n- 접속 로그: 3개월 (통신비밀보호법)`,
        },
        {
          title: "제4조 (개인정보의 제3자 제공)",
          content: `서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.\n단, 결제 처리를 위해 카카오페이에 최소한의 정보를 제공합니다.`,
        },
        {
          title: "제5조 (개인정보의 파기)",
          content: `이용자가 서비스를 탈퇴하거나 개인정보 삭제를 요청하는 경우, 지체 없이 해당 정보를 파기합니다.\n전자적 파일 형태의 정보는 복구 불가능한 방법으로 영구 삭제합니다.`,
        },
        {
          title: "제6조 (이용자의 권리)",
          content: `이용자는 언제든지 자신의 개인정보를 조회, 수정, 삭제할 수 있습니다.\n개인정보 관련 문의 및 삭제 요청은 jeyUnnie@gmail.com으로 연락하시기 바랍니다.`,
        },
        {
          title: "제7조 (쿠키의 사용)",
          content: `서비스는 로그인 상태 유지를 위해 쿠키를 사용합니다.\n이용자는 브라우저 설정을 통해 쿠키 저장을 거부할 수 있으나, 이 경우 서비스 이용에 제한이 있을 수 있습니다.`,
        },
        {
          title: "제8조 (개인정보 보호책임자)",
          content: `개인정보 보호 관련 문의는 아래로 연락하시기 바랍니다.\n- 이메일: jeyUnnie@gmail.com`,
        },
        {
          title: "제9조 (방침의 변경)",
          content: `이 방침은 법령 및 서비스 변경에 따라 수정될 수 있으며, 변경 시 서비스 내 공지사항을 통해 안내합니다.`,
        },
      ].map((section, i) => (
        <div
          key={i}
          style={{ marginBottom: 32 }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{section.title}</h2>
          <p style={{ fontSize: 14, color: "#475569", whiteSpace: "pre-line" }}>{section.content}</p>
        </div>
      ))}

      <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 24, fontSize: 13, color: "#94A3B8" }}>
        문의: jeyUnnie@gmail.com
      </div>
    </main>
  );
}
