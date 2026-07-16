import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: [
    "sequelize",
    "sequelize-typescript",
    "mysql2",
  ],
};

export default nextConfig;