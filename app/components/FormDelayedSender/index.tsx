import { debounce } from 'lodash';
import { Loader2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

import { formDelayedSenderSchema } from './schema';
import {
  DELAY_UNIT_LABELS,
  DELAY_UNIT_OPTIONS,
  FormDelayedSenderData,
  PLATFORM_LABELS,
  PLATFORM_OPTIONS,
} from './types';
import { convertDelayToMs, sendMessage } from './utils';

const FormDelayedSender = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const formattedCountdown =
    countdown === 1 ? '1 second' : `${countdown} seconds`;

  const delayUnitItems = useMemo(
    () =>
      DELAY_UNIT_OPTIONS.map((value) => (
        <SelectItem key={value} value={value}>
          {DELAY_UNIT_LABELS[value]}
        </SelectItem>
      )),
    []
  );

  const platformItems = useMemo(
    () =>
      PLATFORM_OPTIONS.map((value) => (
        <SelectItem key={value} value={value}>
          {PLATFORM_LABELS[value]}
        </SelectItem>
      )),
    []
  );

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
  } = useForm<FormDelayedSenderData>({
    resolver: zodResolver(formDelayedSenderSchema),
    defaultValues: {
      delay: 1,
      delayUnit: 'seconds',
      message: '',
      platform: 'slack',
      webhookUrl: '',
    },
  });

  const webhookUrl = useWatch({ control, name: 'webhookUrl' });

  useEffect(() => {
    const handler = debounce(() => {
      trigger('webhookUrl');
    }, 1000);

    if (webhookUrl) {
      handler();
    }

    return () => handler.cancel();
  }, [webhookUrl, trigger]);

  useEffect(() => {
    if (!isSubmitting || countdown === null) return;

    if (countdown <= 0) {
      setCountdown(null);
      return;
    }

    const timeout = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [countdown, isSubmitting]);

  const onSubmit = async (data: FormDelayedSenderData) => {
    const { delay, delayUnit, message, platform, webhookUrl } = data;

    const delayInMs = convertDelayToMs(delay, delayUnit);

    setIsSubmitting(true);
    setCountdown(Math.floor(delayInMs / 1000));

    setTimeout(async () => {
      sendMessage(
        {
          platform,
          webhookUrl,
          message: `From Daryll's Next.js App: ${message}`,
        },
        reset,
        setIsSubmitting,
        setCountdown,
        toast
      );
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
                aria-busy={isSubmitting}
                aria-describedby={errors.delay ? 'delayError' : undefined}
                aria-invalid={!!errors.delay}
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
                <SelectContent>{delayUnitItems}</SelectContent>
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
        <Label htmlFor="platform">Platform:</Label>
        <Controller
          name="platform"
          control={control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger className="w-full" disabled={isSubmitting}>
                <SelectValue placeholder="Select a platform" />
              </SelectTrigger>
              <SelectContent>{platformItems}</SelectContent>
            </Select>
          )}
        />
        {errors.platform && (
          <p id="platformError" className="text-sm text-red-500">
            {errors.platform.message}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message:</Label>
        <Controller
          name="message"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              id="message"
              placeholder="Enter your message"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={4}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              aria-describedby={errors.message ? 'messageError' : undefined}
              aria-invalid={!!errors.message}
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
        <Label htmlFor="webhookUrl">Webhook URL:</Label>
        <Controller
          name="webhookUrl"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              id="webhookUrl"
              placeholder="Enter the webhook URL"
              className="border-gray-300 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={2}
              disabled={isSubmitting}
              aria-busy={isSubmitting}
              aria-describedby={
                errors.webhookUrl ? 'webhookUrlError' : undefined
              }
              aria-invalid={!!errors.webhookUrl}
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
        aria-busy={isSubmitting}
      >
        {isSubmitting && <Loader2 className="animate-spin h-4 w-4" />}
        <span>
          {isSubmitting
            ? countdown !== null
              ? `Sending in ${formattedCountdown}...`
              : 'Sending...'
            : 'Send'}
        </span>
      </Button>
    </form>
  );
};

export default FormDelayedSender;
