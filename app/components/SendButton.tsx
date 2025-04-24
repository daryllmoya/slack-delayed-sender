import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

type SendButtonProps = {
  isDisabled: boolean;
  isLoading?: boolean;
  delay: number | null;
  delayUnit?: string;
  onClick: () => void;
};

const SendButton = ({
  isDisabled,
  isLoading = false,
  delay,
  delayUnit = 'seconds',
  onClick,
}: SendButtonProps) => {
  const buttonText = delay ? `Send in ${delay} ${delayUnit}` : 'Send';

  return (
    <Button
      onClick={onClick}
      disabled={isDisabled || isLoading}
      aria-disabled={isDisabled || isLoading}
      aria-busy={isLoading}
      className={`w-full flex items-center justify-center space-x-2 ${
        isDisabled || isLoading
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-blue-500 hover:bg-blue-600'
      } transition duration-200`}
    >
      {isLoading && <Loader2 className="animate-spin h-4 w-4" />}
      <span>{isLoading ? 'Sending...' : buttonText}</span>
    </Button>
  );
};

export default SendButton;
