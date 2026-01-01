import * as React from 'react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export interface FormButtonsProps {
  loading?: boolean;
  showSubmit?: boolean;
  showCancel?: boolean;
  showReset?: boolean;
  submitText?: string;
  cancelText?: string;
  resetText?: string;
  onCancel?: () => void;
  onReset?: () => void;
  onSubmit?: () => void;
  className?: string;
  submitDisabled?: boolean;
  cancelDisabled?: boolean;
  resetDisabled?: boolean;
}

export const FormButtons = React.forwardRef<HTMLDivElement, FormButtonsProps>(
  (
    {
      loading = false,
      showSubmit = true,
      showCancel = false,
      showReset = true,
      submitText = 'Submit',
      cancelText = 'Cancel',
      resetText = 'New',
      onCancel,
      onReset,
      onSubmit,
      className,
      submitDisabled = false,
      cancelDisabled = false,
      resetDisabled = false,
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('m-2 flex justify-end gap-4', className)}>
        {showCancel && (
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
            disabled={cancelDisabled || loading}
            className="flex h-10 items-center rounded-lg bg-gray-100 px-4 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-200"
          >
            {cancelText}
          </Button>
        )}

        {showReset && (
          <Button
            type="button"
            variant="outline"
            onClick={onReset}
            disabled={resetDisabled || loading}
            className="flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors"
          >
            {resetText}
          </Button>
        )}

        {showSubmit && (
          <Button
            type={onSubmit ? 'button' : 'submit'}
            onClick={onSubmit}
            disabled={submitDisabled || loading}
            className="flex h-10 items-center rounded-lg px-4 text-sm font-medium transition-colors"
          >
            {loading ? 'Please wait...' : submitText}
          </Button>
        )}
      </div>
    );
  }
);

FormButtons.displayName = 'FormButtons';
