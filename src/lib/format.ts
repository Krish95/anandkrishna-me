import { SITE } from '@/site.config';

const long = new Intl.DateTimeFormat(SITE.locale, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  timeZone: 'UTC',
});

const short = new Intl.DateTimeFormat(SITE.locale, {
  year: 'numeric',
  month: 'short',
  timeZone: 'UTC',
});

/** "14 August 2026" — for post headers. */
export const formatDate = (d: Date) => long.format(d);

/** "Aug 2026" — for compact lists and the notes feed. */
export const formatDateShort = (d: Date) => short.format(d);

/** `2026-08-14` for `<time datetime>`; machine-readable, no locale. */
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);

/**
 * Reading time in whole minutes at 220wpm.
 *
 * Counts the raw source, so MDX import statements and JSX tags inflate it
 * slightly. Close enough for a "6 min read" badge, and it costs no dependency.
 */
export function readingTime(body: string | undefined): number {
  if (!body) return 1;
  const text = body
    // Fenced code: keep it, but it reads faster than prose — count at 1/3.
    .replace(/```[\s\S]*?```/g, (block) => block.slice(0, Math.ceil(block.length / 3)))
    // Strip MDX/HTML tags and import/export lines.
    .replace(/^\s*(import|export)\s.+$/gm, '')
    .replace(/<[^>]+>/g, ' ');
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
