import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"]
    })
    return config
  },
  trailingSlash: true,
  basePath: process.env.BASE_PATH,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc"
      }
    ],
    domains: ["ui.shadcn.com"],
    unoptimized: true
  }
}

export default nextConfig
