import { z } from 'zod';

/** Zod schema for a non-empty JSON-LD entity identifier. */
export const EntityIdSchema = z.string().trim().min(1, 'Entity ID cannot be empty');
