import { UseFormReset } from 'react-hook-form';
import { Dispatch, SetStateAction } from 'react';

import { UseToastReturn } from '@/hooks/use-toast';

import {
  DelayUnit,
  FormDelayedSenderData,
  PLATFORM_LABELS,
  SendMessagePayload,
  PlatformWebhookInput,
  PLATFORM_MESSAGE_LIMITS,
  PlatformMessageLimitInput,
} from './types';

export const convertDelayToMs = (delay: number, unit: DelayUnit): number => {
  const unitToMs = {
    // 1 second = 1000 ms
    seconds: 1000,
    // 1 minute = 60 seconds * 1000 ms
    minutes: 60 * 1000,
    // 1 hour = 60 minutes * 60 seconds * 1000 ms
    hours: 60 * 60 * 1000,
  };

  return delay * unitToMs[unit];
};

export const validateMessageLengthForPlatform = ({
  message,
  platform,
}: PlatformMessageLimitInput): { message: string; max: number } | null => {
  const max = PLATFORM_MESSAGE_LIMITS[platform];
  return message.length > max
    ? {
        message: `${PLATFORM_LABELS[platform]} messages cannot exceed ${max} characters`,
        max,
      }
    : null;
};

export const validateWebhookUrlForPlatform = ({
  platform,
  webhookUrl,
}: PlatformWebhookInput): boolean => {
  switch (platform) {
    case 'slack': {
      const slackRegex =
        /^https:\/\/hooks\.slack\.com\/services\/[A-Z0-9]{11}\/[A-Z0-9]{11}\/[a-zA-Z0-9]{24}$/;
      return slackRegex.test(webhookUrl);
    }
    case 'discord': {
      const discordRegex =
        /^https:\/\/discord\.com\/api\/webhooks\/\d+\/[A-Za-z0-9_-]+$/;
      return discordRegex.test(webhookUrl);
    }
    default:
      return false;
  }
};

export const sendMessage = async (
  payload: SendMessagePayload,
  reset: UseFormReset<FormDelayedSenderData>,
  setIsSubmitting: Dispatch<SetStateAction<boolean>>,
  setCountdown: Dispatch<SetStateAction<number | null>>,
  toast: UseToastReturn['toast']
): Promise<void> => {
  try {
    const res = await fetch('/api/send-message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const body = await res.json();

    if (res.ok) {
      toast({
        title: 'Message Sent',
        description: `Your message was successfully sent to ${PLATFORM_LABELS[payload.platform]}`,
      });
      reset();
    } else {
      throw new Error(body.error || 'Unexpected error');
    }
  } catch (error) {
    toast({
      className:
        'top-0 right-0 flex fixed md:max-w-[420px] md:top-4 md:right-4',
      title: 'Error Sending Message',
      description: (error as Error).message || 'Connection failed',
      variant: 'destructive',
    });
  } finally {
    setIsSubmitting(false);
    setCountdown(null);
  }
};
