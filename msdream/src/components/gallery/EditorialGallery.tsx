'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Photo } from '@/components/ui/Photo';
import { track } from '@/lib/analytics';
import type { GalleryImage } from '@/lib/types';

/**
 * Galeria editorialowa.
 *
 * Układ jest celowo nieregularny — nie trzy kolumny po trzy zdjęcia.
 * Na desktopie działa siatka 12-kolumnowa, w której każdy kadr ma własny
 * rozstaw i wysokość; na mobile układ zwija się do jednej kolumny
 * z zachowaniem rytmu (kadry naprzemiennie pełne i wcięte).
 *
 * Lightbox jest dostępny: pułapka focusu, Esc, strzałki, przywrócenie focusu
 * na miniaturę po zamknięciu.
 */

const SPAN: Record<GalleryImage['span'], string> = {
  hero: 'lg:col-span-8',
  wide: 'lg:col-span-7',
  tall: 'lg:col-span-4',
  square: 'lg:col-span-5',
};

/** Rytm pionowy — przesunięcia, które łamią równą linię wierszy. */
const OFFSET: Record<GalleryImage['span'], string> = {
  hero: '',
  wide: 'lg:mt-16',
  tall: 'lg:mt-24',
  square: 'lg:mt-8',
};

export function EditorialGallery({ images }: { images: readonly GalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const triggersRef = useRef<Array<HTMLButtonElement | null>>([]);
  const lastIndexRef = useRef<number | null>(null);

  const close = useCallback(() => {
    const previous = lastIndexRef.current;
    setIndex(null);
    // Focus wraca na miniaturę, z której otwarto podgląd.
    if (previous != null) triggersRef.current[previous]?.focus();
  }, []);

  const move = useCallback(
    (delta: number) => {
      setIndex((current) => {
        if (current == null) return current;
        const next = (current + delta + images.length) % images.length;
        lastIndexRef.current = next;
        return next;
      });
    },
    [images.length],
  );

  useEffect(() => {
    if (index == null) return;
    lastIndexRef.current = index;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') move(1);
      else if (e.key === 'ArrowLeft') move(-1);
      else if (e.key === 'Tab') {
        // Pułapka focusu — w lightboxie są tylko przyciski sterujące.
        const focusables = dialogRef.current?.querySelectorAll<HTMLElement>('button');
        if (!focusables?.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    dialogRef.current?.querySelector('button')?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      body.style.overflow = previousOverflow;
    };
  }, [index, close, move]);

  const active = index == null ? null : images[index];

  return (
    <>
      <div className="grid gap-x-[clamp(1rem,2.5vw,2rem)] gap-y-[clamp(1.5rem,4vw,3rem)] lg:grid-cols-12">
        {images.map((image, i) => (
          <figure
            key={i}
            className={`${SPAN[image.span]} ${OFFSET[image.span]} ${i % 3 === 2 ? 'lg:col-start-6' : ''}`}
            data-reveal
            data-reveal-delay={(i % 3) * 0.06}
          >
            <button
              type="button"
              ref={(el) => {
                triggersRef.current[i] = el;
              }}
              className="block w-full cursor-zoom-in text-left"
              onClick={() => {
                setIndex(i);
                track('gallery_open', { position: i });
              }}
              aria-label={`Powiększ zdjęcie: ${image.photo.alt}`}
            >
              <Photo
                photo={image.photo}
                sizes="(max-width: 1023px) 100vw, 55vw"
                quality={image.span === 'hero' ? 82 : 75}
              />
            </button>
            {image.caption && (
              <figcaption
                className="mt-3 text-xs uppercase tracking-[0.14em]"
                style={{ color: 'var(--color-graphite-500)' }}
              >
                {image.caption}
              </figcaption>
            )}
          </figure>
        ))}
      </div>

      {/* --- Lightbox --- */}
      {active && (
        <div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={active.photo.alt}
          className="fixed inset-0 z-[70] flex flex-col"
          style={{ background: 'color-mix(in oklab, var(--color-forest-950) 96%, transparent)' }}
        >
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <p className="text-xs uppercase tracking-[0.16em]" style={{ color: 'var(--color-sand-400)' }}>
              {index! + 1} / {images.length}
            </p>
            <button
              type="button"
              onClick={close}
              className="flex items-center justify-center"
              style={{ width: '3rem', height: '3rem', color: 'var(--color-ivory-100)' }}
            >
              <span className="visually-hidden">Zamknij podgląd</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                <path d="M4 4L16 16M16 4L4 16" stroke="currentColor" strokeWidth="1.25" />
              </svg>
            </button>
          </div>

          <div className="flex min-h-0 flex-1 items-center justify-center px-4 pb-4 sm:px-12">
            <div className="max-h-full w-full max-w-4xl">
              <Photo photo={active.photo} sizes="(max-width: 1023px) 100vw, 60rem" quality={90} />
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 pb-6" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
            <button type="button" onClick={() => move(-1)} className="btn btn--ghost-light" style={{ minHeight: '3rem' }}>
              <span className="visually-hidden">Poprzednie zdjęcie</span>
              <span aria-hidden="true">←</span>
            </button>
            <button type="button" onClick={() => move(1)} className="btn btn--ghost-light" style={{ minHeight: '3rem' }}>
              <span className="visually-hidden">Następne zdjęcie</span>
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
