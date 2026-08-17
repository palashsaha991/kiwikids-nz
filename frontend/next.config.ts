import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "192.168.0.144",
    "192.168.0.145",
    "localhost",
  ],
};

export default nextConfig;
