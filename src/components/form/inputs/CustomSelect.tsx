import React, { useContext } from "react";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../../ui/form";
import { createChangeEvent } from "../../../lib/utils";
import { FormContext } from "../../../providers/FormContext";
import { CustomSelectProps, SelectOption } from "../../../types/forms/SelectPropsType";

function CustomSelect(
  { title, name, placeholder, className, selected, options, onChange, ...res }: CustomSelectProps,
  _ref: any
) {
  const form = useContext(FormContext);
  const [value, setValue] = React.useState("");
  const [items, setItems] = React.useState<SelectOption[]>(options || []);

  const generateValue = (item: SelectOption) => String(item.value) + item.label;

  React.useEffect(() => {
    if (Array.isArray(options) && options.length > 0) {
      setItems([...options]);
    }
  }, [options]);

  const selectedValue = typeof form?.watch === "function" ? form?.watch(name) : selected;

  React.useEffect(() => {
    const selectedItem = items.filter((item) => String(item.value) === String(selectedValue));
    if (selectedItem.length > 0) {
      setValue(generateValue(selectedItem[0]));
    } else {
      setValue("");
    }
  }, [items, selectedValue]);

  if (!form) return null;

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem className={`mb-2 ${className ?? ""}`}>
          {title && <FormLabel>{title}</FormLabel>}
          <Select
            onValueChange={(currentValue) => {
              const newValue = currentValue === value ? "" : currentValue;
              setValue(newValue);
              if (onChange) onChange(createChangeEvent(name, newValue));
              field.onChange(newValue);
            }}
            defaultValue={String(field.value ?? "")}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder={!res.otherOption ? placeholder || "Select" : ""} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {res.otherOption && <SelectItem value={"0"}>Please Select</SelectItem>}
              {items.map((option: SelectOption) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage className="mt-1 h-auto min-h-2" />
        </FormItem>
      )}
    />
  );
}

const CustomSelectField = React.forwardRef(CustomSelect);
export default CustomSelectField;
