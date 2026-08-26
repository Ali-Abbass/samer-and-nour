import type { Locale } from '@/config/site';
import type { InvitationContent } from './types';
import { en } from './en';
import { ar } from './ar';

const contentByLocale: Record<Locale, InvitationContent> = { en, ar };

export function getContent(locale: Locale): InvitationContent {
  return contentByLocale[locale];
}

export type { InvitationContent };
