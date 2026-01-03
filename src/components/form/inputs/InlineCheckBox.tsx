import { useContext } from "react";

import { Checkbox } from "../../ui/checkbox";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { createChangeEvent } from "../../../lib/utils";
import { FormContext } from "../../../providers/FormContext";
import { CustomCheckBoxProps } from "../../../types/forms/InputPropsType";

function InlineCheckBox({ title, placeholder, name, items, className, disabled, onChange }: CustomCheckBoxProps<any>) {
  const form = useContext(FormContext);

  if (!form) return null;

  return (
    <FormField
      control={form.control}
      name={name}
      render={() => (
        <FormItem className={`mb-3 ${className ?? ""}`}>
          <div className="mb-3">
            {title && <FormLabel className="text-base">{title}</FormLabel>}
            {placeholder && <FormDescription>{placeholder}</FormDescription>}
          </div>
          {items.map((item) => (
            <FormField
              key={item.value}
              control={form.control}
              name={name}
              render={({ field }) => {
                const fieldValue = field.value;
                const isChecked = Array.isArray(fieldValue)
                  ? fieldValue?.includes(item.value)
                  : String(fieldValue) === String(item.value);

                return (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        disabled={disabled}
                        checked={item.checked || isChecked}
                        onCheckedChange={(chkd) => {
                          let newValue: any = [item.value];
                          if (Array.isArray(fieldValue) && fieldValue) {
                            newValue = [...fieldValue, ...newValue];
                          }
                          if (onChange) onChange(createChangeEvent(name, String(item.value ?? "")));

                          return chkd
                            ? field.onChange(items.length === 1 ? item.value : newValue)
                            : field.onChange(
                                Array.isArray(fieldValue)
                                  ? fieldValue?.filter((value: string) => value !== item.value)
                                  : ""
                              );
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">{item.label}</FormLabel>
                  </FormItem>
                );
              }}
            />
          ))}
          <FormMessage className="h-auto min-h-2" />
        </FormItem>
      )}
    />
  );
}

export default InlineCheckBox;
