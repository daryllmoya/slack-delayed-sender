import { NextResponse } from 'next/server';

import {
  SendMessagePayload,
  PLATFORM_LABELS,
  PLATFORM_PAYLOAD_BUILDERS,
} from '@/app/components/FormDelayedSender/types';

import {
  validateWebhookUrlForPlatform,
  validateMessageLengthForPlatform,
} from '@/app/components/FormDelayedSender/utils';

export const jsonError = (message: string, status: number = 400) =>
  NextResponse.json({ error: message }, { status });

export async function POST(req: Request) {
  const { platform, webhookUrl, message } =
    (await req.json()) as SendMessagePayload;

  const platformLabel = PLATFORM_LABELS[platform];

  if (!webhookUrl || !validateWebhookUrlForPlatform({ platform, webhookUrl })) {
    return jsonError(`Invalid ${platformLabel} webhook URL`);
  }

  const trimmedMessage = message.trim();

  if (!trimmedMessage) {
    return jsonError('Message cannot be empty');
  }

  const messageValidation = validateMessageLengthForPlatform({
    platform,
    message: trimmedMessage,
  });

  if (messageValidation) {
    return jsonError(messageValidation.message);
  }

  const payloadBuilder = PLATFORM_PAYLOAD_BUILDERS[platform];

  if (!payloadBuilder) {
    return jsonError(`Unsupported platform: ${platform}`);
  }

  const payload = payloadBuilder(trimmedMessage);

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`${platformLabel} API Error:`, errorMessage);
      return jsonError(
        `${platformLabel} API Error: ${errorMessage}`,
        response.status
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Error sending message to ${platformLabel}:`, error);
    return jsonError(`Failed to connect to ${platformLabel} API`, 500);
  }
}
