import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default config;
};

export default config;
import type { NextConfig } from "next";

const config: NextConfig = {
  experimental: {
    reactCompiler: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default config;