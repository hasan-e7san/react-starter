import React from "react";

import { CustomCheckBoxProps } from "../../../types/forms/InputPropsType";

function InlineCheckBoxSimple(
  { title, name, items, error, ...res }: CustomCheckBoxProps<{ id: string; name: string; display_name?: string; checked?: boolean }>,
  ref: any
) {
  const item = items[0];
  return (
    <fieldset className="m-1">
      {title && <legend className="mb-2 text-black block text-sm font-medium bold">{title}</legend>}
      <div className={`rounded-md border ${error ? "border-red-300" : "border-gray-200"} bg-white px-[14px] py-1`}>
        <div className="flex gap-4">
          {items.length > 1 ? (
            items.map((itm) => {
              return (
                <div key={itm.id} className="flex items-center">
                  <input
                    {...res}
                    id={itm.id + ""}
                    name={name || itm.name}
                    type="checkbox"
                    ref={ref}
                    checked={itm.checked}
                    className={`h-4 w-4 ${res.disabled ? "" : "cursor-pointer"} border-gray-300 bg-gray-100 text-black focus:ring-2`}
                  />
                  {(itm.display_name || itm.name) && (
                    <label
                      aria-disabled={res.disabled}
                      htmlFor={itm.id + ""}
                      className={`ml-2 flex ${res.disabled ? "" : "cursor-pointer"} items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600`}
                    >
                      {itm.display_name || itm.name}
                    </label>
                  )}
                </div>
              );
            })
          ) : (
            <div key={item.id} className="flex items-center">
              <input
                {...res}
                id={item.id + ""}
                name={name || item.name}
                type="checkbox"
                ref={ref}
                className={`h-4 w-4 ${res.disabled ? "" : "cursor-pointer"} border-gray-300 bg-gray-100 text-black focus:ring-2`}
              />
              {(item.display_name || item.name) && (
                <label
                  aria-disabled={res.disabled}
                  htmlFor={item.id + ""}
                  className={`ml-2 flex ${res.disabled ? "" : "cursor-pointer"} items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600`}
                >
                  {item.display_name || item.name}
                </label>
              )}
            </div>
          )}
        </div>
      </div>
      {error && <p className="text-xs italic text-red-500 mt-2">{error as string}</p>}
    </fieldset>
  );
}

const InlineCheckBoxSimpleField = React.forwardRef(InlineCheckBoxSimple);
export default InlineCheckBoxSimpleField;
