import { z } from 'zod';
import {
  type DurationInput,
  type DurationObject,
  formatIsoDuration,
  IsoDurationSchema,
} from './duration.js';

export { type DurationInput, type DurationObject, formatIsoDuration, IsoDurationSchema };

/**
 * Parses any duration input (string, number, DurationObject) into total milliseconds.
 *
 * @param input - The duration to parse (e.g. '45m', '1h30', 45, or { hours: 1, minutes: 30 }).
 * @returns Total milliseconds represented by the duration.
 *
 * @example
 * ```ts
 * parseDurationToMs('1h30') // 5400000
 * parseDurationToMs(45) // 2700000
 * ```
 */
export function parseDurationToMs(input: DurationInput): number {
  if (typeof input === 'number') {
    return Math.round(input * 60 * 1000); // number is interpreted as minutes
  }

  if (typeof input === 'object' && input !== null) {
    const { days = 0, hours = 0, minutes = 0, seconds = 0 } = input as DurationObject;
    return days * 86400000 + hours * 3600000 + minutes * 60000 + seconds * 1000;
  }

  if (typeof input !== 'string') {
    return 0;
  }

  const str = input.trim();

  // Format '1h30' without trailing 'm'
  const hmMatch = str.match(/^(\d+)\s*h\s*(\d+)$/i);
  if (hmMatch) {
    const h = parseInt(hmMatch[1], 10);
    const m = parseInt(hmMatch[2], 10);
    return h * 3600000 + m * 60000;
  }

  const dMatch = str.match(/(\d+)\s*(?:d|day|days|j|jour|jours)/i);
  const hMatch = str.match(/(\d+)\s*(?:h|hr|hours?|heure|heures)/i);
  const mMatch = str.match(/(\d+)\s*(?:m|min|minutes?)/i);
  const sMatch = str.match(/(\d+)\s*(?:s|sec|seconds?)/i);

  let ms = 0;
  if (dMatch) ms += parseInt(dMatch[1], 10) * 86400000;
  if (hMatch) ms += parseInt(hMatch[1], 10) * 3600000;
  if (mMatch) ms += parseInt(mMatch[1], 10) * 60000;
  if (sMatch) ms += parseInt(sMatch[1], 10) * 1000;

  if (ms === 0) {
    // Pure numeric string like '45' -> treat as minutes
    if (/^\d+$/.test(str)) {
      return parseInt(str, 10) * 60000;
    }

    // Standard ISO duration: e.g. PT1H30M, P1DT2H
    const isoMatch = str.match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/i);
    if (isoMatch) {
      const d = parseInt(isoMatch[1] || '0', 10);
      const h = parseInt(isoMatch[2] || '0', 10);
      const m = parseInt(isoMatch[3] || '0', 10);
      const s = parseInt(isoMatch[4] || '0', 10);
      return d * 86400000 + h * 3600000 + m * 60000 + s * 1000;
    }
  }

  return ms;
}

/**
 * Resolves a date input (Date instance, timestamp number, ISO string, natural date, or relative token)
 * into a valid JavaScript Date instance.
 *
 * Supported relative tokens:
 * - 'now': Current timestamp
 * - 'today': Midnight today UTC
 * - 'tomorrow': Midnight tomorrow UTC
 * - 'yesterday': Midnight yesterday UTC
 * - '+30d', '+2w', '+6m', '+1y', '+4h', '-7d'
 */
