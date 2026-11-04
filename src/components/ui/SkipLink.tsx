import { getTranslations } from 'next-intl/server';

/** The first stop for keyboard users: jumps past the navigation to the page content. */
export async function SkipLink() {
  const t = await getTranslations('common');
  return (
    <a
      href="#main"
      className="pill sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
    >
      {t('skipToContent')}
    </a>
  );
}
