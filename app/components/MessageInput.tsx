import { ChangeEvent } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

import { MAX_MESSAGE_LENGTH } from '../common/constants';

type MessageInputProps = {
  message: string;
  onMessageChange: (message: string) => void;
};

const MessageInput = ({ message, onMessageChange }: MessageInputProps) => {
  const { toast } = useToast();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length > MAX_MESSAGE_LENGTH) {
      toast({
        title: 'Message too long',
        description: `Please limit your message to ${MAX_MESSAGE_LENGTH} characters`,
        variant: 'destructive',
      });
      return;
    }
    onMessageChange(value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="messageInput">Slack Message:</Label>
      <Input
        type="text"
        id="messageInput"
        placeholder="Enter your Slack message"
        value={message}
        onChange={handleChange}
        required
        aria-invalid={message.length > MAX_MESSAGE_LENGTH}
        aria-describedby="messageInputHelp"
        className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
      />
      <p id="messageInputHelp" className="text-sm text-gray-500">
        Enter the message you want to send to Slack.&nbsp;
        {message.length}/{MAX_MESSAGE_LENGTH} characters
      </p>
    </div>
  );
};

export default MessageInput;
