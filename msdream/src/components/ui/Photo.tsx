import Image from 'next/image';
import type { PhotoRef } from '@/lib/types';

const RATIO_CLASS: Record<Extract<PhotoRef, { kind: 'required' }>['ratio'], string> = {
  '4/5': 'aspect-[4/5]',
  '3/4': 'aspect-[3/4]',
  '1/1': 'aspect-square',
  '16/9': 'aspect-video',
  '3/2': 'aspect-[3/2]',
};

interface PhotoProps {
  photo: PhotoRef;
  /** `sizes` dla next/image — zawsze podawaj, inaczej przeglądarka pobierze za duży plik. */
  sizes: string;
  className?: string;
  /** Ustaw `true` wyłącznie dla obrazu LCP (hero). */
  priority?: boolean;
  quality?: 55 | 70 | 75 | 82 | 90;
}

/**
 * Jedyny sposób wyświetlania fotografii w serwisie.
 *
 * Kiedy zdjęcie nie zostało jeszcze dostarczone przez MSdream, komponent
 * renderuje **brief fotograficzny** zamiast przypadkowego zdjęcia stockowego.
 * To świadoma decyzja: stockowy koń na stronie prawdziwej stajni jest
 * natychmiast rozpoznawalny i podkopuje wiarygodność całego serwisu.
 *
 * Placeholder rezerwuje dokładne proporcje kadru, więc podmiana pliku
 * na prawdziwe zdjęcie nie wywoła przesunięcia układu (CLS = 0).
 */
export function Photo({ photo, sizes, className = '', priority = false, quality = 75 }: PhotoProps) {
  if (photo.kind === 'file') {
    return (
      <div className={`frame ${className}`}>
        <Image
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          sizes={sizes}
          quality={quality}
          priority={priority}
          loading={priority ? undefined : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
        />
      </div>
    );
  }

  return (
    <div
      className={`${RATIO_CLASS[photo.ratio]} ${className} relative overflow-hidden`}
      style={{
        background:
          'repeating-linear-gradient(135deg, var(--color-sand-300) 0 14px, var(--color-ivory-200) 14px 28px)',
      }}
      role="img"
      aria-label={photo.alt}
    >
      <div className="absolute inset-0 flex flex-col justify-end gap-2 p-4 sm:p-6">
        <span
          className="w-fit px-2 py-1 text-[0.625rem] font-medium uppercase tracking-[0.18em]"
          style={{ background: 'var(--color-forest-900)', color: 'var(--color-brass-300)' }}
        >
          Photo required
        </span>
        <p
          className="max-w-[46ch] text-xs leading-relaxed sm:text-sm"
          style={{ color: 'var(--color-graphite-700)' }}
        >
          {photo.brief}
        </p>
      </div>
    </div>
  );
}
