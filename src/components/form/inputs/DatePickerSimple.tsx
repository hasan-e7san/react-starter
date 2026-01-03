import * as React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";

import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { Input } from "../../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { cn, createChangeEvent } from "../../../lib/utils";

interface DatePickerSimpleProps {
  title?: string;
  name: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  onChange?: (e: any) => void;
  className?: string;
  showTime?: boolean;
  timeName?: string;
  timeValue?: string;
  timeError?: string;
  onTimeChange?: (e: any) => void;
}

function getFormatedDate(date: Date) {
  return date.toISOString().split("T")[0];
}

const DatePickerSimple = React.forwardRef<HTMLInputElement, DatePickerSimpleProps>(
  (
    {
      title,
      name,
      defaultValue,
      placeholder,
      disabled,
      error,
      onChange,
      className,
      showTime = false,
      timeName,
      timeValue,
      timeError,
      onTimeChange,
    },
    _ref
  ) => {
    const initial = defaultValue ? new Date(defaultValue + "T00:00:00") : undefined;
    const [date, setDate] = React.useState<Date | undefined>(initial);
    const [time, setTime] = React.useState<string>(timeValue || "");

    React.useEffect(() => {
      if (timeValue !== undefined) {
        setTime(timeValue);
      }
    }, [timeValue]);

    const handleSelect = (selected?: Date) => {
      setDate(selected);

      if (onChange) {
        const formatted = selected ? getFormatedDate(selected) : "";
        onChange(createChangeEvent(name, formatted));
      }
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTime = e.target.value;
      setTime(newTime);

      if (onTimeChange && timeName) {
        onTimeChange(createChangeEvent(timeName, newTime));
      }
    };

    return (
      <div className={`mb-2 ${className || ""}`}>
        {title && <label className="mb-1 block text-md font-bold">{title}</label>}

        <div className="flex gap-2">
          <div className="flex-1">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  disabled={disabled}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                    error ? "border-red-300" : "border-gray-200"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : placeholder || "Pick a date"}
                </Button>
              </PopoverTrigger>

              {!disabled && (
                <PopoverContent className="p-0">
                  <Calendar mode="single" selected={date} onSelect={handleSelect} initialFocus />
                </PopoverContent>
              )}
            </Popover>
          </div>

          {showTime && (
            <div className="w-32">
              <Input
                type="time"
                value={time}
                onChange={handleTimeChange}
                disabled={disabled}
                className={cn("h-10", timeError ? "border-red-300" : "border-gray-200")}
              />
            </div>
          )}
        </div>

        {(error || timeError) && <p className="text-xs italic text-red-500 mt-1">{error || timeError}</p>}
      </div>
    );
  }
);

export default DatePickerSimple;