export function parseDate(input: unknown, referenceDate = new Date()): Date | null {
  if (input instanceof Date) {
    return Number.isNaN(input.getTime()) ? null : new Date(input.getTime());
  }

  if (typeof input === 'number') {
    if (Number.isNaN(input)) return null;
    // Unix epoch in seconds (e.g. 10 digits <= 1e11) vs milliseconds
    const ms = input < 1e11 ? input * 1000 : input;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  if (typeof input !== 'string') {
    return null;
  }

  const str = input.trim();
  if (!str) return null;

  const lower = str.toLowerCase();

  if (lower === 'now') {
    return new Date(referenceDate.getTime());
  }

  if (lower === 'today') {
    const d = new Date(referenceDate.getTime());
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  if (lower === 'tomorrow') {
    const d = new Date(referenceDate.getTime() + 86400000);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  if (lower === 'yesterday') {
    const d = new Date(referenceDate.getTime() - 86400000);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  // Relative offsets like '+30d', '+2w', '+6m', '+1y', '+4h', '-7d'
  const relMatch = lower.match(
    /^([+-]?\d+)\s*(d|day|days|w|week|weeks|m|month|months|y|year|years|h|hour|hours|min|minutes?|s|sec|seconds?)$/
  );
  if (relMatch) {
    const amount = parseInt(relMatch[1], 10);
    const unit = relMatch[2];
    const d = new Date(referenceDate.getTime());

    if (unit.startsWith('d')) {
      d.setUTCDate(d.getUTCDate() + amount);
    } else if (unit.startsWith('w')) {
      d.setUTCDate(d.getUTCDate() + amount * 7);
    } else if (unit.startsWith('m') && !unit.startsWith('min')) {
      d.setUTCMonth(d.getUTCMonth() + amount);
    } else if (unit.startsWith('y')) {
      d.setUTCFullYear(d.getUTCFullYear() + amount);
    } else if (unit.startsWith('h')) {
      d.setUTCHours(d.getUTCHours() + amount);
    } else if (unit.startsWith('min')) {
      d.setUTCMinutes(d.getUTCMinutes() + amount);
    } else if (unit.startsWith('s')) {
      d.setUTCSeconds(d.getUTCSeconds() + amount);
    }
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // Pure date 'YYYY-MM-DD'
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const d = new Date(`${str}T00:00:00.000Z`);
    return Number.isNaN(d.getTime()) ? null : d;
  }

  // Standard string date parsing
  const parsed = new Date(str);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/**
 * Formats any date input into a compliant ISO 8601 string or YYYY-MM-DD date.
 * Pure dates ('YYYY-MM-DD' or 'today') are preserved as 'YYYY-MM-DD'.
 * Full datetimes, timestamps, and relative offsets are formatted as full ISO 8601 timestamps.
 */
export function formatIsoDate(input: unknown): string {
  if (typeof input === 'string') {
    const trimmed = input.trim();
    if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
      const d = new Date(`${trimmed}T00:00:00.000Z`);
      if (Number.isNaN(d.getTime())) {
        throw new Error(`Invalid date string: "${input}"`);
      }
      return trimmed;
    }
    if (
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?$/i.test(trimmed)
    ) {
      const d = new Date(trimmed);
      if (Number.isNaN(d.getTime())) {
        throw new Error(`Invalid date string: "${input}"`);
      }
      return trimmed;
    }
    if (trimmed.toLowerCase() === 'today') {
      return new Date().toISOString().split('T')[0];
    }
  }

  const d = parseDate(input);
  if (!d) {
    throw new Error(`Cannot parse "${input}" as a valid date or relative date expression`);
  }
  return d.toISOString();
}

/**
 * Adds a duration (human string, DurationObject, or minutes/ms) to a date.
 *
 * @param date - The initial date (Date, string, timestamp).
 * @param duration - The duration to add ('2h30', '45m', { days: 1 }, etc.).
 * @returns Resulting date formatted as an ISO 8601 timestamp string.
 *
 * @example
 * ```ts
 * addDuration('2026-10-15T14:00:00.000Z', '2h30')
 * // => '2026-10-15T16:30:00.000Z'
 * ```
 */
export function addDuration(date: unknown, duration: DurationInput): string {
  const d = parseDate(date);
  if (!d) {
    throw new Error(`Cannot parse "${date}" as a valid date in addDuration`);
  }
  const ms = parseDurationToMs(duration);
  const result = new Date(d.getTime() + ms);
  return result.toISOString();
}

/**
 * Computes the ISO 8601 duration string between two dates.
 *
 * @param startDate - Start date.
 * @param endDate - End date.
 * @returns ISO 8601 duration string (e.g. 'PT2H30M').
 *
 * @example
 * ```ts
 * diffDuration('2026-10-15T14:00:00Z', '2026-10-15T16:30:00Z')
 * // => 'PT2H30M'
 * ```
 */
export function diffDuration(startDate: unknown, endDate: unknown): string {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (!start || !end) {
    throw new Error('Both startDate and endDate must be valid dates in diffDuration');
  }

  const diffMs = Math.max(0, end.getTime() - start.getTime());
  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return formatIsoDuration({ days, hours, minutes, seconds });
}

/**
 * Zod schema that transparently converts any date input (Date instance, timestamp,
 * ISO string, natural date, or relative token like 'today', 'now', '+30d')
 * into a compliant ISO 8601 date string.
 */
export const IsoDateSchema = z
  .union([z.string().min(1), z.number(), z.date()])
  .superRefine((val, ctx) => {
    try {
      formatIsoDate(val);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Value "${val}" is not a valid date, timestamp, or relative date expression`,
      });
    }
  })
  .transform(formatIsoDate);
