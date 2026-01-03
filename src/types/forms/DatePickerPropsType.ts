import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

export interface DatePickerPropsType {
  type?: string;
  title: string;
  name: string;
  className?: string;
  rows?: number;
  placeholder?: string;
  disabled?: boolean;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
}
