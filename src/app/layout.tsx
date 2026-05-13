import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WDYL | 너멀조몰",
  description: "너가 뭘 좋아할지 몰라서 준비했어",
  openGraph: {
    title: "WDYL | 너가 뭘 좋아할지 몰라서 준비했어",
    description: "결정장애 친구를 위한 AI 선물 추천 서비스",
    images: ["/wdyl_icon.png"],
    url: "https://wdyl.vercel.app",
    siteName: "WDYL",
    locale: "ko_KR",
    type: "website",
  },
  verification: {
    google: "-ogaEt4HXCHeNofwpJRXtf2Y7FeCshIl2ADmpduDll4",
  },
  other: {
    "naver-site-verification": "3329baed68740d71491cc9feb5221e4dc6dafe73",
  },
  icons: {
    icon: "/wdyl_icon.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}

        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.8.1/kakao.min.js"
          integrity="sha384-OL+ylM/iuPLtW5U3XcvLSGhE8JzReKDank5InqlHGWPhb4140/yrBw0bg0y7+C9J"
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
