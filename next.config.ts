import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true, // 정적 호스팅 시 /about -> /about/index.html로 처리하여 호환성 향상
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
