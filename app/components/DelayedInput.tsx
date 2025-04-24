import React, { useState } from 'react';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

type DelayInputProps = {
  onDelayChange: (delay: number | null) => void;
  onUnitChange: (unit: string) => void;
};

const DelayInput = ({ onDelayChange, onUnitChange }: DelayInputProps) => {
  const { toast } = useToast();

  const [delay, setDelay] = useState<number | null>(null);
  const [unit, setUnit] = useState<string>('seconds');

  const handleDelayChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (isNaN(value) || value < 0) {
      setDelay(null);
      onDelayChange(null);
      return;
    }
    setDelay(isNaN(value) ? null : value);
    onDelayChange(isNaN(value) ? null : value);
  };

  const handleUnitChange = (value: string) => {
    if (!['seconds', 'minutes', 'hours'].includes(value)) {
      toast({
        title: 'Invalid unit selected',
        description: 'Please select a valid unit (seconds, minutes, hours).',
        variant: 'destructive',
      });
      return;
    }
    setUnit(value);
    onUnitChange(value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="delayInput">Delay:</Label>
      <div className="flex space-x-2">
        <Input
          type="number"
          id="delayInput"
          placeholder="Enter delay"
          value={delay ?? ''}
          onChange={handleDelayChange}
          min={0}
          required
          className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
        />
        <Select value={unit} onValueChange={handleUnitChange}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="seconds">Seconds</SelectItem>
            <SelectItem value="minutes">Minutes</SelectItem>
            <SelectItem value="hours">Hours</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default DelayInput;
