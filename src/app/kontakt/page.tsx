import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import ContactForm from '@/components/contact/ContactForm';
import FaqList from '@/components/ui/FaqList';
import { Eyebrow } from '@/components/ui/Section';
import { getFaq } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Kontakt — darmowa wycena strony internetowej w 24 h',
  description:
    'Opisz projekt w formularzu albo napisz e-mail. Odsyłam zakres prac, termin i wycenę — zwykle w ciągu 24 godzin. Wołomin, Warszawa, cała Polska.',
  path: '/kontakt',
});

const expectations = [
  {
    index: '01',
    title: 'Odpowiadam w 24 godziny',
    body: 'Zwykle tego samego dnia roboczego. Jeśli potrzebuję doprecyfikowania, zadaję konkretne pytania, zamiast odsyłać formularz briefowy na dziesięć stron.',
  },
  {
    index: '02',
    title: 'Dostajesz konkret',
    body: 'Zakres prac, termin i cena. Nie „przedział od–do”, który rośnie w trakcie realizacji, i nie prezentacja o tym, jacy jesteśmy wyjątkowi.',
  },
  {
    index: '03',
    title: 'Bez zobowiązań',
    body: 'Wycena nie oznacza umowy. Jeśli zakres albo cena Ci nie odpowiadają, po prostu nie kontynuujemy — bez ponaglających telefonów.',
  },
];

export default async function ContactPage() {
  const faq = await getFaq('general');

  return (
    <>
      <Breadcrumbs
        crumbs={[
          { name: 'Start', href: '/' },
          { name: 'Kontakt', href: '/kontakt' },
        ]}
      />

      <section className="container-page pt-14 pb-16 md:pt-20">
        <Eyebrow>Kontakt</Eyebrow>
        <h1 data-split="immediate" className="mt-7 max-w-[14ch] text-giant text-gradient-star">
          Opowiedz, co chcesz zbudować
        </h1>
        <p data-reveal className="mt-8 max-w-2xl text-lead text-dim">
          Nie potrzebujesz gotowej specyfikacji ani technicznego słownictwa. Wystarczy, że opiszesz
          swoją firmę i to, co strona ma dla Ciebie robić — resztę ustalimy razem.
        </p>
      </section>

      <section className="container-page pb-section">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          {/* Formularz */}
          <div id="formularz" className="scroll-mt-28 lg:col-span-7">
            <h2 className="eyebrow">Formularz zapytania</h2>
            <div className="mt-9">
              <ContactForm />
            </div>
          </div>

          {/* Dane kontaktowe */}
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="border-t border-hairline pt-8">
              <h2 className="eyebrow">Wolisz napisać bezpośrednio?</h2>
              <a
                href={`mailto:${site.email}`}
                className="link-underline mt-5 inline-block font-display text-[1.125rem] font-medium tracking-tight text-signal"
              >
                {site.email}
              </a>
              {site.phone ? (
                <a
                  href={`tel:${site.phone.replace(/\s/g, '')}`}
                  className="link-underline mt-3 block font-display text-[1.125rem] font-medium tracking-tight text-star"
                >
                  {site.phone}
                </a>
              ) : null}

              <dl className="mt-10 space-y-6">
                <div>
                  <dt className="eyebrow">Obszar</dt>
                  <dd className="mt-2.5 text-dim">
                    Wołomin i powiat wołomiński, Warszawa. Projekty zdalne — cała Polska.
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Spotkania</dt>
                  <dd className="mt-2.5 text-dim">
                    Możliwe na miejscu w Wołominie i okolicach. Poza tym obszarem — wideorozmowa.
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow">Profile</dt>
                  <dd className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                    {site.socials.map((social) => (
                      <a
                        key={social.href}
                        href={social.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="link-underline font-mono text-[0.6875rem] tracking-[0.12em] text-dim uppercase transition-colors hover:text-signal"
                      >
                        {social.label}
                      </a>
                    ))}
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-12 border-t border-hairline pt-8">
              <h2 className="eyebrow">Czego się spodziewać</h2>
              <ol className="mt-6 space-y-6">
                {expectations.map((item) => (
                  <li key={item.index} className="flex gap-4">
                    <span className="mt-1 font-mono text-[0.625rem] tracking-[0.14em] text-signal/70">
                      {item.index}
                    </span>
                    <div>
                      <h3 className="font-display font-semibold tracking-tight text-star">
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-dim">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </section>

      <FaqList items={faq} title="Zanim napiszesz" withSchema={false} />

      <section className="border-t border-hairline py-16">
        <div className="container-page">
          <p className="max-w-2xl text-dim">
            Szukasz informacji o zakresie i cenach? Zajrzyj do{' '}
            <Link href="/oferta" className="link-underline text-signal">
              oferty
            </Link>
            . Chcesz najpierw zobaczyć efekty? Otwórz{' '}
            <Link href="/portfolio" className="link-underline text-signal">
              portfolio
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
