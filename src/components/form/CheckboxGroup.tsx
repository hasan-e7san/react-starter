import * as React from 'react';
import { cn } from '../../lib/utils';

export interface CheckboxItem {
  id: string;
  name: string;
  displayName?: string;
  checked?: boolean;
}

export interface CheckboxGroupProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  title?: string;
  name?: string;
  items: CheckboxItem[];
  error?: string;
}

export const CheckboxGroup = React.forwardRef<HTMLInputElement, CheckboxGroupProps>(
  (
    {
      title,
      name,
      items,
      error,
      className,
      disabled,
      ...rest
    },
    ref
  ) => {
    const firstItem = items[0];
    const hasMultipleItems = items.length > 1;

    return (
      <fieldset className={cn('m-1', className)}>
        {title && (
          <legend className="mb-2 text-black block text-sm font-medium bold">
            {title}
          </legend>
        )}
        
        <div className={cn(
          'rounded-md border bg-white px-[14px] py-1',
          error ? 'border-red-300' : 'border-gray-200'
        )}>
          <div className="flex gap-4">
            {hasMultipleItems ? (
              items.map(item => (
                <div key={item.id} className="flex items-center">
                  <input
                    {...rest}
                    id={item.id}
                    name={name || item.name}
                    type="checkbox"
                    ref={ref}
                    checked={item.checked}
                    disabled={disabled}
                    className={cn(
                      'h-4 w-4 border-gray-300 bg-gray-100 text-black focus:ring-2',
                      disabled ? '' : 'cursor-pointer'
                    )}
                  />
                  {(item.displayName || item.name) && (
                    <label
                      htmlFor={item.id}
                      aria-disabled={disabled}
                      className={cn(
                        'ml-2 flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600',
                        disabled ? '' : 'cursor-pointer'
                      )}
                    >
                      {item.displayName || item.name}
                    </label>
                  )}
                </div>
              ))
            ) : (
              <div key={firstItem.id} className="flex items-center">
                <input
                  {...rest}
                  id={firstItem.id}
                  name={name || firstItem.name}
                  type="checkbox"
                  ref={ref}
                  checked={firstItem.checked}
                  disabled={disabled}
                  className={cn(
                    'h-4 w-4 border-gray-300 bg-gray-100 text-black focus:ring-2',
                    disabled ? '' : 'cursor-pointer'
                  )}
                />
                {(firstItem.displayName || firstItem.name) && (
                  <label
                    htmlFor={firstItem.id}
                    aria-disabled={disabled}
                    className={cn(
                      'ml-2 flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600',
                      disabled ? '' : 'cursor-pointer'
                    )}
                  >
                    {firstItem.displayName || firstItem.name}
                  </label>
                )}
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <p className="text-xs italic text-red-500 mt-2">{error}</p>
        )}
      </fieldset>
    );
  }
);

CheckboxGroup.displayName = 'CheckboxGroup';
