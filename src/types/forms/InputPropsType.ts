import React, { JSXElementConstructor, ReactElement } from "react";
import { FieldError, FieldErrorsImpl, Merge } from "react-hook-form";

export interface CustomInputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  title?: string;
  name: string;
  type?: string;
  rows?: number;
  placeholder?: string;
  inputClassName?: string;
  icon?: ReactElement<any, string | JSXElementConstructor<any>>;
  error?: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>>;
}

export interface CustomRadioButtonProps extends CustomInputProps {
  vertical?: boolean;
  items: Array<{
    title: string;
    checked?: boolean;
    value: boolean | string | number;
    placeholder?: string;
    icon?: ReactElement;
  }>;
}

export interface CustomCheckBoxProps<T> extends CustomInputProps {
  items: T[];
  placeholder?: string;
}
