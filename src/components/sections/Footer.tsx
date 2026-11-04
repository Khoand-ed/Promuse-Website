import { getLocale, getTranslations } from 'next-intl/server';
import { Fragment } from 'react';
import { FacebookLogo, XLogo } from '@/components/ui/icons';
import { Wordmark } from '@/components/ui/Wordmark';
import { getSite, MISSING } from '@/content/data';
import { getPathname, Link } from '@/i18n/navigation';
import { env } from '@/lib/env';

const spec = ['title', 'release', 'genre', 'players', 'platform'] as const;

/** p3re.jp's footer: logo, SPEC table, LINKS and SHARE, a hairline, then the small print. */
export async function Footer() {
  const t = await getTranslations('footer');
  const locale = await getLocale();
  const site = getSite();

  const social = (Object.keys(site.social) as (keyof typeof site.social)[]).filter(
    (key) => site.social[key] !== '',
  );
  const pageUrl = new URL(getPathname({ href: '/', locale }), env.NEXT_PUBLIC_SITE_URL).toString();
  const share = [
    {
      label: t('shareX'),
      icon: <XLogo />,
      href: `https://x.com/intent/post?${new URLSearchParams({ text: t('shareText'), url: pageUrl, hashtags: site.shareHashtag })}`,
    },
    {
      label: t('shareFacebook'),
      icon: <FacebookLogo />,
      href: `https://www.facebook.com/sharer/sharer.php?${new URLSearchParams({ u: pageUrl })}`,
    },
  ];
  const heading = 'type-label text-[16px] font-bold tracking-[0.12em]';

  return (
    <footer className="bg-white px-[6.7%] pt-24 pb-[70px] md:px-[5vw] md:pt-[110px]">
      <div className="grid gap-14 lg:grid-cols-[228px_minmax(0,1fr)_minmax(0,9.5rem)_auto] lg:gap-x-[72px]">
        <div className="flex items-center justify-center lg:justify-start">
          <Wordmark sizes="228px" className="text-[2.4rem]" />
        </div>

        <section aria-labelledby="footer-spec">
          <h2 id="footer-spec" className={heading}>
            {t('specHeading')}
          </h2>
          <dl className="mt-7 grid grid-cols-[minmax(0,8rem)_minmax(0,1fr)] gap-x-4 gap-y-2.5 text-[14px] leading-[21px] lg:grid-cols-[175px_minmax(0,1fr)]">
            {spec.map((row) => (
              <Fragment key={row}>
                <dt>{t(`spec.${row}Label`)}</dt>
                <dd>{t(`spec.${row}Value`)}</dd>
              </Fragment>
            ))}
          </dl>
        </section>

        {social.length > 0 ? (
          <section aria-labelledby="footer-links">
            <h2 id="footer-links" className={heading}>
              {t('linksHeading')}
            </h2>
            <ul className="mt-5 text-[14px] leading-[32px]">
              {social.map((key) => (
                <li key={key}>
                  <a
                    href={site.social[key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {t(`social.${key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section aria-labelledby="footer-share" className="lg:col-start-4">
          <h2 id="footer-share" className={heading}>
            {t('shareHeading')}
          </h2>
          <ul className="mt-4 -ml-1.5 flex gap-3 text-[32px]">
            {share.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={item.label}
                  className="grid size-11 place-items-center transition-opacity hover:opacity-60"
                >
                  {item.icon}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <hr className="border-rule mt-14" />

      {/* A Google Play badge replaces this line once there is a store link (P7). */}
      <p className="mt-12 text-[14px]">{t('store')}</p>

      <p className="mt-20 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[12px]">
        <Link href="/privacy" className="underline-offset-4 hover:underline">
          {t('privacy')}
        </Link>
        <span>{t('copyright', { holder: site.copyrightHolder ?? MISSING })}</span>
      </p>
    </footer>
  );
}
