import * as React from 'react';
import { cn } from '../../lib/utils';

export interface TextInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'type'> {
  title?: string;
  name: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search' | 'time' | 'date' | 'textarea';
  icon?: React.ReactElement;
  placeholder?: string;
  error?: string;
  rows?: number;
  inputClassName?: string;
}

export const TextInput = React.forwardRef<HTMLInputElement | HTMLTextAreaElement, TextInputProps>(
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
      inputClassName,
      disabled,
      ...rest
    },
    ref
  ) => {
    return (
      <div className={cn('mb-2', className)}>
        {title && (
          <label htmlFor={name} className="mb-2 block text-sm font-bold">
            {title}
          </label>
        )}
        
        <div className="relative">
          {type !== 'textarea' ? (
            <input
              {...rest}
              id={name}
              name={name}
              type={type}
              ref={ref as React.Ref<HTMLInputElement>}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                'peer block w-full rounded-md border',
                type === 'time' ? '' : 'py-2',
                'pl-10 text-sm outline-2 placeholder:text-gray-500',
                error ? 'border-red-300' : 'border-gray-200',
                disabled ? 'text-gray-400' : 'text-black',
                disabled ? '' : 'cursor-pointer',
                'p-1',
                inputClassName
              )}
            />
          ) : (
            <textarea
              {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
              id={name}
              name={name}
              ref={ref as React.Ref<HTMLTextAreaElement>}
              rows={rows}
              placeholder={placeholder}
              disabled={disabled}
              className={cn(
                'peer block w-full rounded-md border dark:text-black py-2 pl-5 text-sm outline-2 placeholder:text-gray-500',
                error ? 'border-red-300' : 'border-gray-200',
                disabled ? '' : 'cursor-pointer',
                inputClassName
              )}
            />
          )}

          {/* Conditionally render the icon if it exists */}
          {type !== 'textarea' && icon && React.isValidElement(icon) &&
            React.cloneElement(icon, {
              className: 'pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900'
            } as any)
          }
        </div>
        
        {error && (
          <p className="text-xs italic text-red-500 mt-2">{error}</p>
        )}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';
