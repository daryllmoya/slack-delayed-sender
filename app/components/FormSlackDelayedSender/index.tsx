import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormSlackDelayedSenderData,
  formSlackDelayedSenderSchema,
} from './types';
import { convertDelayToMs } from './utils';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { debounce } from 'lodash';

const FormSlackDelayedSender = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
    reset,
  } = useForm<FormSlackDelayedSenderData>({
    resolver: zodResolver(formSlackDelayedSenderSchema),
    defaultValues: {
      delay: 1,
      delayUnit: 'seconds',
      message: '',
      webhookUrl: '',
    },
  });

  const webhookUrl = watch('webhookUrl');

  const validateWebhookUrl = debounce(async () => {
    await trigger('webhookUrl');
  }, 500);

  useEffect(() => {
    if (webhookUrl) {
      validateWebhookUrl();
    }
    return () => {
      validateWebhookUrl.cancel();
    };
  }, [webhookUrl, validateWebhookUrl]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isSubmitting && countdown !== null) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev !== null && prev > 0) {
            return prev - 1;
          } else {
            clearInterval(interval!);
            return null;
          }
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isSubmitting, countdown]);

  const onSubmit = async (data: FormSlackDelayedSenderData) => {
    const { delay, delayUnit, message, webhookUrl } = data;

    const delayInMs = convertDelayToMs(delay, delayUnit);

    setIsSubmitting(true);
    setCountdown(Math.floor(delayInMs / 1000));

    setTimeout(async () => {
      try {
        const response = await fetch('/api/send-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            webhookUrl,
            message: `From Daryll Moya's Slack Bot: ${message}`,
          }),
        });

        const responseBody = await response.json();

        if (response.ok) {
          toast({
            title: 'Message Sent',
            description: 'Your message was successfully sent to Slack',
            variant: 'default',
          });
          reset();
        } else {
          toast({
            title: 'Error Sending Message',
            description: responseBody.error || 'An unexpected error occurred',
            variant: 'destructive',
          });
        }
      } catch {
        toast({
          title: 'Error Sending Message',
          description: 'Failed to connect to the Slack API',
          variant: 'destructive',
        });
      } finally {
        setIsSubmitting(false);
        setCountdown(null);
      }
    }, delayInMs);
  };

  return (
    <form
      className="space-y-6 w-full max-w-md"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="space-y-2">
        <Label htmlFor="delay">Delay:</Label>
        <div className="flex space-x-2">
          <Controller
            name="delay"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="number"
                id="delay"
                placeholder="Enter delay"
                min={1}
                value={field.value || ''}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                disabled={isSubmitting}
                aria-invalid={!!errors.delay}
                aria-describedby={errors.delay ? 'delayError' : undefined}
              />
            )}
          />
          <Controller
            name="delayUnit"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-32" disabled={isSubmitting}>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="seconds">Seconds</SelectItem>
                  <SelectItem value="minutes">Minutes</SelectItem>
                  <SelectItem value="hours">Hours</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {errors.delay && (
          <p id="delayError" className="text-sm text-red-500">
            {errors.delay.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Slack Message:</Label>
        <Controller
          name="message"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              id="message"
              placeholder="Enter your Slack message"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              aria-invalid={!!errors.message}
              aria-describedby={errors.message ? 'messageError' : undefined}
            />
          )}
        />
        {errors.message && (
          <p id="messageError" className="text-sm text-red-500">
            {errors.message.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="webhookUrl">Slack Webhook URL:</Label>
        <Controller
          name="webhookUrl"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              id="webhookUrl"
              placeholder="Enter your Slack webhook URL"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              disabled={isSubmitting}
              aria-invalid={!!errors.webhookUrl}
              aria-describedby={
                errors.webhookUrl ? 'webhookUrlError' : undefined
              }
            />
          )}
        />
        {errors.webhookUrl && (
          <p id="webhookUrlError" className="text-sm text-red-500">
            {errors.webhookUrl.message}
          </p>
        )}
      </div>
      <Button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex items-center justify-center space-x-2 ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-500 hover:bg-blue-600'
        }`}
      >
        {isSubmitting && <Loader2 className="animate-spin h-4 w-4" />}
        <span>
          {isSubmitting
            ? countdown !== null
              ? `Sending in ${countdown} second(s)...`
              : 'Sending...'
            : 'Send'}
        </span>
      </Button>
    </form>
  );
};

export default FormSlackDelayedSender;
