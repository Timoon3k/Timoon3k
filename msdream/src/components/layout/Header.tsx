'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Logo } from './Logo';
import { NAV } from '@/lib/site';
import { track } from '@/lib/analytics';
import { useScrolledPast } from '@/lib/hooks/use-browser-state';

/**
 * Header.
 *
 * Desktop i mobile mają osobne zachowanie — mobile nie jest zwężonym
 * desktopem:
 *  • desktop — pasek zmienia się subtelnie przy scrollu (tło, wysokość, linia),
 *  • mobile  — pełnoekranowa nakładka nawigacyjna z animowanym wejściem
 *              pozycji, blokadą scrolla i pułapką focusu.
 */
export function Header() {
  const pathname = usePathname();
  // Stan „przescrollowano" — zmiana wyglądu paska.
  const scrolled = useScrolledPast(24);
  const [open, setOpen] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Zamknięcie menu przy zmianie trasy.
  //
  // Korekta stanu w trakcie renderu, a nie w efekcie — to wzorzec zalecany
  // przez React dla stanu zależnego od propsów. Efekt uruchomiłby się dopiero
  // po namalowaniu klatki, więc nakładka mignęłaby na nowej stronie.
  const [menuPathname, setMenuPathname] = useState(pathname);
  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setOpen(false);
  }

  // Blokada scrolla tła + Esc + pułapka focusu, gdy nakładka jest otwarta.
  useEffect(() => {
    if (!open) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    // Kompensujemy szerokość paska przewijania, żeby układ nie „skakał".
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== 'Tab') return;

      const focusables = overlayRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])',
      );
      if (!focusables || focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    // Focus na pierwszy element nakładki.
    overlayRef.current?.querySelector<HTMLElement>('a[href]')?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = '';
    };
  }, [open]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 transition-all duration-500"
        style={{
          transitionTimingFunction: 'var(--ease-editorial)',
          background: scrolled ? 'color-mix(in oklab, var(--color-ivory-100) 88%, transparent)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px) saturate(1.1)' : 'none',
          borderBottom: `1px solid ${scrolled ? 'var(--color-line)' : 'transparent'}`,
          color: 'var(--color-graphite-900)',
        }}
      >
        <div
          className="shell flex items-center justify-between transition-all duration-500"
          style={{
            transitionTimingFunction: 'var(--ease-editorial)',
            height: scrolled ? '4.25rem' : '5.5rem',
          }}
        >
          <Link href="/" aria-label="MSdream — strona główna" className="relative z-10">
            <Logo size={scrolled ? 30 : 34} />
          </Link>

          {/* --- Nawigacja desktop --- */}
          <nav aria-label="Nawigacja główna" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {NAV.filter((n) => n.href !== '/').map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="rein-link text-[0.8125rem] uppercase tracking-[0.11em]"
                    style={{
                      color: isActive(item.href)
                        ? 'var(--color-brass-600)'
                        : 'var(--color-graphite-700)',
                    }}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/rezerwacja"
              className="btn hidden sm:inline-flex"
              style={{ minHeight: '2.75rem', padding: '0.6rem 1.35rem' }}
              onClick={() => track('booking_click', { location: 'header' })}
            >
              Zarezerwuj
            </Link>

            {/* --- Przełącznik menu mobile --- */}
            <button
              ref={toggleRef}
              type="button"
              className="relative z-10 flex items-center justify-center lg:hidden"
              style={{ width: '3rem', height: '3rem', marginRight: '-0.75rem' }}
              aria-expanded={open}
              aria-controls="menu-mobile"
              onClick={() => setOpen((v) => !v)}
            >
              <span className="visually-hidden">{open ? 'Zamknij menu' : 'Otwórz menu'}</span>
              <span aria-hidden="true" className="relative block" style={{ width: 24, height: 12 }}>
                <span
                  className="absolute left-0 block h-px w-full transition-all duration-400"
                  style={{
                    background: open ? 'var(--color-ivory-100)' : 'currentColor',
                    top: open ? 6 : 0,
                    transform: open ? 'rotate(45deg)' : 'none',
                    transitionTimingFunction: 'var(--ease-editorial)',
                  }}
                />
                <span
                  className="absolute left-0 block h-px w-full transition-all duration-400"
                  style={{
                    background: open ? 'var(--color-ivory-100)' : 'currentColor',
                    top: open ? 6 : 12,
                    transform: open ? 'rotate(-45deg)' : 'none',
                    transitionTimingFunction: 'var(--ease-editorial)',
                  }}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* --- Nakładka mobile ------------------------------------------------
          Pełny ekran, ciemna zieleń, typografia display. Świadomie NIE jest
          to rozwijana biała lista pod paskiem. */}
      <div
        id="menu-mobile"
        ref={overlayRef}
        className="fixed inset-0 z-40 lg:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        {...(open ? {} : { inert: true })}
        style={{
          background: 'var(--color-forest-900)',
          color: 'var(--color-ivory-100)',
          clipPath: open ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)',
          transition: 'clip-path 0.75s var(--ease-editorial)',
          visibility: open ? 'visible' : 'hidden',
          transitionProperty: 'clip-path, visibility',
        }}
      >
        <div className="flex h-full flex-col justify-between overflow-y-auto px-[var(--spacing-gutter)] pt-28 pb-10">
          <nav aria-label="Nawigacja mobilna">
            <ul>
              {NAV.map((item, i) => (
                <li key={item.href} className="border-b" style={{ borderColor: 'color-mix(in oklab, var(--color-ivory-100) 14%, transparent)' }}>
                  <Link
                    href={item.href}
                    className="block py-4"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.75rem, 8vw, 2.5rem)',
                      lineHeight: 1.1,
                      color: isActive(item.href) ? 'var(--color-brass-300)' : 'inherit',
                      // Kaskadowe wejście pozycji — tylko przy otwieraniu.
                      opacity: open ? 1 : 0,
                      translate: open ? '0 0' : '0 1rem',
                      transition: `opacity 0.5s var(--ease-editorial) ${open ? 0.18 + i * 0.05 : 0}s, translate 0.5s var(--ease-editorial) ${open ? 0.18 + i * 0.05 : 0}s`,
                    }}
                    aria-current={isActive(item.href) ? 'page' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-10 flex flex-col gap-4">
            <Link
              href="/rezerwacja"
              className="btn btn--brass w-full"
              onClick={() => track('booking_click', { location: 'menu_mobile' })}
            >
              Zarezerwuj jazdę
            </Link>
            <Link href="/rezerwacja-tuftingu" className="btn btn--ghost-light w-full">
              Zarezerwuj tufting
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
