/**
 * English copy. Edit any string here to change what English visitors
 * see — components never hardcode text. Keep the structure identical
 * to ar.ts (both are typed against InvitationContent).
 */
import type { InvitationContent } from './types';

export const en: InvitationContent = {
  locale: 'en',
  dir: 'ltr',
  useArabicNumerals: false,

  meta: {
    title: 'Samer & Nourhane · October 9, 2026',
    description:
      'Because love is where every story begins — join us in celebrating the marriage of Samer & Nourhane. October 9, 2026 · Cielo Sky Venue, Rmeileh.',
    ogImageAlt: 'Samer and Nourhane smiling together under the trees at sunset',
  },

  intro: {
    videoLabel: 'Opening video of the wedding invitation of Samer & Nourhane',
    tapToOpen: 'Tap to open the invitation',
  },

  hero: {
    names: 'Samer & Nourhane',
    date: 'October 9, 2026',
    imageAlt: 'Samer and Nourhane smiling in front of old stone arches',
    scrollCue: 'Scroll to open your invitation',
  },

  invitation: {
    lines: [
      'Because love is where every story begins,',
      'And because you are such a cherished part of ours,',
      'Our celebration would be incomplete without you.',
    ],
    familyA: 'Mr. Atef Abbas & Family',
    familyB: 'Mr. Mohammad Chami & Family',
    inviteLine: 'Warmly invite you to join in celebrating the marriage of their children,',
    groom: 'Samer',
    bride: 'Nourhane',
    and: '&',
  },

  countdown: {
    heading: 'Counting down to forever',
    days: 'Days',
    hours: 'Hours',
    minutes: 'Minutes',
    seconds: 'Seconds',
    dayArrived: 'Today is the day',
  },

  event: {
    heading: 'Save the evening',
    date: 'October 9, 2026',
    time: '7:30 in the evening',
  },

  venue: {
    heading: 'The venue',
    name: 'Cielo Sky Venue',
    address: 'Palacio Hotel, 3rd Floor · Seaside Road, Rmeileh',
    openInMaps: 'Open in Google Maps',
    mapTitle: 'Map showing Cielo Sky Venue, Palacio Hotel, Rmeileh',
  },

  closing: {
    line: 'We can’t wait to celebrate with you.',
    monogram: 'S & N',
  },

  audio: {
    mute: 'Mute the music',
    unmute: 'Unmute the music',
  },

  languageToggle: {
    label: 'عربي',
    ariaLabel: 'اقرأ الدعوة بالعربية',
  },
};
