import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function TermsPage() {
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

      <h1 style={{ fontSize: 24, fontWeight: 800, marginTop: 24, marginBottom: 8 }}>이용약관</h1>
      <p style={{ fontSize: 13, color: "#94A3B8", marginBottom: 40 }}>시행일: 2026년 1월 1일</p>

      {[
        {
          title: "제1조 (목적)",
          content: `이 약관은 WDYL(이하 "서비스")이 제공하는 선물 취향 설문 서비스의 이용과 관련하여 서비스와 이용자 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.`,
        },
        {
          title: "제2조 (서비스의 내용)",
          content: `서비스는 이용자가 지인에게 선물 취향 설문 링크를 발송하고, 설문 결과를 확인할 수 있는 온라인 서비스를 제공합니다.\n서비스 이용을 위해서는 카카오 계정을 통한 소셜 로그인이 필요하며, 크레딧 충전 후 티켓을 생성하여 이용합니다.`,
        },
        {
          title: "제3조 (서비스 제공 기간)",
          content: `서비스는 연중무휴 24시간 제공됩니다. 단, 시스템 점검, 장애, 천재지변 등의 사유로 일시적으로 중단될 수 있으며, 이 경우 사전 공지합니다.\n크레딧의 유효기간은 결제일로부터 12개월이며, 유효기간 만료 시 잔여 크레딧은 소멸됩니다.`,
        },
        {
          title: "제4조 (크레딧 및 결제)",
          content: `크레딧은 서비스 내에서 티켓 생성에 사용되는 가상 화폐입니다.\n크레딧은 토스페이를 통해 구매할 수 있으며, 결제 즉시 충전됩니다.\n크레딧 가격은 서비스 내 공지된 가격을 따릅니다.`,
        },
        {
          title: "제5조 (취소 및 환불 정책)",
          content: `미사용 크레딧은 구매 후 7일 이내에 환불 신청이 가능합니다.\n1회 이상 사용된 크레딧은 서버·서비스 운영 비용이 즉시 발생하므로 환불이 불가합니다.\n환불 신청은 고객센터 이메일(jeyUnnie@gmail.com)로 요청하시기 바랍니다.\n환불은 신청일로부터 영업일 기준 3~5일 내 처리됩니다.`,
        },
        {
          title: "제6조 (이용자의 의무)",
          content: `이용자는 서비스 이용 시 타인의 개인정보를 무단으로 수집하거나 악용해서는 안 됩니다.\n서비스를 통해 수집된 타인의 취향 정보는 선물 구매 목적으로만 사용해야 합니다.`,
        },
        {
          title: "제7조 (면책조항)",
          content: `서비스는 이용자가 서비스를 통해 얻은 정보로 인한 손해에 대해 책임을 지지 않습니다.\n서비스는 이용자 간의 거래에 개입하지 않으며, 이로 인한 분쟁에 책임을 지지 않습니다.`,
        },
        {
          title: "제8조 (약관의 변경)",
          content: `서비스는 필요 시 약관을 변경할 수 있으며, 변경 시 서비스 내 공지사항을 통해 사전 안내합니다.\n변경된 약관은 공지 후 7일이 경과한 날부터 효력이 발생합니다.`,
        },
        {
          title: "제9조 (준거법 및 관할)",
          content: `이 약관은 대한민국 법률에 따라 규율되며, 분쟁 발생 시 관할 법원은 서울중앙지방법원으로 합니다.`,
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
