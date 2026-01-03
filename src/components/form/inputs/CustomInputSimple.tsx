import React from "react";

import { CustomInputProps } from "../../../types/forms/InputPropsType";

function CustomInputSimple(
  { title, name, type, icon, placeholder, error, ...rest }: CustomInputProps,
  ref: any
) {
  const { inputClassName, ...res } = rest;
  return (
    <div className={`mb-2 ${res.className ?? ""}`}>
      {title && (
        <label htmlFor={name} className={`mb-2 block text-sm font-bold ${res.className ?? ""}`}>
          {title}
        </label>
      )}
      <div className="relative">
        {type !== "textarea" ? (
          <input
            {...res}
            id={name}
            name={name}
            type={type}
            ref={ref}
            placeholder={placeholder}
            className={`peer block w-full ${res.disabled ? "" : "cursor-pointer"} rounded-md border ${
              ["time"].includes(String(type)) ? "" : "py-2"
            } pl-10 text-sm outline-2 placeholder:text-gray-500 ${error ? "border-red-300" : "border-gray-200"} ${
              res.disabled && !inputClassName ? "text-gray-400" : "text-black"
            } p-1 ${inputClassName ?? ""}`}
          />
        ) : (
          <textarea
            {...res}
            id={name}
            ref={ref}
            rows={res.rows ?? 5}
            className={`peer block w-full ${res.disabled ? "" : "cursor-pointer"} rounded-md border dark:text-black  py-2 pl-5 text-sm outline-2 placeholder:text-gray-500 ${
              error ? "border-red-300" : "border-gray-200"
            }`}
            name={name}
          ></textarea>
        )}

        {type !== "textarea" && icon && React.isValidElement(icon) &&
          React.cloneElement(icon as React.ReactElement<any>, {
            className:
              "pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900",
          } as any)}
      </div>
      {error && <p className="text-xs italic text-red-500 mt-2">{error as string}</p>}
    </div>
  );
}

const CustomInputSimpleField = React.forwardRef(CustomInputSimple);
export default CustomInputSimpleField;
