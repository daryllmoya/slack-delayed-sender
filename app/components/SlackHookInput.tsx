import React, { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

import { isValidUrl } from '../common/utils';

type SlackHookInputProps = {
  onWebhookUrlChange: (url: string) => void;
};

const SlackHookInput = ({ onWebhookUrlChange }: SlackHookInputProps) => {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState<string>('');

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    setWebhookUrl(url);
    if (isValidUrl(url)) {
      onWebhookUrlChange(url);
    } else {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid Slack webhook URL.',
        variant: 'destructive',
      });
      onWebhookUrlChange('');
    }
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="slackWebhookUrl">Slack Webhook URL:</Label>
      <Input
        type="text"
        id="slackWebhookUrl"
        placeholder="Enter your Slack webhook URL"
        value={webhookUrl}
        onChange={handleChange}
        required
      />
    </div>
  );
};

export default SlackHookInput;
