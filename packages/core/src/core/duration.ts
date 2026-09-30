import { z } from 'zod';

/**
 * Object representation of a duration.
 */
export interface DurationObject {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}

/**
 * Accepted duration inputs: human string ('45m', '1h30'), ISO string ('PT1H30M'), number of minutes (45), or object.
 */
export type DurationInput = string | number | DurationObject;

/**
 * Converts human duration strings, minutes, or duration objects into an ISO 8601 duration string (e.g. 'PT1H30M').
 *
 * @param input - The duration to parse (e.g. '45m', '1h30', 45, or { hours: 1, minutes: 30 }).
 * @returns ISO 8601 duration string compliant with Schema.org standards.
 *
 * @example
 * ```ts
 * formatIsoDuration('45m') // 'PT45M'
 * formatIsoDuration('1h30') // 'PT1H30M'
 * formatIsoDuration({ hours: 2, minutes: 15 }) // 'PT2H15M'
 * ```
 */
export function formatIsoDuration(input: unknown): string {
  if (typeof input === 'number') {
    return `PT${Math.round(input)}M`;
  }

  if (typeof input === 'object' && input !== null) {
    const { days = 0, hours = 0, minutes = 0, seconds = 0 } = input as DurationObject;
    let res = 'P';
    if (days > 0) res += `${days}D`;
    if (hours > 0 || minutes > 0 || seconds > 0 || days === 0) {
      res += 'T';
      if (hours > 0) res += `${hours}H`;
      if (minutes > 0) res += `${minutes}M`;
      if (seconds > 0) res += `${seconds}S`;
    }
    return res === 'PT' ? 'PT0M' : res;
  }

  if (typeof input !== 'string') {
    return String(input);
  }

  const str = input.trim();
  if (/^P/i.test(str)) {
    return str.toUpperCase();
  }

  // Handle format like '1h30' without trailing 'm'
  const hmMatch = str.match(/^(\d+)\s*h\s*(\d+)$/i);
  let days = 0;
  let hours = 0;
  let minutes = 0;
  let seconds = 0;

  if (hmMatch) {
    hours = parseInt(hmMatch[1], 10);
    minutes = parseInt(hmMatch[2], 10);
  } else {
    const dMatch = str.match(/(\d+)\s*(?:d|day|days|j|jour|jours)/i);
    const hMatch = str.match(/(\d+)\s*(?:h|hr|hours?|heure|heures)/i);
    const mMatch = str.match(/(\d+)\s*(?:m|min|minutes?)/i);
    const sMatch = str.match(/(\d+)\s*(?:s|sec|seconds?)/i);

    if (dMatch) days = parseInt(dMatch[1], 10);
    if (hMatch) hours = parseInt(hMatch[1], 10);
    if (mMatch) minutes = parseInt(mMatch[1], 10);
    if (sMatch) seconds = parseInt(sMatch[1], 10);
  }

  if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
    // Pure numeric string like '45' -> treat as minutes
    if (/^\d+$/.test(str)) {
      return `PT${str}M`;
    }
    return str;
  }

  let res = 'P';
  if (days > 0) res += `${days}D`;
  if (hours > 0 || minutes > 0 || seconds > 0) {
    res += 'T';
    if (hours > 0) res += `${hours}H`;
    if (minutes > 0) res += `${minutes}M`;
    if (seconds > 0) res += `${seconds}S`;
  }
  return res;
}

/**
 * Zod schema that transparently converts any duration input into an ISO 8601 duration string.
 */
export const IsoDurationSchema = z
  .union([
    z.string().min(1),
    z.number().positive(),
    z.object({
      days: z.number().int().nonnegative().optional(),
      hours: z.number().int().nonnegative().optional(),
      minutes: z.number().int().nonnegative().optional(),
      seconds: z.number().int().nonnegative().optional(),
    }),
  ])
  .transform(formatIsoDuration);
