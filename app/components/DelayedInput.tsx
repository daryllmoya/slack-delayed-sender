import { ChangeEvent } from 'react';

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
  delay: number | null;
  onDelayChange: (delay: number | null) => void;
  delayUnit: string;
  onDelayUnitChange: (unit: string) => void;
};

const DelayInput = ({
  delay,
  onDelayChange,
  delayUnit,
  onDelayUnitChange,
}: DelayInputProps) => {
  const { toast } = useToast();

  const handleDelayChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(event.target.value, 10);
    if (isNaN(value) || value < 0) {
      onDelayChange(null);
      return;
    }
    onDelayChange(value);
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
    onDelayUnitChange(value);
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
        <Select value={delayUnit} onValueChange={handleUnitChange}>
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
