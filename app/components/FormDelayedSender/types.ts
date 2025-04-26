export const DELAY_UNIT_OPTIONS = ['seconds', 'minutes', 'hours'] as const;
export const PLATFORM_OPTIONS = ['slack', 'discord'] as const;

export type DelayUnit = (typeof DELAY_UNIT_OPTIONS)[number];
export type Platform = (typeof PLATFORM_OPTIONS)[number];

export interface FormDelayedSenderData {
  delay: number;
  delayUnit: DelayUnit;
  message: string;
  platform: Platform;
  webhookUrl: string;
}

export type PlatformMessageLimitInput = Pick<
  FormDelayedSenderData,
  'platform' | 'message'
>;

export type PlatformWebhookInput = Pick<
  FormDelayedSenderData,
  'platform' | 'webhookUrl'
>;

export type SendMessagePayload = Pick<
  FormDelayedSenderData,
  'platform' | 'webhookUrl' | 'message'
>;

export const DELAY_UNIT_LABELS: Record<DelayUnit, string> = {
  seconds: 'Seconds',
  minutes: 'Minutes',
  hours: 'Hours',
};

export const PLATFORM_LABELS: Record<Platform, string> = {
  slack: 'Slack',
  discord: 'Discord',
};

export const PLATFORM_MESSAGE_LIMITS: Record<Platform, number> = {
  slack: 4000,
  discord: 2000,
};

export type PlatformPayloadBuilder = (
  message: string
) => Record<string, unknown>;

export const PLATFORM_PAYLOAD_BUILDERS: Record<
  Platform,
  PlatformPayloadBuilder
> = {
  slack: (message) => ({ text: message }),
  discord: (message) => ({ content: message }),
};
