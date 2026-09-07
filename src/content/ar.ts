/**
 * Arabic copy. Edit any string here to change what Arabic visitors
 * see — components never hardcode text. Keep the structure identical
 * to en.ts (both are typed against InvitationContent).
 *
 * Flip `useArabicNumerals` to true to render the countdown and dates
 * with Eastern Arabic numerals (٠١٢…) instead of Latin digits.
 */
import type { InvitationContent } from './types';

export const ar: InvitationContent = {
  locale: 'ar',
  dir: 'rtl',
  useArabicNumerals: false,

  meta: {
    title: 'حفل زفاف سامر و نورهان',
    description: '٩ تشرين الأول ٢٠٢٦\n\n📍سييلو سكاي فينيو، الرميلة',
    ogImageAlt: 'سامر ونورهان بثياب السهرة يتبادلان الابتسام',
  },

  intro: {
    videoLabel: 'فيديو افتتاح دعوة زفاف سامر ونورهان',
    tapToOpen: 'اضغطوا لفتح الدعوة',
  },

  hero: {
    lead: 'حفل زفاف',
    names: 'سامر ونورهان',
    date: '٩ تشرين الأول ٢٠٢٦',
    imageAlt: 'سامر ونورهان بثياب السهرة يتبادلان الابتسام',
    scrollCue: 'مرّروا للأسفل لفتح الدعوة',
  },

  invitation: {
    lines: [
      'لأنه الحب أصل الحكاية والبدايات الجديدة',
      'ولإنكم جزء من قصتنا',
      'ما بينقصنا إلّا وجودكم',
    ],
    familyA: 'السيد عاطف عبّاس وعائلته',
    familyB: 'السيد محمد شامي وعائلته',
    inviteLine: 'يتشرّفان بدعوتكم لحضور حفل زفاف ولديهما',
    groom: 'سامر',
    bride: 'نورهان',
    and: 'و',
  },

  countdown: {
    heading: 'العدّ التنازلي',
    days: 'يوم',
    hours: 'ساعة',
    minutes: 'دقيقة',
    seconds: 'ثانية',
    dayArrived: 'اليوم هو اليوم الموعود',
  },

  event: {
    heading: 'ناطرينكم ب',
    date: '٩ تشرين الأول ٢٠٢٦',
    time: 'الساعة ٦:٣٠ مساءً',
  },

  venue: {
    heading: 'مكان الحفل',
    name: 'سييلو سكاي فينيو',
    address: 'فندق بالاسيو، الطابق الثالث · الطريق البحري، الرميلة',
    openInMaps: 'افتحوا الموقع على الخرائط',
    mapTitle: 'خريطة تُظهر موقع سييلو سكاي فينيو، فندق بالاسيو، الرميلة',
  },

  closing: {
    line: 'حفل زفاف',
    monogram: 'سامر ونورهان',
    rsvp: 'تأكيد الحضور ضروري قبل ٣٠ أيلول',
  },

  audio: {
    mute: 'كتم الموسيقى',
    unmute: 'تشغيل الموسيقى',
  },

  languageToggle: {
    label: 'EN',
    ariaLabel: 'Read the invitation in English',
  },
};
