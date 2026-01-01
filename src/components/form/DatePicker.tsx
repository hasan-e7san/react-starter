import * as React from 'react';
import { format } from 'date-fns';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '../ui/popover';

export interface DatePickerProps {
  title?: string;
  name?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  className?: string;
  buttonClassName?: string;
}

export const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      title,
      name,
      value,
      onChange,
      placeholder = 'Pick a date',
      disabled,
      error,
      className,
      buttonClassName
    },
    ref
  ) => {
    const [date, setDate] = React.useState<Date | undefined>(value);

    React.useEffect(() => {
      setDate(value);
    }, [value]);

    const handleSelect = (selected: Date | undefined) => {
      setDate(selected);
      onChange?.(selected);
    };

    return (
      <div ref={ref} className={cn('mb-2', className)}>
        {title && (
          <label className="mb-1 block text-md font-bold" htmlFor={name}>
            {title}
          </label>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <Button
              id={name}
              variant="outline"
              disabled={disabled}
              className={cn(
                'w-full justify-start text-left font-normal',
                !date && 'text-muted-foreground',
                error ? 'border-red-300' : 'border-gray-200',
                buttonClassName
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : <span>{placeholder}</span>}
            </Button>
          </PopoverTrigger>

          {!disabled && (
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleSelect}
                initialFocus
              />
            </PopoverContent>
          )}
        </Popover>

        {error && <p className="text-xs italic text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker';
