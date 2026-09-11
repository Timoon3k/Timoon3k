import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { getLegalDocument } from '@/cms/content';

/**
 * Wspólny szkielet dokumentów prawnych.
 *
 * Treść pochodzi z CMS-u (WordPress → Dokumenty prawne). Jeśli dokumentu
 * jeszcze nie ma, NIE generujemy zastępczej treści prawnej — wyświetlamy
 * jawną informację i dane kontaktowe.
 *
 * To celowa decyzja: wygenerowana „polityka prywatności” wygląda jak
 * dokument, ale nie opisuje rzeczywistych procesów przetwarzania danych
 * w tej firmie. Dokument, który wprowadza w błąd co do praw użytkownika,
 * jest gorszy niż jego brak — dlatego treść musi dostarczyć właściciel
 * (obowiązujące dokumenty z msdream.pl albo od swojego prawnika).
 */
export async function LegalPage({
  slug,
  title,
  intro,
}: {
  slug: string;
  title: string;
  intro: string;
}) {
  const document = await getLegalDocument(slug);

  return (
    <>
      <Breadcrumbs items={[{ name: title, href: `/${slug}` }]} />

      <section className="section section--tight">
        <div className="shell">
          <div className="grid-editorial gap-y-10">
            <div className="col-span-4">
              <h1 style={{ fontSize: 'var(--text-title)' }}>{document?.title ?? title}</h1>
              <p className="mt-5 max-w-[34ch] text-[0.875rem] leading-relaxed" style={{ color: 'var(--color-graphite-500)' }}>
                {intro}
              </p>
            </div>

            <div className="col-span-7 lg:col-start-6">
              {document ? (
                <div className="prose" style={{ color: 'var(--color-graphite-700)' }}>
                  <div dangerouslySetInnerHTML={{ __html: document.body }} />
                </div>
              ) : (
                <div
                  className="p-6 sm:p-8"
                  style={{ background: 'var(--color-ivory-50)', border: '1px solid var(--color-line)' }}
                >
                  <p className="eyebrow">Dokument do uzupełnienia</p>
                  <p className="mt-5 max-w-[52ch] text-[0.9375rem] leading-relaxed" style={{ color: 'var(--color-graphite-700)' }}>
                    Treść tego dokumentu nie została jeszcze wprowadzona do systemu
                    zarządzania treścią.
                  </p>
                  <p className="mt-4 max-w-[52ch] text-[0.875rem] leading-relaxed" style={{ color: 'var(--color-graphite-500)' }}>
                    Świadomie nie generujemy tu zastępczej treści prawnej. Dokument
                    musi opisywać rzeczywiste zasady obowiązujące w MSdream —
                    najlepiej przenieść obowiązującą wersję z dotychczasowej strony
                    albo skorzystać z dokumentu przygotowanego przez prawnika.
                  </p>
                  <p className="mt-4 text-[0.875rem]" style={{ color: 'var(--color-graphite-500)' }}>
                    Jak dodać: <strong>WordPress → Dokumenty prawne → Dodaj</strong>,
                    ustawiając uproszczony adres (slug) na <code>{slug}</code>.
                    Instrukcja krok po kroku: <strong>CMS-GUIDE.md</strong>.
                  </p>
                  <p className="mt-6 text-[0.875rem]" style={{ color: 'var(--color-graphite-500)' }}>
                    W sprawach dotyczących danych osobowych napisz do nas przez{' '}
                    <Link href="/kontakt" className="rein-link">formularz kontaktowy</Link>.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
