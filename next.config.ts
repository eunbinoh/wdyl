import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore: Next.js 15
  reactCompiler: true,
  images: {
    unoptimized: false, // 최적화 활성화
  },
};

export default nextConfig;
