import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  devIndicators: false,

  // ─── Optimizaciones de imagen ──────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
  },

  // ─── Security Headers ─────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options",   value: "nosniff"                        },
          { key: "X-Frame-Options",          value: "DENY"                           },
          { key: "X-XSS-Protection",         value: "1; mode=block"                  },
          { key: "Referrer-Policy",          value: "strict-origin-when-cross-origin" },
          {
            key:   "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ]
  },

  // ─── Logging en desarrollo ────────────────────────────────────
  logging: {
    fetches: { fullUrl: process.env.NODE_ENV === "development" },
  },
}

export default nextConfig
