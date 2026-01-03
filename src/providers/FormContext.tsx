import { ReactNode, createContext, useContext } from "react";
import {
  Control,
  FieldValues,
  FormState,
  UseFormGetFieldState,
  UseFormReset,
  UseFormReturn,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";

// Generic form context shape aligned with react-hook-form
export interface FormContextType<TFieldValues extends FieldValues = FieldValues> {
  formId?: string;
  register: UseFormReturn<TFieldValues>["register"];
  errors: FormState<TFieldValues>["errors"];
  create?: boolean;
  edit?: boolean;
  setValue: UseFormSetValue<TFieldValues>;
  itemState?: any;
  getValues: UseFormReturn<TFieldValues>["getValues"];
  submit: () => void;
  formState: FormState<TFieldValues>;
  control: Control<TFieldValues>;
  reset: UseFormReset<TFieldValues>;
  watch: UseFormWatch<TFieldValues>;
  getFieldState: UseFormGetFieldState<TFieldValues>;
}

// Store as `any` to avoid context assignment narrowing issues while still allowing generics at the hook level
export const FormContext = createContext<FormContextType<any> | null>(null);

export interface FormProviderProps<TFieldValues extends FieldValues = FieldValues> {
  children: ReactNode;
  value: FormContextType<TFieldValues>;
}

export function FormProvider<TFieldValues extends FieldValues = FieldValues>({
  children,
  value,
}: FormProviderProps<TFieldValues>) {
  return <FormContext.Provider value={value as FormContextType<any>}>{children}</FormContext.Provider>;
}

export function useFormContext<TFieldValues extends FieldValues = FieldValues>() {
  const ctx = useContext(FormContext) as FormContextType<TFieldValues> | null;
  if (!ctx) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return ctx;
}
