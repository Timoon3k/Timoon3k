export default function Logo({ className = '' }: { className?: string }) {
  return (
    <span className={`flex items-center gap-3 ${className}`}>
      <svg
        aria-hidden
        viewBox="0 0 32 32"
        className="h-7 w-7 shrink-0 text-signal"
        fill="none"
        stroke="currentColor"
      >
        <circle cx="16" cy="16" r="4.4" fill="currentColor" stroke="none" />
        <ellipse cx="16" cy="16" rx="14.5" ry="7" strokeWidth="1" opacity="0.55" />
        <ellipse
          cx="16"
          cy="16"
          rx="14.5"
          ry="7"
          strokeWidth="1"
          opacity="0.35"
          transform="rotate(60 16 16)"
        />
        <ellipse
          cx="16"
          cy="16"
          rx="14.5"
          ry="7"
          strokeWidth="1"
          opacity="0.35"
          transform="rotate(120 16 16)"
        />
      </svg>
      <span className="font-display text-[1.0625rem] font-semibold tracking-tight text-star">
        Majewski
        <span className="text-signal">.</span>
      </span>
    </span>
  );
}
