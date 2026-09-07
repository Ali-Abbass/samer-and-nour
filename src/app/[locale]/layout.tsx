import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { ASSETS, LOCALES, SITE_URL, isLocale } from '@/config/site';
import { getContent } from '@/content';
import { fontClassesByLocale, scriptScaleByLocale } from './fonts';
import '../globals.css';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

// Static export: only the locales above exist; anything else is the
// exported 404.html rather than a request-time lookup.
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: Pick<LocaleLayoutProps, 'params'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  // Page URLs are built absolutely so they stay correct whether the site
  // lives at a domain root or under a "/<repo>" base path.
  const pageUrl = (l: string) => `${SITE_URL}/${l}/`;

  return {
    metadataBase: new URL(SITE_URL),
    title: content.meta.title,
    description: content.meta.description,
    alternates: {
      languages: { en: pageUrl('en'), ar: pageUrl('ar') },
    },
    icons: {
      icon: ASSETS.favicon,
      apple: ASSETS.appleTouchIcon,
    },
    openGraph: {
      title: content.meta.title,
      description: content.meta.description,
      type: 'website',
      locale: locale === 'ar' ? 'ar_LB' : 'en_US',
      url: pageUrl(locale),
      images: [
        {
          url: ASSETS.ogImage,
          width: 1200,
          height: 630,
          alt: content.meta.ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: content.meta.title,
      description: content.meta.description,
      images: [ASSETS.ogImage],
    },
  };
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ebe8e1',
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  return (
    <html
      lang={locale}
      dir={content.dir}
      className={fontClassesByLocale[locale]}
      // Sizes for `.script-names` are all multiplied by this, so
      // swapping the script face in fonts.ts needs no size edits.
      style={{ '--script-scale': scriptScaleByLocale[locale] } as React.CSSProperties}
    >
      <body>
        {/* Runs before hydration, and before the browser would restore a
            scroll offset of its own.

            Reopening the link (a tap from WhatsApp, a reload, a return
            to the tab) otherwise lands the guest at the pixel offset
            they left at. That offset was measured against whatever the
            viewport height was then — and iOS Safari's viewport changes
            with its toolbars — so on the way back it rarely lines up
            with a section boundary any more. The intro covers it, and
            when the intro lifts the guest is stranded between two
            scenes; `scroll-snap-stop: always` then makes it a fight to
            get back, because each flick advances only one section.

            The `#s…` hash from the language toggle is a deliberate
            destination, so it is left alone. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{if('scrollRestoration' in history)history.scrollRestoration='manual';if(!location.hash)window.scrollTo(0,0);}catch(e){}})();",
          }}
        />
        {children}
      </body>
    </html>
  );
}
