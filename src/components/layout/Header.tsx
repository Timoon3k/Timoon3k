'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { loadGsap } from '@/lib/animation/gsap';
import Logo from '@/components/layout/Logo';
import { nav } from '@/lib/site';
import { prefersReducedMotion } from '@/lib/animation/prefers-reduced-motion';

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuReady, setMenuReady] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);

  /* Panel zamykany z poziomu jego własnych odnośników — bez efektu na zmianę ścieżki. */
  const close = useCallback(() => setOpen(false), []);


  /* Tło nagłówka pojawia się dopiero po opuszczeniu pierwszego ekranu. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    // Pierwszy odczyt po klatce — pozycja przewijania bywa przywracana przez
    // przeglądarkę już po zamontowaniu komponentu.
    const frame = requestAnimationFrame(onScroll);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  /* Animacja panelu mobilnego */
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const reduced = prefersReducedMotion();
    let ctx: gsap.Context | undefined;
    let cancelled = false;

    void loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      ctx = gsap.context(() => {
        const items = panel.querySelectorAll('[data-nav-item]');
        const tl = gsap.timeline({ paused: true })
          .set(panel, { pointerEvents: 'auto' })
          .fromTo(
            panel,
            { clipPath: 'inset(0% 0% 100% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: reduced ? 0.001 : 0.7, ease: 'power4.inOut' },
          )
          .fromTo(
            items,
            { yPercent: 100, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: reduced ? 0.001 : 0.6,
              stagger: reduced ? 0 : 0.055,
              ease: 'power3.out',
            },
            reduced ? 0 : '-=0.35',
          );
        timeline.current = tl;
      }, panel);
      // Oś czasu bywa gotowa później niż pierwsza interakcja — efekt niżej
      // odtwarza wtedy właściwy stan panelu.
      setMenuReady(true);
    });

    return () => {
      cancelled = true;
      ctx?.revert();
      timeline.current = null;
      setMenuReady(false);
    };
  }, []);

  useEffect(() => {
    const tl = timeline.current;
    if (!tl) return;
    if (open) tl.play();
    else tl.reverse();

    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open, menuReady]);

  /* Zamknięcie klawiszem Escape */
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ${
        scrolled || open
          ? 'border-b border-hairline bg-void/80 backdrop-blur-xl'
          : 'border-b border-transparent'
      }`}
    >
      <div className="container-page flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link
          href="/"
          aria-label="Strona główna — Tomasz Majewski"
          onClick={close}
          className="relative z-10"
        >
          <Logo />
        </Link>

        <nav aria-label="Nawigacja główna" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`link-underline text-sm tracking-tight transition-colors ${
                      active ? 'text-signal' : 'text-dim hover:text-star'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/kontakt#formularz"
            className="group inline-flex items-center gap-2.5 border border-hairline-strong px-5 py-2.5 text-sm font-medium tracking-tight text-star transition-colors hover:border-signal hover:text-signal"
          >
            Rozpocznij projekt
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-signal transition-transform duration-500 group-hover:scale-150"
            />
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="menu-mobilne"
          className="relative z-10 flex h-11 w-11 items-center justify-center lg:hidden"
        >
          <span className="sr-only">{open ? 'Zamknij menu' : 'Otwórz menu'}</span>
          <span aria-hidden className="relative block h-3.5 w-6">
            <span
              className={`absolute left-0 block h-px w-full bg-star transition-transform duration-[400ms] ease-[cubic-bezier(0.83,0,0.17,1)] ${
                open ? 'top-1/2 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-full bg-star transition-transform duration-[400ms] ease-[cubic-bezier(0.83,0,0.17,1)] ${
                open ? 'top-1/2 -rotate-45' : 'top-full'
              }`}
            />
          </span>
        </button>
      </div>

      {/* Panel mobilny */}
      <div
        id="menu-mobilne"
        ref={panelRef}
        aria-hidden={!open}
        style={{ clipPath: 'inset(0% 0% 100% 0%)', pointerEvents: 'none' }}
        className="fixed inset-0 top-0 z-0 flex h-[100dvh] flex-col justify-between bg-abyss px-gutter pt-[calc(var(--header-h)+2rem)] pb-10 lg:hidden"
      >
        <nav aria-label="Nawigacja mobilna">
          <ul className="flex flex-col">
            {nav.map((item, index) => (
              <li key={item.href} className="overflow-hidden border-b border-hairline">
                <Link
                  href={item.href}
                  data-nav-item
                  onClick={close}
                  tabIndex={open ? undefined : -1}
                  className="flex items-baseline gap-4 py-5 font-display text-[2rem] font-semibold tracking-tight text-star"
                >
                  <span className="font-mono text-[0.625rem] text-faint">
                    0{index + 1}
                  </span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div data-nav-item className="space-y-5">
          <Link
            href="/kontakt#formularz"
            tabIndex={open ? undefined : -1}
            onClick={close}
            className="flex w-full items-center justify-between bg-star px-6 py-4 font-medium text-void"
          >
            Rozpocznij projekt
            <span aria-hidden>→</span>
          </Link>
          <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-[0.6875rem] tracking-[0.14em] text-faint uppercase">
            <Link href="/tworzenie-stron-internetowych-wolomin" tabIndex={open ? undefined : -1} onClick={close}>
              Wołomin
            </Link>
            <Link href="/tworzenie-stron-internetowych-warszawa" tabIndex={open ? undefined : -1} onClick={close}>
              Warszawa
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
