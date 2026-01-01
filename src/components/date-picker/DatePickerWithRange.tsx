import * as React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { cn } from '../../lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';

export type DatePickerWithRangeProps = {
  onChange: (from: Date | undefined, to: Date | undefined) => void;
  startDate: Date;
  endDate: Date;
  className?: string;
};

export const DatePickerWithRange = ({
  onChange,
  startDate,
  endDate,
  className
}: DatePickerWithRangeProps) => {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: startDate,
    to: endDate
  });
  const [open, setOpen] = React.useState(false);

  const onApplyChanges = () => {
    onChange(date?.from, date?.to);
    setOpen(false);
  };

  return (
    <>
      <div className={cn('grid z-50', className)}>
        <label className="mb-0 block text-md font-bold">Pick a date</label>
        <Popover open={open}>
          <PopoverTrigger asChild onClick={() => setOpen((prev) => !prev)}>
            <Button
              id="date"
              variant={'outline'}
              className={cn(
                'w-[100%] justify-start text-left font-normal truncate overflow-hidden text-ellipsis',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className={'pr-2'} />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, 'LLL dd, y')} -{' '}
                    {format(date.to, 'LLL dd, y')}
                  </>
                ) : (
                  format(date.from, 'LLL dd, y')
                )
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-0 "
            align="start"
            style={{ left: '1rem' }}
          >
            <Calendar
              style={{ left: '1rem' }}
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={3}
            />
            <Button onClick={onApplyChanges} className={'m-2'}>
              Apply
            </Button>
          </PopoverContent>
        </Popover>
      </div>
    </>
  );
};
