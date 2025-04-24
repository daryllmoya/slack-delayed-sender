'use client';

import React, { useState } from 'react';

import DelayInput from './components/DelayedInput';
import MessageInput from './components/MessageInput';
import SlackHookInput from './components/SlackHookInput';
import SendButton from './components/SendButton';

import { useToast } from '@/hooks/use-toast';

import { isValidUrl } from './common/utils';

const Home = () => {
  const { toast } = useToast();
  const [delay, setDelay] = useState<number | null>(null);
  const [delayUnit, setDelayUnit] = useState<string>('seconds');
  const [message, setMessage] = useState<string>('');
  const [webhookUrl, setWebhookUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isDelayInvalid = !delay?.toString().length;
  const isMessageEmpty = !message;
  const isWebhookUrlInvalid = !webhookUrl || !isValidUrl(webhookUrl);

  const isSendButtonDisabled =
    isDelayInvalid || isMessageEmpty || isWebhookUrlInvalid;

  const handleSend = async () => {
    if (!delay || !message || !webhookUrl) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill out all fields before sending',
        variant: 'destructive',
      });
      return;
    }

    const delayInMs =
      delayUnit === 'seconds'
        ? delay * 1000
        : delayUnit === 'minutes'
          ? delay * 60 * 1000
          : delay * 60 * 60 * 1000;

    setIsLoading(true);

    setTimeout(async () => {
      try {
        const response = await fetch('/api/send-message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            webhookUrl,
            message: `From Daryll Moya's Slack Bot: ${message}`,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          const errorMessage = error.error?.includes('<HTML>')
            ? 'Failed to send the message. Please check your webhook URL or try again later.'
            : error.error || 'An unexpected error occurred';

          toast({
            title: 'Error Sending Message',
            description: errorMessage,
            variant: 'destructive',
          });
          return;
        }

        toast({
          title: 'Message Sent',
          description: 'Your message was successfully sent to Slack',
          variant: 'default',
        });

        setDelay(null);
        setDelayUnit('seconds');
        setMessage('');
        setWebhookUrl('');
      } catch {
        toast({
          title: 'Error Sending Message',
          description: 'Failed to connect to the Slack API',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    }, delayInMs);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 space-y-6">
      <h1 className="text-2xl font-bold">Delayed Slack Message Sender</h1>
      <div className="space-y-4 w-full max-w-md">
        <DelayInput
          delay={delay}
          onDelayChange={setDelay}
          delayUnit={delayUnit}
          onDelayUnitChange={setDelayUnit}
        />
        <MessageInput message={message} onMessageChange={setMessage} />
        <SlackHookInput
          webhookUrl={webhookUrl}
          onWebhookUrlChange={setWebhookUrl}
        />
        <SendButton
          isDisabled={isSendButtonDisabled}
          isLoading={isLoading}
          delay={delay}
          delayUnit={delayUnit}
          onClick={handleSend}
        />
      </div>
    </main>
  );
};

export default Home;
