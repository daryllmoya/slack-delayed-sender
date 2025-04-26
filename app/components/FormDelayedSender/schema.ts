import { z } from 'zod';

import { DELAY_UNIT_OPTIONS, PLATFORM_OPTIONS, PLATFORM_LABELS } from './types';
import {
  validateMessageLengthForPlatform,
  validateWebhookUrlForPlatform,
} from './utils';

const baseFormDelayedSenderSchema = z.object({
  delay: z
    .number()
    .min(1, { message: 'Delay must be at least 1' })
    .max(3600, { message: 'Delay cannot exceed 3600 seconds' }),
  delayUnit: z.enum(DELAY_UNIT_OPTIONS),
  message: z
    .string()
    .transform((val) => val.trim().replace(/\s+/g, ' '))
    .refine((val) => val.length > 0, {
      message: 'Message cannot be empty or contain only spaces',
    }),
  platform: z.enum(PLATFORM_OPTIONS),
  webhookUrl: z.string().nonempty({ message: 'Webhook URL cannot be empty' }),
});

export const formDelayedSenderSchema = baseFormDelayedSenderSchema.superRefine(
  ({ message, platform, webhookUrl }, ctx) => {
    const messageLengthIssue = validateMessageLengthForPlatform({
      message,
      platform,
    });

    if (messageLengthIssue) {
      ctx.addIssue({
        path: ['message'],
        code: z.ZodIssueCode.too_big,
        type: 'string',
        maximum: messageLengthIssue.max,
        inclusive: true,
        message: messageLengthIssue.message,
      });
    }

    if (!validateWebhookUrlForPlatform({ platform, webhookUrl })) {
      ctx.addIssue({
        path: ['webhookUrl'],
        code: z.ZodIssueCode.custom,
        message: `Invalid ${PLATFORM_LABELS[platform]} Webhook URL format`,
      });
    }
  }
);

export type ZodFormDelayedSenderData = z.infer<typeof formDelayedSenderSchema>;
