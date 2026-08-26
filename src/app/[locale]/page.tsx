import { notFound } from 'next/navigation';
import { isLocale } from '@/config/site';
import { getContent } from '@/content';
import { AudioPlayer } from '@/components/AudioPlayer';
import { BackgroundImage } from '@/components/BackgroundImage';
import { Closing } from '@/components/Closing';
import { Countdown } from '@/components/Countdown';
import { EventDetails } from '@/components/EventDetails';
import { FilmGrain } from '@/components/FilmGrain';
import { Hero } from '@/components/Hero';
import { InvitationMessage } from '@/components/InvitationMessage';
import { LanguageToggle } from '@/components/LanguageToggle';
import { ScrollDirector } from '@/components/ScrollDirector';
import { Venue } from '@/components/Venue';
import { VideoIntro } from '@/components/VideoIntro';

interface PageProps {
  params: Promise<{ locale: string }>;
}

export default async function InvitationPage({ params }: PageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const content = getContent(locale);

  return (
    <>
      <VideoIntro content={content.intro}>
        <LanguageToggle locale={locale} toggle={content.languageToggle} />
      </VideoIntro>
      <LanguageToggle locale={locale} toggle={content.languageToggle} />
      <AudioPlayer labels={content.audio} />

      <BackgroundImage />
      <FilmGrain />
      <ScrollDirector />
      <main>
        <Hero content={content.hero} />
        <Countdown
          content={content.countdown}
          useArabicNumerals={content.useArabicNumerals}
        />
        <InvitationMessage content={content.invitation} />
        <EventDetails content={content.event} />
        <Venue content={content.venue} />
        <Closing content={content.closing} />
      </main>
    </>
  );
}
