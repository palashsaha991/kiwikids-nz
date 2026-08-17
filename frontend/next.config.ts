import type { NextConfig } from "next";

const configuredOrigins =
  process.env.KIWIKIDS_DEV_ORIGINS
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

const nextConfig: NextConfig = {
  allowedDevOrigins: configuredOrigins,
};

export default nextConfig;
