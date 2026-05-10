import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.dearmate.mom",
          },
        ],
        destination: "https://dearmate.mom/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
