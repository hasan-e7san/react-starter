import * as React from 'react';
import { cn } from '../../lib/utils';
import { Label } from '../ui/label';
import {
  Select as SelectPrimitive,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export interface SelectOption {
  value: string | number;
  label: string;
}

export interface SelectProps {
  title?: string;
  name: string;
  placeholder?: string;
  className?: string;
  value?: string | number;
  options: SelectOption[];
  onChange?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  showOtherOption?: boolean;
  otherOptionLabel?: string;
  hidden?: boolean;
}

export const Select = React.forwardRef<HTMLButtonElement, SelectProps>(
  (
    {
      title,
      name,
      placeholder = 'Select',
      className,
      value,
      options = [],
      onChange,
      error,
      disabled,
      showOtherOption = false,
      otherOptionLabel = 'Please Select',
      hidden,
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string>(String(value ?? ''));

    React.useEffect(() => {
      setInternalValue(String(value ?? ''));
    }, [value]);

    const handleValueChange = (newValue: string) => {
      setInternalValue(newValue);
      onChange?.(newValue);
    };

    if (hidden) {
      return null;
    }

    return (
      <div className={cn('mb-2', className)}>
        {title && (
          <Label htmlFor={name} className="mb-1 block font-bold">
            {title}
          </Label>
        )}

        <SelectPrimitive
          value={internalValue}
          onValueChange={handleValueChange}
          disabled={disabled}
        >
          <SelectTrigger
            ref={ref}
            id={name}
            className={cn(error && 'border-red-500')}
          >
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>

          <SelectContent>
            {showOtherOption && (
              <SelectItem value="0">
                {otherOptionLabel}
              </SelectItem>
            )}
            
            {options.map((option) => (
              <SelectItem key={String(option.value)} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectPrimitive>

        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
