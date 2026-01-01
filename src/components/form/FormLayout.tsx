import * as React from 'react';
import { cn } from '../../lib/utils';
import { Card } from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { AlertCircle } from 'lucide-react';
import { FormButtons } from './FormButtons';

export interface FormLayoutProps {
  children: React.ReactNode;
  onSubmit?: (data: any) => void | Promise<void>;
  error?: string;
  loading?: boolean;
  className?: string;
  showSubmit?: boolean;
  showCancel?: boolean;
  showReset?: boolean;
  submitText?: string;
  cancelText?: string;
  resetText?: string;
  onCancel?: () => void;
  onReset?: () => void;
  fullHeight?: boolean;
  cardClassName?: string;
  buttonsClassName?: string;
}

export const FormLayout = React.forwardRef<HTMLFormElement, FormLayoutProps>(
  (
    {
      children,
      onSubmit,
      error,
      loading = false,
      className,
      showSubmit = true,
      showCancel = false,
      showReset = true,
      submitText,
      cancelText,
      resetText,
      onCancel,
      onReset,
      fullHeight = false,
      cardClassName,
      buttonsClassName,
    },
    ref
  ) => {
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (onSubmit) {
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        onSubmit(data);
      }
    };

    return (
      <form
        ref={ref}
        onSubmit={handleSubmit}
        className={cn(
          'rounded-md flex flex-col',
          fullHeight && 'h-[90vh]',
          className
        )}
      >
        <div className="rounded-md bg-white dark:bg-stone-950 flex-1 overflow-auto p-4">
          <Card className={cn('p-4', cardClassName)}>
            {children}

            {error && (
              <Alert variant="destructive" className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  <div dangerouslySetInnerHTML={{ __html: error }} />
                </AlertDescription>
              </Alert>
            )}

            <div className="p-4 bg-white dark:bg-stone-950 border-t sticky bottom-0 z-10">
              <FormButtons
                loading={loading}
                showSubmit={showSubmit}
                showCancel={showCancel}
                showReset={showReset}
                submitText={submitText}
                cancelText={cancelText}
                resetText={resetText}
                onCancel={onCancel}
                onReset={onReset}
                className={buttonsClassName}
              />
            </div>
          </Card>
        </div>
      </form>
    );
  }
);

FormLayout.displayName = 'FormLayout';
