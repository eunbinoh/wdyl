import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore: Next.js 15 공식 문서에 명시된 설정이지만 타입 정의가 미비할 수 있음
  reactCompiler: true,
};

export default nextConfig;