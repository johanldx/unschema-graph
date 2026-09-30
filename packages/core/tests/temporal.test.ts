import {
  Article,
  addDuration,
  diffDuration,
  Event,
  formatIsoDate,
  JobPosting,
  Offer,
  parseDate,
  parseDurationToMs,
  SchemaValidationError,
} from '@unschema-graph/core';
import { describe, expect, it } from 'vitest';

describe('Temporal & Date Utilities', () => {
  describe('parseDate & formatIsoDate', () => {
    it('handles Date instances and timestamp numbers', () => {
      const d = new Date('2026-09-28T12:00:00.000Z');
      expect(formatIsoDate(d)).toBe('2026-09-28T12:00:00.000Z');

      // Timestamp in milliseconds
      expect(formatIsoDate(d.getTime())).toBe('2026-09-28T12:00:00.000Z');

      // Unix timestamp in seconds (10 digits)
      const seconds = Math.floor(d.getTime() / 1000);
      expect(formatIsoDate(seconds)).toBe('2026-09-28T12:00:00.000Z');
    });

    it('preserves clean YYYY-MM-DD date strings for Google SEO', () => {
      expect(formatIsoDate('2026-09-28')).toBe('2026-09-28');
    });

    it('preserves explicit ISO timestamps with timezone offsets', () => {
      expect(formatIsoDate('2026-09-28T12:00:00Z')).toBe('2026-09-28T12:00:00Z');
      expect(formatIsoDate('2026-09-28T14:00:00+02:00')).toBe('2026-09-28T14:00:00+02:00');
    });

    it('resolves keyword tokens: now, today, tomorrow, yesterday', () => {
      const now = formatIsoDate('now');
      expect(now).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d+Z$/);

      const today = formatIsoDate('today');
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      const tomorrow = parseDate('tomorrow');
      const yesterday = parseDate('yesterday');
      expect(tomorrow).not.toBeNull();
      expect(yesterday).not.toBeNull();
      expect(tomorrow!.getTime()).toBeGreaterThan(yesterday!.getTime());
    });

    it('resolves relative date expressions (+30d, +2w, +6m, +1y, -7d)', () => {
      const refDate = new Date('2026-09-28T12:00:00.000Z');

      const in30Days = parseDate('+30d', refDate);
      expect(in30Days).not.toBeNull();
      expect(in30Days!.getUTCDate()).toBe(28);
      expect(in30Days!.getUTCMonth()).toBe(9); // October (0-indexed: 9)

      const in2Weeks = parseDate('+2w', refDate);
      expect(in2Weeks!.getTime() - refDate.getTime()).toBe(14 * 86400000);

      const in1Year = parseDate('+1y', refDate);
      expect(in1Year!.getUTCFullYear()).toBe(2027);

      const pastWeek = parseDate('-7d', refDate);
      expect(refDate.getTime() - pastWeek!.getTime()).toBe(7 * 86400000);
    });

    it('fails safely and throws on invalid date inputs', () => {
      expect(parseDate('not-a-valid-date')).toBeNull();
      expect(parseDate(new Date('invalid'))).toBeNull();

      expect(() => formatIsoDate('not-a-valid-date')).toThrow(/Cannot parse "not-a-valid-date"/);
    });
  });

  describe('addDuration & diffDuration', () => {
    it('adds string, object, and numeric durations to dates', () => {
      const start = '2026-10-15T14:00:00.000Z';

      // String duration
      expect(addDuration(start, '2h30')).toBe('2026-10-15T16:30:00.000Z');
      expect(addDuration(start, '45m')).toBe('2026-10-15T14:45:00.000Z');

      // Object duration
      expect(addDuration(start, { days: 1, hours: 2 })).toBe('2026-10-16T16:00:00.000Z');

      // Numeric minutes
      expect(addDuration(start, 90)).toBe('2026-10-15T15:30:00.000Z');
    });

    it('calculates ISO 8601 duration difference between two dates', () => {
      const start = '2026-10-15T14:00:00.000Z';
      const end = '2026-10-15T16:45:30.000Z';

      expect(diffDuration(start, end)).toBe('PT2H45M30S');

      const multidayEnd = '2026-10-17T18:00:00.000Z';
      expect(diffDuration(start, multidayEnd)).toBe('P2DT4H');
    });

    it('converts duration inputs to accurate milliseconds', () => {
      expect(parseDurationToMs('1h30')).toBe(5400000);
      expect(parseDurationToMs(45)).toBe(2700000);
      expect(parseDurationToMs({ hours: 1, minutes: 15 })).toBe(4500000);
      expect(parseDurationToMs('PT1H30M')).toBe(5400000);
    });
  });

  describe('Schema Integration with Relative & Calculated Dates', () => {
    it('Event: automatically calculates endDate from startDate + duration', () => {
      const event = Event({
        name: 'Astro Meetup Paris',
        location: 'Paris, France',
        startDate: '2026-10-15T18:30:00.000Z',
        duration: '2h30',
      });

      expect(event.startDate).toBe('2026-10-15T18:30:00.000Z');
      expect(event.duration).toBe('PT2H30M');
      expect(event.endDate).toBe('2026-10-15T21:00:00.000Z');
    });

    it('Event: respects explicitly provided endDate even when duration is specified', () => {
      const event = Event({
        name: 'Conference',
        location: 'Lyon',
        startDate: '2026-10-15T09:00:00.000Z',
        endDate: '2026-10-15T18:00:00.000Z',
        duration: '9h',
      });

      expect(event.endDate).toBe('2026-10-15T18:00:00.000Z');
    });

    it('JobPosting: resolves datePosted and relative validThrough', () => {
      const job = JobPosting({
        title: 'Fullstack Dev',
        description: 'Great role',
        datePosted: 'today',
        validThrough: '+30d',
        hiringOrganization: 'Rootage',
      });

      expect(job.datePosted).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(job.validThrough).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    });

    it('Offer: accepts relative priceValidUntil (+1y)', () => {
      const offer = Offer({
        price: 99,
        priceCurrency: 'EUR',
        priceValidUntil: '+1y',
      });

      expect(offer.priceValidUntil).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      const year = parseInt(offer.priceValidUntil!.slice(0, 4), 10);
      expect(year).toBeGreaterThanOrEqual(new Date().getUTCFullYear() + 1);
    });

    it('Article: catches invalid dates at validation time with descriptive error', () => {
      expect(() =>
        Article({
          headline: 'Valid Headline',
          image: 'https://site.fr/img.jpg',
          author: 'Alice',
          datePublished: 'pas-du-tout-une-date',
        })
      ).toThrow(SchemaValidationError);

      try {
        Article({
          headline: 'Valid Headline',
          image: 'https://site.fr/img.jpg',
          author: 'Alice',
          datePublished: 'pas-du-tout-une-date',
        });
      } catch (err) {
        expect((err as SchemaValidationError).message).toContain(
          'Value "pas-du-tout-une-date" is not a valid date, timestamp, or relative date expression'
        );
      }
    });
  });
});
