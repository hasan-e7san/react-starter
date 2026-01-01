import * as React from 'react';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';

export interface TimeInputProps {
  title?: string;
  name?: string;
  value?: string; // Format: "HH:MM" or "HH:MM:SS"
  onChange?: (value: string) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  showSeconds?: boolean;
}

const parseTime = (timeStr: string): { hours: number; minutes: number; seconds: number } => {
  const parts = timeStr.split(':');
  return {
    hours: parseInt(parts[0] || '0', 10),
    minutes: parseInt(parts[1] || '0', 10),
    seconds: parseInt(parts[2] || '0', 10)
  };
};

export const TimeInput = React.forwardRef<HTMLDivElement, TimeInputProps>(
  (
    {
      title,
      name,
      value = '00:00',
      onChange,
      disabled,
      error,
      className,
      showSeconds = false
    },
    ref
  ) => {
    const { hours: initHours, minutes: initMinutes, seconds: initSeconds } = parseTime(value);
    
    const [hours, setHours] = React.useState<number>(initHours);
    const [minutes, setMinutes] = React.useState<number>(initMinutes);
    const [seconds, setSeconds] = React.useState<number>(initSeconds);

    React.useEffect(() => {
      const { hours: h, minutes: m, seconds: s } = parseTime(value);
      setHours(h);
      setMinutes(m);
      setSeconds(s);
    }, [value]);

    React.useEffect(() => {
      const formattedTime = showSeconds
        ? `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
        : `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      
      if (formattedTime !== value) {
        onChange?.(formattedTime);
      }
    }, [hours, minutes, seconds, showSeconds, onChange, value]);

    const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Math.min(23, Math.max(0, parseInt(e.target.value) || 0));
      setHours(val);
    };

    const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
      setMinutes(val);
    };

    const handleSecondsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = Math.min(59, Math.max(0, parseInt(e.target.value) || 0));
      setSeconds(val);
    };

    return (
      <div ref={ref} className={cn('mb-2', className)}>
        {title && (
          <label htmlFor={name} className="mb-2 block text-sm font-bold">
            {title}
          </label>
        )}

        <div className="flex items-center gap-1">
          <Input
            id={`${name}-hours`}
            type="number"
            disabled={disabled}
            onChange={handleHoursChange}
            value={String(hours).padStart(2, '0')}
            min="0"
            max="23"
            placeholder="HH"
            className={cn(
              'w-16 text-center',
              error ? 'border-red-300' : ''
            )}
          />
          <span className="text-2xl">:</span>
          <Input
            id={`${name}-minutes`}
            type="number"
            disabled={disabled}
            onChange={handleMinutesChange}
            value={String(minutes).padStart(2, '0')}
            min="0"
            max="59"
            placeholder="MM"
            className={cn(
              'w-16 text-center',
              error ? 'border-red-300' : ''
            )}
          />
          {showSeconds && (
            <>
              <span className="text-2xl">:</span>
              <Input
                id={`${name}-seconds`}
                type="number"
                disabled={disabled}
                onChange={handleSecondsChange}
                value={String(seconds).padStart(2, '0')}
                min="0"
                max="59"
                placeholder="SS"
                className={cn(
                  'w-16 text-center',
                  error ? 'border-red-300' : ''
                )}
              />
            </>
          )}
        </div>

        {error && <p className="text-xs italic text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

TimeInput.displayName = 'TimeInput';
