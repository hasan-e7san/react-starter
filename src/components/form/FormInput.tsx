import * as React from 'react';
import { cn } from '../../lib/utils';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

export interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'type'> {
  title?: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'time' | 'date' | 'cardNumber' | 'textarea';
  icon?: React.ReactElement;
  placeholder?: string;
  error?: string;
  rows?: number;
  value?: string | number;
  onValueChange?: (value: string) => void;
  showDateLabel?: boolean; // Show formatted date for date inputs
}

const formatCardNumber = (value: string) => {
  return value
    .replace(/\D/g, '') // Remove non-digit characters
    .replace(/(\d{4})(?=\d)/g, '$1 '); // Add a space after every 4 digits
};

export const FormInput = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, FormInputProps>(
  (
    {
      title,
      name,
      type = 'text',
      icon,
      placeholder,
      error,
      rows = 5,
      className,
      disabled,
      value,
      onChange,
      onValueChange,
      showDateLabel = false,
      hidden,
      ...rest
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let formattedValue = e.target.value;
      
      // Format card number if type is cardNumber
      if (type === 'cardNumber') {
        formattedValue = formatCardNumber(e.target.value);
      }
      
      // Call external onChange with formatted value
      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: formattedValue }
        } as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;
        onChange(syntheticEvent);
      }
      
      // Call onValueChange if provided
      if (onValueChange) {
        onValueChange(formattedValue);
      }
    };

    if (hidden) {
      return null;
    }

    return (
      <div className={cn('mb-2', className)}>
        {title && (
          <Label htmlFor={name} className="mb-1 block font-bold">
            {title}
            {showDateLabel && type === 'date' && value && (
              <span className="text-orange-500 ml-1">
                ({new Date(String(value)).toUTCString().substring(5, 11)})
              </span>
            )}
          </Label>
        )}

        <div className="relative">
          {type === 'textarea' ? (
            <Textarea
              {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
              id={name}
              name={name}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              rows={rows}
              placeholder={placeholder}
              disabled={disabled}
              value={value ?? ''}
              onChange={handleChange}
              className={cn(error && 'border-red-500')}
            />
          ) : (
            <Input
              {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
              id={name}
              name={name}
              type={type === 'cardNumber' ? 'text' : type}
              ref={ref as React.Ref<HTMLInputElement>}
              placeholder={placeholder}
              disabled={disabled}
              value={value ?? ''}
              onChange={handleChange}
              className={cn(error && 'border-red-500')}
            />
          )}

          {/* Icon rendering for non-textarea inputs */}
          {type !== 'textarea' && icon && React.isValidElement(icon) &&
            React.cloneElement(icon, {
              className: 'pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500'
            } as any)
          }
        </div>

        {error && (
          <p className="text-xs text-red-500 mt-1">{error}</p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
