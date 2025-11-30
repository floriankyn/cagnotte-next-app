import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  i18n: {
    locales: ["en-US", "fr"],
    defaultLocale: "en-US",
  }
};

export default nextConfig;
