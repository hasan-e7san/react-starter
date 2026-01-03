import * as React from "react";
import { useContext, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";

import { Button } from "../../ui/button";
import { Calendar } from "../../ui/calendar";
import { FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { cn } from "../../../lib/utils";
import { FormContext } from "../../../providers/FormContext";
import { DatePickerPropsType } from "../../../types/forms/DatePickerPropsType";

function getFormatedDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function DatePickerCustom({ title, name, placeholder, className, error }: DatePickerPropsType, _ref: any) {
  const form = useContext(FormContext);
  const nameValue = form?.watch(name);

  const [date, setDate] = React.useState<Date | undefined>(
    form?.getValues?.()[name] ? new Date(String(form.getValues?.()[name]) + "T00:00:00") : undefined
  );
  const [currentMonth, setCurrentMonth] = React.useState(date ? date : new Date());

  useEffect(() => {
    if (!form) return;
    const localValue = date ? getFormatedDate(date) : undefined;
    form.setValue(name, localValue as any);
  }, [date, form, name]);

  useEffect(() => {
    if (!form) return;
    if (!nameValue) {
      setDate(undefined);
    } else if (typeof nameValue === "string") {
      setDate(new Date(nameValue + "T00:00"));
    }
  }, [nameValue, form]);

  const handleMonthChange = (month: React.SetStateAction<Date>) => {
    setCurrentMonth(month);
  };

  const handleYearChange = (value: string) => {
    const newYear = parseInt(value, 10);
    const newMonth = new Date(currentMonth.setFullYear(newYear));
    setCurrentMonth(newMonth);
  };
  const years = Array.from(new Array(200), (_, index) => currentMonth.getFullYear() - 100 + index);

  if (!form) return null;

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className={`mb-2 ${className ?? ""}`}>
          {title && <FormLabel>{title}</FormLabel>}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  error ? "border-red-300" : "border-gray-200"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : <span>{placeholder}</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent style={{ width: "fit-content" }} className="p-0">
              <Select value={currentMonth.getFullYear() + ""} onValueChange={handleYearChange}>
                <SelectTrigger className="rounded-none shadow-none">
                  <SelectValue placeholder="Select a Year" />
                </SelectTrigger>
                <SelectContent>
                  {years.map((year) => (
                    <SelectItem key={year} value={year + ""}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                month={currentMonth}
                onMonthChange={handleMonthChange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <FormMessage className="h-auto min-h-2" />
        </FormItem>
      )}
    />
  );
}

const DatePicker = React.forwardRef(DatePickerCustom);
export default DatePicker;
