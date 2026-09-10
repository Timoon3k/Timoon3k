/**
 * Statyczny odpowiednik sceny 3D. Renderuje się zawsze — jako tło pod canvasem,
 * a przy braku WebGL lub włączonym `prefers-reduced-motion` jako jedyna warstwa.
 * Sam SVG waży poniżej 2 kB i nie blokuje pierwszego renderu.
 */
export default function SceneFallback({ accent = '#5ce1ff' }: { accent?: string }) {
  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 h-[min(120vh,60rem)] w-[min(120vh,60rem)] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
        style={{
          background: `radial-gradient(circle, ${accent}1f 0%, ${accent}0a 28%, transparent 62%)`,
        }}
      />
      <svg
        viewBox="0 0 800 800"
        className="absolute top-1/2 left-1/2 h-[min(105vh,52rem)] w-[min(105vh,52rem)] -translate-x-1/2 -translate-y-1/2"
        fill="none"
        stroke={accent}
      >
        <circle cx="400" cy="400" r="96" strokeWidth="1" opacity="0.5" />
        <circle cx="400" cy="400" r="60" fill={accent} opacity="0.08" stroke="none" />
        <ellipse cx="400" cy="400" rx="250" ry="110" strokeWidth="1" opacity="0.22" />
        <ellipse
          cx="400"
          cy="400"
          rx="320"
          ry="140"
          strokeWidth="1"
          opacity="0.14"
          transform="rotate(-24 400 400)"
        />
        <ellipse
          cx="400"
          cy="400"
          rx="380"
          ry="165"
          strokeWidth="1"
          opacity="0.09"
          transform="rotate(28 400 400)"
        />
      </svg>
    </div>
  );
}
