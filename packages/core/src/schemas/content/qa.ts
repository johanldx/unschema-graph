import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { IsoDateSchema } from '../../core/temporal.js';
import { entityRef } from '../common/reference.js';
import { RelativeOrAbsoluteUrlSchema } from '../common/url.js';
import { OrganizationSchema } from '../identity/organization.js';
import { PersonSchema } from '../identity/person.js';
import { AnswerSchema } from './faq.js';

const AuthorSchema = entityRef({
  schemas: [PersonSchema, OrganizationSchema],
  types: ['Person', 'Organization'],
  fallbackType: 'Person',
});

/**
 * Zod schema for Schema.org `Comment`.
 */
export const CommentSchema = z
  .object({
    '@type': z.literal('Comment').default('Comment').optional(),
    '@id': z.string().optional(),
    text: z.string().min(1, 'Comment text cannot be empty'),
    author: AuthorSchema,
    datePublished: IsoDateSchema.optional(),
    upvoteCount: z.number().int().optional(),
  })
  .strict();

/**
 * Zod schema for Q&A Question with accepted/suggested answers.
 */
export const QAQuestionSchema = z
  .object({
    '@type': z.literal('Question').default('Question').optional(),
    '@id': z.string().optional(),
    name: z.string().min(1, 'Question name is required'),
    text: z.string().optional(),
    author: AuthorSchema.optional(),
    datePublished: IsoDateSchema.optional(),
    acceptedAnswer: AnswerSchema.optional(),
    suggestedAnswer: z.union([AnswerSchema, z.array(AnswerSchema)]).optional(),
  })
  .strict();

/**
 * Zod schema for Schema.org `QAPage`.
 */
export const QAPageSchema = z
  .object({
    mainEntity: QAQuestionSchema,
  })
  .strict();

/**
 * Zod schema for Schema.org `DiscussionForumPosting`.
 */
export const DiscussionForumPostingSchema = z
  .object({
    headline: z.string().min(1, 'Property "headline" is required for DiscussionForumPosting'),
    author: AuthorSchema,
    datePublished: IsoDateSchema,
    text: z.string().optional(),
    comment: z.union([CommentSchema, z.array(CommentSchema)]).optional(),
    url: RelativeOrAbsoluteUrlSchema.optional(),
  })
  .strict();

export const Comment = defineSchema('Comment', CommentSchema);
export const QAQuestion = defineSchema('Question', QAQuestionSchema);
export const QAPage = defineSchema('QAPage', QAPageSchema);
export const DiscussionForumPosting = defineSchema(
  'DiscussionForumPosting',
  DiscussionForumPostingSchema
);
