import React from "react";

import { CustomRadioButtonProps } from "../../../types/forms/InputPropsType";

function InlineRadioButtonSimple(
  { title, name, items, error, onChange, className, vertical = false, ...res }: CustomRadioButtonProps,
  ref: React.Ref<HTMLInputElement>
) {
  return (
    <fieldset className="m-1">
      {title && <legend className="mb-2 text-black block text-sm font-medium">{title}</legend>}
      <div className={`rounded-md border ${error ? "border-red-300" : "border-gray-200"} bg-white px-3 py-2 ${className}`}>
        <div className={`flex ${vertical ? "flex-col" : "flex-row items-center gap-4"}`}>
          {items.map((item, idx) => {
            const id = `${name || "radio"}-${idx}-${String(item.value)}`;
            return (
              <div key={id} className="flex items-center">
                <input
                  {...res}
                  id={id}
                  name={name || String(item.title || name)}
                  type="radio"
                  onChange={onChange}
                  value={String(item.value)}
                  ref={ref}
                  className={`h-4 w-4 ${res.disabled ? "" : "cursor-pointer"} border-gray-300 bg-gray-100 text-black focus:ring-2`}
                />
                {item.title && (
                  <label
                    aria-disabled={res.disabled}
                    htmlFor={id}
                    className={`ml-2 ${res.disabled ? "" : "cursor-pointer"} text-sm text-gray-700`}
                  >
                    {item.title}
                  </label>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {error && <p className="text-xs italic text-red-500 mt-2">{error as string}</p>}
    </fieldset>
  );
}
const InlineRadioButtonSimpleField = React.forwardRef(InlineRadioButtonSimple);
export default InlineRadioButtonSimpleField;
