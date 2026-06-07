import { ImageResponse } from "next/og";

export const alt = "Copa Familiar FIFA — torneo de FIFA en familia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "radial-gradient(circle at 50% 0%, #14401f 0%, #0a0f0a 60%)",
          color: "#f4f4f5",
          fontFamily: "sans-serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BALL} width={140} height={140} alt="" />
        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 86,
            fontWeight: 800,
            letterSpacing: -2,
          }}
        >
          Copa Familiar&nbsp;
          <span style={{ color: "#34d399" }}>FIFA</span>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 36,
            color: "#a1a1aa",
          }}
        >
          Torneo en familia · 8 jugadores · grupos y final
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 26,
            color: "#fbbf24",
            border: "2px solid #fbbf2455",
            borderRadius: 999,
            padding: "10px 28px",
          }}
        >
          Sorteo en vivo · Tablas · Eliminación directa
        </div>
      </div>
    ),
    { ...size },
  );
}
