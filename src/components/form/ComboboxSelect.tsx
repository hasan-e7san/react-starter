import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

export interface ComboboxOption {
  value: string | number;
  label: string;
}

export interface ComboboxSelectProps {
  title?: string;
  name: string;
  icon?: React.ReactElement;
  placeholder?: string;
  value?: string | number;
  options: ComboboxOption[];
  onChange?: (value: string) => void;
  onSearch?: (searchTerm: string) => void;
  error?: string;
  className?: string;
  hidden?: boolean;
  disabled?: boolean;
  showOtherOption?: boolean;
  otherOptionLabel?: string;
  emptyMessage?: string;
}

export const ComboboxSelect = React.forwardRef<HTMLButtonElement, ComboboxSelectProps>(
  (
    {
      title,
      name,
      icon,
      placeholder = 'Select...',
      value,
      options = [],
      onChange,
      onSearch,
      error,
      className,
      hidden,
      disabled,
      showOtherOption = false,
      otherOptionLabel = 'Please Select',
      emptyMessage = 'No item found.',
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [internalValue, setInternalValue] = React.useState<string>(String(value ?? ''));
    const [items, setItems] = React.useState<ComboboxOption[]>(options);

    React.useEffect(() => {
      setItems(options || []);
    }, [options]);

    React.useEffect(() => {
      setInternalValue(String(value ?? ''));
    }, [value]);

    const getLabelForValue = (val: string) => {
      const found = items.find((i) => String(i.value) === String(val));
      if (found) return found.label;
      if (showOtherOption && val === '0') return otherOptionLabel;
      return '';
    };

    const handleSelect = (newValue: string) => {
      // Toggle behavior: if same value is selected, clear it
      const finalValue = internalValue === newValue ? '' : newValue;
      setInternalValue(finalValue);
      onChange?.(finalValue);
      setOpen(false);
    };

    const selectedLabel = getLabelForValue(internalValue);

    if (hidden) {
      return null;
    }

    return (
      <div className={cn('mb-2', className)}>
        {title && (
          <Label htmlFor={name} className="mb-1 block font-bold flex items-center gap-2">
            {icon}
            {title}
          </Label>
        )}

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={ref}
              id={name}
              type="button"
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              className={cn(
                'w-full justify-between truncate overflow-hidden text-ellipsis',
                disabled && 'opacity-60 cursor-not-allowed',
                error && 'border-red-500'
              )}
            >
              <span className="truncate w-full text-left">
                {selectedLabel || placeholder}
              </span>
              <ChevronsUpDown className="opacity-50 flex-shrink-0 h-4 w-4" />
            </Button>
          </PopoverTrigger>

          {!disabled && (
            <PopoverContent className="w-full p-0" align="start">
              <Command>
                <CommandInput
                  placeholder={placeholder}
                  className="h-9"
                  onValueChange={onSearch}
                />
                <CommandList>
                  <CommandEmpty>{emptyMessage}</CommandEmpty>
                  <CommandGroup>
                    {showOtherOption && (
                      <CommandItem
                        key="__other__"
                        value={`0 ${otherOptionLabel}`}
                        onSelect={() => handleSelect('0')}
                      >
                        {otherOptionLabel}
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4',
                            internalValue === '0' ? 'opacity-100' : 'opacity-0'
                          )}
                        />
                      </CommandItem>
                    )}

                    {items.map((opt) => (
                      <CommandItem
                        key={String(opt.value)}
                        value={`${opt.value} ${opt.label}`}
                        onSelect={() => handleSelect(String(opt.value))}
                      >
                        {opt.label}
                        <Check
                          className={cn(
                            'ml-auto h-4 w-4',
                            internalValue === String(opt.value)
                              ? 'opacity-100'
                              : 'opacity-0'
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

        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

ComboboxSelect.displayName = 'ComboboxSelect';
