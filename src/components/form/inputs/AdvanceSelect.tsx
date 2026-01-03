import * as React from "react";
import { useContext } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { Button } from "../../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../ui/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { cn, createChangeEvent } from "../../../lib/utils";
import { FormContext } from "../../../providers/FormContext";
import { CustomSelectProps, SelectOption } from "../../../types/forms/SelectPropsType";

function AdvanceSelect(
  {
    title,
    name,
    icon,
    placeholder,
    selected,
    options = [],
    onTypeing,
    otherOption,
    onChange,
    className,
    hidden,
    disabled,
  }: CustomSelectProps,
  ref: any
) {
  const form = useContext(FormContext);
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState<SelectOption[]>(options);

  React.useEffect(() => {
    setItems(options || []);
  }, [options]);

  const getLabelForValue = (val: unknown) => {
    const found = items.find((i) => String(i.value) === String(val));
    if (found) return found.label;
    if (otherOption && String(val) === "0") return otherOption;
    return "";
  };

  return (
    <FormField
      control={form?.control}
      name={name}
      render={({ field }) => {
        const fieldValue = field.value ?? (selected ?? "");
        const selectedLabel = getLabelForValue(fieldValue);

        return !hidden ? (
          <FormItem className={cn("mb-2", className)}>
            {title ? (
              <FormLabel className="font-bold flex items-center gap-2">
                {icon ? icon : null}
                {title}
              </FormLabel>
            ) : null}

            <FormControl>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    ref={ref}
                    type="button"
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                      "w-full justify-between truncate overflow-hidden text-ellipsis",
                      disabled && "opacity-60 cursor-not-allowed"
                    )}
                    disabled={disabled}
                  >
                    <span className="truncate w-full text-left">
                      {selectedLabel || placeholder || "Select..."}
                    </span>
                    <ChevronsUpDown className="opacity-50 flex-shrink-0" />
                  </Button>
                </PopoverTrigger>

                {!disabled && (
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder={placeholder}
                        className="h-9"
                        onValueChange={onTypeing}
                      />
                      <CommandList>
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup>
                          {otherOption && (
                            <CommandItem
                              key="__other__"
                              value={`0 ${otherOption}`}
                              onSelect={() => {
                                field.onChange("0");
                                onChange?.(createChangeEvent(name, "0"));
                                setOpen(false);
                              }}
                            >
                              {otherOption}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  String(fieldValue) === "0" ? "opacity-100" : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          )}

                          {items.map((opt) => (
                            <CommandItem
                              key={String(opt.value)}
                              value={`${opt.value} ${opt.label}`}
                              onSelect={() => {
                                const newVal = String(opt.value);
                                const finalVal = String(fieldValue) === newVal ? "" : newVal;

                                field.onChange(finalVal);
                                onChange?.(createChangeEvent(name, finalVal));
                                setOpen(false);
                              }}
                            >
                              {opt.label}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  String(fieldValue) === String(opt.value)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                )}
              </Popover>
            </FormControl>

            <FormMessage className="h-auto min-h-2" />
          </FormItem>
        ) : (
          <></>
        );
      }}
    />
  );
}

const AdvanceSelectField = React.forwardRef(AdvanceSelect);
export default AdvanceSelectField;
