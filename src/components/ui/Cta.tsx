import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

const base =
  'group relative inline-flex items-center justify-center gap-3 overflow-hidden px-7 py-4 font-medium tracking-tight transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signal';

const variants: Record<Variant, string> = {
  primary: 'bg-star text-void hover:text-void',
  secondary: 'border border-hairline-strong text-star hover:border-signal hover:text-signal',
  ghost: 'text-star hover:text-signal px-0 py-2',
};

function Inner({ children, variant }: { children: ReactNode; variant: Variant }) {
  return (
    <>
      {variant === 'primary' ? (
        <span
          aria-hidden
          className="absolute inset-0 -translate-y-full bg-signal transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-y-0 group-focus-visible:translate-y-0"
        />
      ) : null}
      <span className="relative z-10">{children}</span>
      <svg
        aria-hidden
        viewBox="0 0 16 16"
        className="relative z-10 h-3.5 w-3.5 transition-transform duration-[400ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M2 8h11M9 4l4 4-4 4" strokeLinecap="square" />
      </svg>
    </>
  );
}

type CtaLinkProps = {
  href: string;
  variant?: Variant;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>;

export function CtaLink({ href, variant = 'primary', children, className = '', ...rest }: CtaLinkProps) {
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      <Inner variant={variant}>{children}</Inner>
    </Link>
  );
}

export function ctaClassName(variant: Variant = 'primary') {
  return `${base} ${variants[variant]}`;
}

export { Inner as CtaInner };
