import { z } from 'zod';
import { defineSchema } from '../../core/defineSchema.js';
import { EntityIdSchema } from '../common/reference.js';

/**
 * Zod schema for Schema.org `Answer`.
 */
export const AnswerSchema = z
  .object({
    '@type': z.literal('Answer').default('Answer').optional(),
    '@id': EntityIdSchema.optional(),
    text: z.string().min(1, 'Property "text" is required for Answer'),
  })
  .strict();

/**
 * Zod schema for Schema.org `Question`.
 */
export const QuestionSchema = z
  .object({
    '@type': z.literal('Question').default('Question').optional(),
    '@id': EntityIdSchema.optional(),
    name: z.string().min(1, 'Property "name" (the question) is required for Question'),
    acceptedAnswer: z.union([
      AnswerSchema,
      z.string().transform((text) => ({ '@type': 'Answer' as const, text })),
    ]),
  })
  .strict();

/**
 * Simplified shorthand representation for question-answer pairs.
 */
const SimpleQAPairSchema = z
  .object({
    question: z.string().min(1, 'Question string cannot be empty'),
    answer: z.string().min(1, 'Answer string cannot be empty'),
  })
  .strict();

/**
 * Zod schema for Schema.org `FAQPage`.
 * Accepts either standard `mainEntity` array of questions or convenient `questions` shorthand.
 */
export const FAQPageSchema = z
  .object({
    mainEntity: z.array(QuestionSchema).optional(),
    questions: z.array(SimpleQAPairSchema).optional(),
  })
  .strict()
  .transform((data) => {
    if (data.questions && (!data.mainEntity || data.mainEntity.length === 0)) {
      const { questions, ...rest } = data;
      return {
        ...rest,
        mainEntity: questions.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      };
    }
    return data;
  })
  .refine((data) => Boolean(data.mainEntity && data.mainEntity.length > 0), {
    message:
      'Property "mainEntity" or "questions" with at least one question is required for FAQPage',
  });

/**
 * Schema.org `Answer` entity builder.
 */
export const Answer = defineSchema('Answer', AnswerSchema);

/**
 * Schema.org `Question` entity builder.
 */
export const Question = defineSchema('Question', QuestionSchema);

/**
 * Schema.org `FAQPage` entity builder.
 */
export const FAQPage = defineSchema('FAQPage', FAQPageSchema);
