export const convertDelayToMs = (
  delay: number,
  unit: 'seconds' | 'minutes' | 'hours'
): number => {
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

export const isValidSlackWebhookUrl = (url: string): boolean => {
  const regex =
    /^https:\/\/hooks\.slack\.com\/services\/[A-Z0-9]{11}\/[A-Z0-9]{11}\/[a-zA-Z0-9]{24}$/;
  return regex.test(url);
};
