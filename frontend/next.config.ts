import type { NextConfig } from "next";

const allowedDevOrigin =
  process.env.KIWIKIDS_DEV_ORIGIN ?? "192.168.0.145";

const nextConfig: NextConfig = {
  allowedDevOrigins: [allowedDevOrigin],
};

export default nextConfig;
