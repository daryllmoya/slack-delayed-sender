import { ChangeEvent } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

import { isValidUrl } from '../common/utils';

type SlackHookInputProps = {
  webhookUrl: string;
  onWebhookUrlChange: (url: string) => void;
};

const SlackHookInput = ({
  webhookUrl,
  onWebhookUrlChange,
}: SlackHookInputProps) => {
  const { toast } = useToast();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    onWebhookUrlChange(url);
  };

  const handleBlur = (event: ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    if (url && !isValidUrl(url)) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid Slack webhook URL',
        variant: 'destructive',
      });
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
        onBlur={handleBlur}
        required
      />
    </div>
  );
};

export default SlackHookInput;
