import React, { useContext } from "react";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { cn } from "../../../lib/utils";
import { FormContext } from "../../../providers/FormContext";
import { CustomInputProps } from "../../../types/forms/InputPropsType";

function CustomInput(
  { title, name, type, placeholder, className, ...res }: CustomInputProps,
  ref: any
) {
  const form = useContext(FormContext);
  const formatCardNumber = (value: string) => value.replace(/\D/g, "").replace(/(\d{4})(?=\d)/g, "$1 ");

  if (!form) return null;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        if (res.hidden) return <></>;

        return (
          <FormItem className={cn("mb-2", className)}>
            {title ? (
              <FormLabel className="font-bold">
                {title}
                {type === "date" && field.value ? (
                  <span className="text-orange-500 ml-1">
                    ({new Date(String(field.value)).toUTCString().substring(5, 11)})
                  </span>
                ) : null}
              </FormLabel>
            ) : null}

            <FormControl>
              {type === "textarea" ? (
                <Textarea
                  placeholder={placeholder}
                  {...field}
                  {...res}
                  value={field.value ?? (res.value ?? "")}
                  ref={ref}
                />
              ) : (
                <Input
                  type={type}
                  placeholder={placeholder}
                  {...field}
                  {...res}
                  value={field.value ?? (res.value ?? "")}
                  onChange={(e) => {
                    const formattedValue = type === "cardNumber" ? formatCardNumber(e.target.value) : e.target.value;
                    field.onChange(formattedValue);
                  }}
                  ref={ref}
                />
              )}
            </FormControl>
            <FormMessage className="h-auto min-h-2" />
          </FormItem>
        );
      }}
    />
  );
}

const CustomInputField = React.forwardRef(CustomInput);
export default CustomInputField;
