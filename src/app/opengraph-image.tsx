import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt =
  "PodcastNetwork.org. Google authority, built through your podcast.";
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
            fontSize: 36,
            color: "#faf8f5",
            fontWeight: 700,
            display: "flex",
          }}
        >
          PodcastNetwork
          <span style={{ color: "#c4a365" }}>.org</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 60,
              lineHeight: 1.1,
              color: "#faf8f5",
              fontWeight: 700,
              maxWidth: 1000,
            }}
          >
            Google authority, built through your podcast.
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#94a3b8",
              maxWidth: 900,
            }}
          >
            The Knowledge Panel Install and the Pre-Sold Author Package. Real
            signals, live proof.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
