import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/cafe",
        destination: "/kawaberi",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
