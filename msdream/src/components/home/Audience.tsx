import Link from 'next/link';
import { Photo } from '@/components/ui/Photo';
import { photoRequired } from '@/lib/types';
import { CITY_LOCATIVE } from '@/lib/site';

/**
 * Dwa wejścia do oferty: dzieci i dorośli.
 *
 * To najczęstszy podział, jakiego dokonuje użytkownik w głowie, zanim
 * jeszcze spojrzy na cennik — dlatego dostaje osobne, duże wejście
 * zamiast filtra nad listą usług. Każdy blok linkuje do dedykowanej
 * podstrony SEO.
 */
export function Audience() {
  const blocks = [
    {
      index: '05',
      title: 'Dla dzieci',
      href: '/jazda-konna-dla-dzieci-lomianki',
      lead: 'Od pierwszego głaskania po samodzielny kłus.',
      body: `Zaczynamy od zajęć ABC — kontakt z koniem z ziemi, czyszczenie, krótka jazda prowadzona przez instruktora. Dopiero potem regularne zajęcia. Grupy są małe, żeby każde dziecko realnie jeździło.`,
      bullets: ['Od ok. 4 lat', 'Kask i sprzęt na miejscu', 'Rodzic obecny na zajęciach'],
      photo: photoRequired(
        'Dziecko w kasku na koniu prowadzonym przez instruktorkę, uśmiech, złota godzina — pion 3:4',
        `Jazda konna dla dzieci w ${CITY_LOCATIVE}`,
        '3/4',
      ),
    },
    {
      index: '06',
      title: 'Dla dorosłych',
      href: '/nauka-jazdy-konnej-lomianki',
      lead: 'Na konia można wsiąść pierwszy raz w każdym wieku.',
      body: `Duża część dorosłych kursantów zaczyna od zera — czasem po latach odkładania tego „na kiedyś". Pierwsze zajęcia prowadzimy na lonży, żebyś mógł skupić się na dosiadzie zamiast na sterowaniu.`,
      bullets: ['Bez górnej granicy wieku', 'Zajęcia indywidualne', 'Pakiety dla jeżdżących regularnie'],
      photo: photoRequired(
        'Dorosła osoba prowadząca konia za uzdę po piaszczystej drodze, tył kadru — pion 3:4',
        `Nauka jazdy konnej dla dorosłych w ${CITY_LOCATIVE}`,
        '3/4',
      ),
    },
  ];

  return (
    <section className="section" style={{ background: 'var(--color-ivory-200)' }}>
      <div className="shell">
        <div className="grid gap-x-[clamp(1.5rem,4vw,4rem)] gap-y-14 lg:grid-cols-2">
          {blocks.map((b, i) => (
            <article key={b.href} data-reveal data-reveal-delay={i * 0.08}>
              <Link href={b.href} className="group block">
                <Photo photo={b.photo} sizes="(max-width: 1023px) 100vw, 44vw" quality={75} />
              </Link>

              <p className="eyebrow mt-8">
                <span aria-hidden="true">{b.index}</span> {b.title}
              </p>

              <h3 className="mt-5" style={{ fontSize: 'var(--text-title)' }}>
                <Link href={b.href} className="rein-link">
                  {b.lead}
                </Link>
              </h3>

              <p
                className="mt-4 max-w-[48ch] text-[0.9375rem] leading-relaxed"
                style={{ color: 'var(--color-graphite-500)' }}
              >
                {b.body}
              </p>

              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-[0.12em]" style={{ color: 'var(--color-graphite-500)' }}>
                {b.bullets.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span aria-hidden="true" style={{ color: 'var(--color-brass-500)' }}>—</span>
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
