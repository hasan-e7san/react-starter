import * as React from 'react';
import { cn } from '../../lib/utils';

export interface RadioItem {
  value: string | number;
  title?: string;
}

export interface RadioGroupProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  title?: string;
  name?: string;
  items: RadioItem[];
  error?: string;
  vertical?: boolean;
}

export const RadioGroup = React.forwardRef<HTMLInputElement, RadioGroupProps>(
  (
    {
      title,
      name,
      items,
      error,
      className,
      vertical = false,
      disabled,
      onChange,
      ...rest
    },
    ref
  ) => {
    return (
      <fieldset className={cn('m-1', className)}>
        {title && (
          <legend className="mb-2 text-black block text-sm font-medium">
            {title}
          </legend>
        )}
        
        <div className={cn(
          'rounded-md border bg-white px-3 py-2',
          error ? 'border-red-300' : 'border-gray-200'
        )}>
          <div className={cn(
            'flex',
            vertical ? 'flex-col' : 'flex-row items-center gap-4'
          )}>
            {items.map((item, idx) => {
              const id = `${name || 'radio'}-${idx}-${String(item.value)}`;
              return (
                <div key={id} className="flex items-center">
                  <input
                    {...rest}
                    id={id}
                    name={name || String(item.title || name)}
                    type="radio"
                    onChange={onChange}
                    value={item.value}
                    ref={ref}
                    disabled={disabled}
                    className={cn(
                      'h-4 w-4 border-gray-300 bg-gray-100 text-black focus:ring-2',
                      disabled ? '' : 'cursor-pointer'
                    )}
                  />
                  {item.title && (
                    <label
                      htmlFor={id}
                      aria-disabled={disabled}
                      className={cn(
                        'ml-2 text-sm text-gray-700',
                        disabled ? '' : 'cursor-pointer'
                      )}
                    >
                      {item.title}
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        {error && (
          <p className="text-xs italic text-red-500 mt-2">{error}</p>
        )}
      </fieldset>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
