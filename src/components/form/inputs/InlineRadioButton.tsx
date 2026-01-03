import React, { useContext } from "react";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { createChangeEvent } from "../../../lib/utils";
import { FormContext } from "../../../providers/FormContext";
import { CustomRadioButtonProps } from "../../../types/forms/InputPropsType";

function InlineRadioButton(
  { title, name, items, onChange, vertical = false }: CustomRadioButtonProps,
  _ref: React.Ref<HTMLInputElement>
) {
  const form = useContext(FormContext);

  if (!form) return null;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className="mb-2">
          {title && <FormLabel>{title}</FormLabel>}
          <FormControl>
            <RadioGroup
              onValueChange={(e) => {
                onChange?.(createChangeEvent(name, e));
                field.onChange(e);
              }}
              defaultValue={field.value}
              className={vertical ? "flex flex-col space-y-1" : "flex flex-row flex-wrap gap-4"}
            >
              {items.map((item) => (
                <FormItem key={item.title} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={String(item.value)} checked={String(item.value) === String(field.value)} />
                  </FormControl>
                  <FormLabel className="font-normal flex gap-2 ml-1 pt-1">
                    {item.title}
                    {item.icon &&
                      React.cloneElement(item.icon as React.ReactElement<any>, {
                        className: "h-4 w-4",
                      } as any)}
                  </FormLabel>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage className="h-auto min-h-2" />
        </FormItem>
      )}
    />
  );
}
const InlineRadioButtonField = React.forwardRef(InlineRadioButton);
export default InlineRadioButtonField;
