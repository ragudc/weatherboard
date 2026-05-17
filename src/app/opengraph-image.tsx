import { ImageResponse } from "next/og"

export const alt         = "WeatherBoard — Real-Time US Weather Dashboard"
export const size        = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width:          "100%",
        height:         "100%",
        display:        "flex",
        flexDirection:  "column",
        alignItems:     "center",
        justifyContent: "center",
        background:     "linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #0c1a2e 100%)",
        fontFamily:     "sans-serif",
        padding:        "60px",
        position:       "relative",
      }}
    >
      {/* Background decorativo */}
      <div
        style={{
          position:     "absolute",
          top:          "-100px",
          right:        "-100px",
          width:        "500px",
          height:       "500px",
          borderRadius: "50%",
          background:   "radial-gradient(circle, rgba(59,130,246,0.15) 0%, transparent 70%)",
        }}
      />

      {/* Icono */}
      <div style={{ fontSize: 100, marginBottom: 24 }}>🌤️</div>

      {/* Título */}
      <div
        style={{
          fontSize:      60,
          fontWeight:    800,
          color:         "#f8fafc",
          letterSpacing: "-2px",
          textAlign:     "center",
          lineHeight:    1.1,
        }}
      >
        WeatherBoard
      </div>

      {/* Subtítulo */}
      <div
        style={{
          fontSize:   28,
          color:      "#94a3b8",
          marginTop:  16,
          textAlign:  "center",
          lineHeight: 1.4,
        }}
      >
        Real-Time US Weather Dashboard
      </div>

      {/* Stack badges */}
      <div
        style={{
          display:        "flex",
          gap:            12,
          marginTop:      40,
          flexWrap:       "wrap",
          justifyContent: "center",
        }}
      >
        {["Next.js 15", "TypeScript", "Tailwind CSS v4", "OpenWeatherMap"].map(
          (tech) => (
            <div
              key={tech}
              style={{
                padding:      "8px 18px",
                borderRadius: "100px",
                background:   "rgba(255,255,255,0.08)",
                border:       "1px solid rgba(255,255,255,0.12)",
                color:        "#cbd5e1",
                fontSize:     18,
              }}
            >
              {tech}
            </div>
          )
        )}
      </div>
    </div>,
    { ...size }
  )
}
