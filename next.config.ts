import type {NextConfig} from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.PAGES_BASE_PATH,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "placehold.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "randomuser.me",
        port: "",
        pathname: "/api/portraits/women/**",
      },
    ],
  },
};

export default nextConfig;
