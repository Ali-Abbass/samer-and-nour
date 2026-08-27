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
    title: 'سامر ونورهان · ٩ تشرين الأول ٢٠٢٦',
    description:
      'لأنه الحب أصل الحكاية والبدايات الجديدة — شاركونا فرحة زفاف سامر ونورهان. ٩ تشرين الأول ٢٠٢٦ · سييلو سكاي فينيو، الرميلة.',
    ogImageAlt: 'سامر ونورهان يبتسمان تحت الأشجار عند الغروب',
  },

  intro: {
    videoLabel: 'فيديو افتتاح دعوة زفاف سامر ونورهان',
    tapToOpen: 'اضغطوا لفتح الدعوة',
  },

  hero: {
    names: 'سامر ونورهان',
    date: '٩ تشرين الأول ٢٠٢٦',
    imageAlt: 'سامر ونورهان يبتسمان أمام أقواس حجرية قديمة',
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
    heading: 'العدّ التنازلي ليوم الفرح',
    days: 'يوم',
    hours: 'ساعة',
    minutes: 'دقيقة',
    seconds: 'ثانية',
    dayArrived: 'اليوم هو اليوم الموعود',
  },

  event: {
    heading: 'احفظوا الموعد',
    date: '٩ تشرين الأول ٢٠٢٦',
    time: 'الساعة ٧:٣٠ مساءً',
  },

  venue: {
    heading: 'المكان',
    name: 'سييلو سكاي فينيو',
    address: 'فندق بالاسيو، الطابق الثالث · الطريق البحري، الرميلة',
    openInMaps: 'افتحوا الموقع على الخرائط',
    mapTitle: 'خريطة تُظهر موقع سييلو سكاي فينيو، فندق بالاسيو، الرميلة',
  },

  closing: {
    line: 'بانتظار أن نفرح بلقائكم.',
    monogram: 'سامر ونورهان',
    rsvp: 'تأكيد الحضور ضروري قبل ٢٠ أيلول',
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
