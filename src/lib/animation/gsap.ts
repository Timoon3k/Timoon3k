import type { gsap as GsapNamespace } from 'gsap';

type GsapModules = {
  gsap: typeof GsapNamespace;
  ScrollTrigger: typeof import('gsap/ScrollTrigger').ScrollTrigger;
  SplitText: typeof import('gsap/SplitText').SplitText;
};

let cached: Promise<GsapModules> | null = null;

/**
 * GSAP ładowany dynamicznie — biblioteka i jej pluginy trafiają do osobnej
 * paczki, poza ścieżką krytyczną pierwszego renderu. Rejestracja pluginów
 * i wartości domyślne wykonują się dokładnie raz na sesję przeglądarki.
 */
export function loadGsap(): Promise<GsapModules> {
  cached ??= (async () => {
    const [{ gsap }, { ScrollTrigger }, { SplitText }] = await Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('gsap/SplitText'),
    ]);

    gsap.registerPlugin(ScrollTrigger, SplitText);
    gsap.defaults({ ease: 'power3.out', duration: 0.9 });

    return { gsap, ScrollTrigger, SplitText };
  })();

  return cached;
}
