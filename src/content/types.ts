import type { Locale } from '@/config/site';

/**
 * Every piece of user-visible copy in the app, for one locale.
 * Both en.ts and ar.ts must satisfy this interface, so a missing
 * translation is a compile-time error.
 */
export interface InvitationContent {
  locale: Locale;
  dir: 'ltr' | 'rtl';

  /** Render digits as Eastern Arabic numerals (٠١٢…) in this locale. */
  useArabicNumerals: boolean;

  meta: {
    title: string;
    description: string;
    ogImageAlt: string;
  };

  intro: {
    /** Accessible name for the opening video. */
    videoLabel: string;
    /** Label under the play control shown before the video starts. */
    tapToOpen: string;
  };

  hero: {
    names: string;
    date: string;
    imageAlt: string;
    scrollCue: string;
  };

  invitation: {
    /** The poem-like invitation message, one entry per line. */
    lines: string[];
    familyA: string;
    familyB: string;
    inviteLine: string;
    groom: string;
    bride: string;
    /** Separator between the couple's names (an "and" / ampersand). */
    and: string;
  };

  countdown: {
    heading: string;
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    /** Shown instead of the timer once the wedding moment has passed. */
    dayArrived: string;
  };

  event: {
    heading: string;
    date: string;
    time: string;
  };

  venue: {
    heading: string;
    name: string;
    address: string;
    openInMaps: string;
    mapTitle: string;
  };

  closing: {
    line: string;
    monogram: string;
    /** RSVP deadline, the last practical line of the invitation. */
    rsvp: string;
  };

  audio: {
    mute: string;
    unmute: string;
  };

  languageToggle: {
    /** Text shown on the toggle (the *other* language's name). */
    label: string;
    ariaLabel: string;
  };
}
