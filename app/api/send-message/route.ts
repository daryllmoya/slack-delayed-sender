import { isValidSlackWebhookUrl } from '@/app/components/FormSlackDelayedSender/utils';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const { webhookUrl, message } = await req.json();

  if (!webhookUrl || !isValidSlackWebhookUrl(webhookUrl)) {
    return NextResponse.json(
      { error: 'Invalid Slack webhook URL' },
      { status: 400 }
    );
  }

  if (!message || message.trim() === '') {
    return NextResponse.json(
      { error: 'Message cannot be empty' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error('Slack API Error:', errorMessage);
      return NextResponse.json(
        { error: `Slack API Error: ${errorMessage}` },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending message to Slack:', error);
    return NextResponse.json(
      { error: 'Failed to connect to Slack API' },
      { status: 500 }
    );
  }
}
