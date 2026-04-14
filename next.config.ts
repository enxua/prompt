import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  // GitHub Pages 등에 배포할 때 경로 문제가 있다면 아래 설정을 추가할 수 있습니다.
  // basePath: '/prompt', 
};

export default nextConfig;
