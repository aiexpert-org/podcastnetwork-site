import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "PodcastNetwork.org. Get your Google Knowledge Presence Score.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#12172a",
          padding: "72px 80px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 24,
          }}
        >
          {/* Mini entity graph mark */}
          <svg width="72" height="72" viewBox="0 0 64 64">
            <rect width="64" height="64" rx="14" fill="#1a2138" />
            <circle cx="22" cy="24" r="8" fill="#c4a365" />
            <rect x="36" y="18" width="12" height="12" rx="3" fill="#4a90e2" />
            <circle cx="24" cy="46" r="6" fill="#10b981" />
            <rect x="40" y="40" width="8" height="12" rx="1.5" fill="#ef4444" />
            <line x1="28" y1="28" x2="37" y2="21" stroke="#64748b" strokeWidth="1.6" />
            <line x1="24" y1="32" x2="24" y2="40" stroke="#64748b" strokeWidth="1.6" />
            <line x1="30" y1="46" x2="40" y2="46" stroke="#64748b" strokeWidth="1.6" />
          </svg>
          <div
            style={{
              fontSize: 36,
              color: "#faf8f5",
              fontWeight: 700,
              display: "flex",
            }}
          >
            PodcastNetwork
            <span style={{ color: "#c4a365" }}>.org</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.1,
              color: "#faf8f5",
              fontWeight: 700,
              maxWidth: 980,
            }}
          >
            Your online presence is lacking. We can prove it.
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#94a3b8",
              maxWidth: 900,
            }}
          >
            Live entity graphs for executives and authors. Six months. One
            package. Real signals.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
