import { getTranslations } from 'next-intl/server';
import { LanguageSwitch } from '@/components/ui/LanguageSwitch';
import { MobileMenu } from '@/components/ui/MobileMenu';
import { Link } from '@/i18n/navigation';
import { navSections } from './sections';

/**
 * As on p3re.jp: from 1024 px a row of links over the top of the hero that scrolls away with it;
 * below that, the blue corner button that stays in place and opens the full-screen menu.
 */
export async function Header() {
  const t = await getTranslations();

  return (
    <header>
      <div className="absolute inset-x-0 top-0 z-30 hidden justify-end px-[4.7vw] pt-8 lg:flex">
        <nav aria-label={t('common.mainNav')}>
          <ul className="flex items-center gap-x-10">
            {navSections.map((id) => (
              <li key={id}>
                <Link
                  href={{ pathname: '/', hash: id }}
                  className="flex min-h-11 items-center text-[19px] font-semibold transition-opacity hover:opacity-60"
                >
                  {t(`nav.${id}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <span aria-hidden="true" className="bg-ink mx-8 h-4 w-px self-center" />
        <LanguageSwitch variant="menu" />
      </div>
      <MobileMenu />
    </header>
  );
}
