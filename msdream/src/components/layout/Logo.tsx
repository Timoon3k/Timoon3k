/**
 * Sygnet MSdream — łuk stajennego okna z inicjałami.
 * SVG inline: zero dodatkowych żądań, skaluje się bez utraty ostrości
 * i dziedziczy kolor z kontekstu (jasny header vs. ciemny footer).
 */
export function Logo({ className = '', size = 34 }: { className?: string; size?: number }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 40 40"
        fill="none"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        {/* Łuk — motyw okna w stajni, powtarzany w całym serwisie */}
        <path
          d="M4 38V18C4 9.163 11.163 2 20 2C28.837 2 36 9.163 36 18V38"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path d="M4 38H36" stroke="currentColor" strokeWidth="1.4" />
        {/* Podkowa/most w środku łuku */}
        <path
          d="M14 38V25C14 21.686 16.686 19 20 19C23.314 19 26 21.686 26 25V38"
          stroke="currentColor"
          strokeWidth="1.4"
          opacity="0.5"
        />
      </svg>
      <span
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1.3rem',
          letterSpacing: '-0.02em',
          fontVariationSettings: "'SOFT' 30, 'WONK' 1, 'opsz' 24",
          lineHeight: 1,
        }}
      >
        MSdream
      </span>
    </span>
  );
}
