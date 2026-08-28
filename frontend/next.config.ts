import type { NextConfig } from "next";

const configuredOrigins =
  process.env.KIWIKIDS_DEV_ORIGINS
    ?.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean) ?? [];

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  allowedDevOrigins: configuredOrigins,
};

export default nextConfig;
