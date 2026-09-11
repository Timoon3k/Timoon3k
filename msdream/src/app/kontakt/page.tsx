import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { ContactForm } from '@/components/contact/ContactForm';
import { ContactLink } from '@/components/layout/ContactLink';
import { MapSection } from '@/components/sections/LazyMap';
import { getSiteData } from '@/lib/site-data';
import { telHref } from '@/lib/format';
import { buildMetadata } from '@/lib/seo';
import { CITY } from '@/lib/site';

export const metadata: Metadata = buildMetadata({
  title: 'Kontakt — szkoła jazdy konnej MSdream w Łomiankach',
  description:
    'Skontaktuj się z MSdream: telefon, e-mail, adres stajni w Łomiankach i formularz kontaktowy. Odpowiadamy zwykle tego samego dnia.',
  path: '/kontakt',
});

export default async function ContactPage() {
  const data = await getSiteData();

  return (
    <>
      <Breadcrumbs items={[{ name: 'Kontakt', href: '/kontakt' }]} />

      <section className="section section--tight">
        <div className="shell">
          <div className="grid-editorial gap-y-12">
            <div className="col-span-5">
              <h1 style={{ fontSize: 'var(--text-display)' }} data-reveal>
                Napisz albo
                <span style={{ fontStyle: 'italic', color: 'var(--color-brass-600)' }}> zadzwoń</span>
              </h1>
              <p
                className="mt-7 max-w-[40ch] text-[0.9375rem] leading-relaxed"
                style={{ color: 'var(--color-graphite-700)' }}
                data-reveal
                data-reveal-delay="0.08"
              >
                Jeśli chcesz po prostu zarezerwować termin — szybciej pójdzie przez{' '}
                <Link href="/rezerwacja" className="rein-link">kalendarz rezerwacji</Link>.
                Formularz jest dla pytań, na które kalendarz nie odpowie.
              </p>

              <dl className="mt-10 border-t" style={{ borderColor: 'var(--color-line)' }} data-reveal data-reveal-delay="0.12">
                <div className="border-b py-5" style={{ borderColor: 'var(--color-line)' }}>
                  <dt className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--color-graphite-500)' }}>Telefon</dt>
                  <dd className="mt-1.5 text-[1.0625rem]">
                    {data.phone ? (
                      <ContactLink href={telHref(data.phone)} event="phone_click" className="rein-link">
                        {data.phone}
                      </ContactLink>
                    ) : (
                      <span style={{ color: 'var(--color-brass-600)' }}>Numer — do uzupełnienia w CMS</span>
                    )}
                  </dd>
                </div>
                <div className="border-b py-5" style={{ borderColor: 'var(--color-line)' }}>
                  <dt className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--color-graphite-500)' }}>E-mail</dt>
                  <dd className="mt-1.5 text-[1.0625rem]">
                    {data.email ? (
                      <ContactLink href={`mailto:${data.email}`} event="email_click" className="rein-link">
                        {data.email}
                      </ContactLink>
                    ) : (
                      <span style={{ color: 'var(--color-brass-600)' }}>Adres — do uzupełnienia w CMS</span>
                    )}
                  </dd>
                </div>
                <div className="border-b py-5" style={{ borderColor: 'var(--color-line)' }}>
                  <dt className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--color-graphite-500)' }}>Adres</dt>
                  <dd className="mt-1.5 text-[1.0625rem]">
                    {data.street ?? <span style={{ color: 'var(--color-brass-600)' }}>Adres — do uzupełnienia w CMS</span>}
                    <br />
                    {data.postalCode} {CITY}
                  </dd>
                </div>
                {data.socials.length > 0 && (
                  <div className="border-b py-5" style={{ borderColor: 'var(--color-line)' }}>
                    <dt className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--color-graphite-500)' }}>Social media</dt>
                    <dd className="mt-1.5 flex flex-wrap gap-4 text-[1.0625rem]">
                      {data.socials.map((s) => (
                        <a key={s.href} href={s.href} className="rein-link" rel="noopener noreferrer" target="_blank">
                          {s.label}
                        </a>
                      ))}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="col-span-6 lg:col-start-7" data-reveal data-reveal-delay="0.1">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <MapSection data={data} tone="alt" />
    </>
  );
}
