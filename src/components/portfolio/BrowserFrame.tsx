import type { ImageRef } from '@/lib/types';

/**
 * Ramka okna przeglądarki. Obraz dostaje jawne wymiary i `aspect-ratio`,
 * więc nie powoduje przesunięcia układu podczas ładowania.
 */
export default function BrowserFrame({
  image,
  domain,
  priority = false,
  className = '',
}: {
  image: ImageRef;
  domain: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <figure
      className={`overflow-hidden border border-hairline-strong bg-graphite shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-hairline bg-slate/60 px-4 py-3">
        <span aria-hidden className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-star/20" />
          <span className="h-2 w-2 rounded-full bg-star/20" />
          <span className="h-2 w-2 rounded-full bg-star/20" />
        </span>
        <span className="mx-auto truncate rounded-full bg-void/70 px-4 py-1 font-mono text-[0.625rem] tracking-[0.08em] text-faint">
          {domain}
        </span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className="w-full"
        style={{ aspectRatio: `${image.width} / ${image.height}` }}
      />
    </figure>
  );
}
