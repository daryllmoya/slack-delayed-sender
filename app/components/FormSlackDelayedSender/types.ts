import { z } from 'zod';
import { isValidSlackWebhookUrl } from './utils';

export const MAX_MESSAGE_LENGTH = 4000;

export const formSlackDelayedSenderSchema = z.object({
  delay: z
    .number()
    .min(1, { message: 'Delay must be at least 1' })
    .max(3600, { message: 'Delay cannot exceed 3600 seconds' }),
  delayUnit: z.enum(['seconds', 'minutes', 'hours']),
  message: z
    .string()
    .max(MAX_MESSAGE_LENGTH, {
      message: `Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`,
    })
    .transform((val) => val.trim().replace(/\s+/g, ' '))
    .refine((val) => val.length > 0, {
      message: 'Message cannot be empty or contain only spaces',
    }),
  webhookUrl: z
    .string()
    .nonempty({ message: 'Webhook URL cannot be empty' })
    .refine((url) => isValidSlackWebhookUrl(url), {
      message: 'Invalid Slack Webhook URL format',
    }),
});

export type FormSlackDelayedSenderData = z.infer<
  typeof formSlackDelayedSenderSchema
>;
