import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// Balón de fútbol clásico dibujado en SVG (sin depender de emojis).
const BALL = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>
    <circle cx='32' cy='32' r='29' fill='#ffffff' stroke='#0a0a0a' stroke-width='3'/>
    <polygon points='32,20 41,27 38,38 26,38 23,27' fill='#0a0a0a'/>
    <line x1='32' y1='20' x2='32' y2='5' stroke='#0a0a0a' stroke-width='3'/>
    <line x1='41' y1='27' x2='55' y2='20' stroke='#0a0a0a' stroke-width='3'/>
    <line x1='38' y1='38' x2='48' y2='51' stroke='#0a0a0a' stroke-width='3'/>
    <line x1='26' y1='38' x2='16' y2='51' stroke='#0a0a0a' stroke-width='3'/>
    <line x1='23' y1='27' x2='9' y2='20' stroke='#0a0a0a' stroke-width='3'/>
  </svg>`,
)}`;

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a6e2e",
          borderRadius: 6,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BALL} width={26} height={26} alt="" />
      </div>
    ),
    { ...size },
  );
}
