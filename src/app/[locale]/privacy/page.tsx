import type { Metadata } from 'next';
import type { Locale } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { getSite, MISSING } from '@/content/data';

export async function generateMetadata({
  params,
}: PageProps<'/[locale]/privacy'>): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: 'privacy' });
  return { title: t('title') };
}

/**
 * What the pre-registration stores and why. A blank line in a text value starts a new paragraph
 * (`whitespace-pre-line`), so the owner can split long answers in content/text.
 */
export default async function Privacy({ params }: PageProps<'/[locale]/privacy'>) {
  const { locale } = await params;
  setRequestLocale(locale as Locale);
  const t = await getTranslations('privacy');
  const site = getSite();

  const sections = [
    ['whyHeading', 'why'],
    ['processorsHeading', 'processors'],
    ['retentionHeading', 'retention'],
    ['deletionHeading', 'deletion'],
  ] as const;
  const subheading = 'type-display mt-16 text-[1.9rem] md:text-[2.4rem]';

  return (
    <main id="main" tabIndex={-1} className="bg-mist px-[6.7%] pt-32 pb-28 outline-none md:pt-44">
      <article className="mx-auto max-w-[44rem]">
        <h1 className="type-display text-center text-[3.25rem] md:text-[5.25rem]">{t('title')}</h1>
        <p className="type-body mt-12 whitespace-pre-line">{t('intro')}</p>

        <h2 className={subheading}>{t('storedHeading')}</h2>
        <ul className="type-body mt-5 list-disc space-y-1 pl-5">
          <li>{t('storedEmail')}</li>
          <li>{t('storedGoogleId')}</li>
          <li>{t('storedLocale')}</li>
          <li>{t('storedCampaign')}</li>
          <li>{t('storedTime')}</li>
        </ul>

        {sections.map(([heading, body]) => (
          <section key={heading}>
            <h2 className={subheading}>{t(heading)}</h2>
            <p className="type-body mt-5 whitespace-pre-line">{t(body)}</p>
          </section>
        ))}

        <h2 className={subheading}>{t('contactHeading')}</h2>
        <p className="type-body mt-5 whitespace-pre-line">
          {t('contact', { email: site.privacyContactEmail ?? MISSING })}
        </p>
      </article>
    </main>
  );
}
