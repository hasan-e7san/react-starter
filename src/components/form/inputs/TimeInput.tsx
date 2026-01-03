import React, { useContext, useEffect, useState } from "react";

import { createChangeEvent } from "../../../lib/utils";
import { FormContext } from "../../../providers/FormContext";
import { CustomInputProps } from "../../../types/forms/InputPropsType";

function isNumeric(str: string) {
  return /^\d{1,}$/.test(str);
}

function TimeInput({ title, name, type, placeholder, error, onChange, ...res }: CustomInputProps, ref: any) {
  const form = useContext(FormContext);
  const [hours, setHours] = useState<number | null>(null);
  const [minutes, setMinutes] = useState<number | null>(null);
  const hoursMinutes = form?.watch(name);

  useEffect(() => {
    if (!form) return;
    const initHousMinutes = form.getValues(name);
    try {
      setHours(Number(initHousMinutes?.split(":")[0]));
      setMinutes(Number(initHousMinutes?.split(":")[1]));
    } catch (e) {
      setHours(0);
      setMinutes(0);
    }
  }, [form, name]);

  useEffect(() => {
    if (!form) return;
    try {
      const formHours = hoursMinutes?.split(":")[0];
      const formMinutes = hoursMinutes?.split(":")[1];

      if (formHours && isNumeric(formHours) && Number(formHours) !== Number(hours)) {
        setHours(Number(formHours));
      }

      if (formMinutes && isNumeric(formMinutes) && Number(formMinutes) !== Number(minutes)) {
        setMinutes(Number(formMinutes));
      }
    } catch (e) {
      setHours(0);
      setMinutes(0);
    }
  }, [hoursMinutes, form, hours, minutes, name]);

  useEffect(() => {
    if (!form) return;
    if (hours == null || minutes == null) return;

    const formatedTime = String(hours).padStart(2, "0") + ":" + String(minutes).padStart(2, "0");
    const sec = form.getValues(name)?.split(":").length === 3 ? ":00" : "";

    if (formatedTime + sec !== form.getValues(name)) {
      form.setValue(name, formatedTime as any);
      if (onChange) {
        const syntheticEvent = createChangeEvent<HTMLInputElement>(name, formatedTime);
        onChange(syntheticEvent);
      }
    }
  }, [minutes, hours, form, name, onChange]);

  const handleMinutesChange = (e: any) => {
    setMinutes(Number(e.target.value));
  };
  const handleHoursChange = (e: any) => {
    setHours(Number(e.target.value));
  };

  return (
    <div className={`mb-2 ${res.className ?? ""}`}>
      {title && (
        <label htmlFor={name} className={`mb-2 block text-sm font-bold ${res.className ?? ""}`}>
          {title}
        </label>
      )}
      <div className="relative inline-flex">
        <input
          id={`${name}-hours`}
          name={`${name}-hours`}
          type="number"
          disabled={res.disabled}
          onChange={handleHoursChange}
          value={String(hours ?? 0).padStart(2, "0")}
          min="0"
          placeholder={placeholder}
          className={`h-9 peer block w-full ${res.disabled ? "" : "cursor-pointer"} rounded-md border ${
            ["time"].includes(String(type)) ? "py-0" : "py-2"
          } pl-10 text-sm outline-2 placeholder:text-gray-500 ${error ? "border-red-300" : "border-gray-200"} ${
            res.disabled ? "text-gray-400" : "text-black"
          } p-1`}
          ref={ref}
        />
        <div className="self-center p-2 text-2xl">:</div>
        <input
          id={`${name}-minutes`}
          name={`${name}-minutes`}
          type="number"
          disabled={res.disabled}
          onChange={handleMinutesChange}
          value={String(minutes ?? 0).padStart(2, "0")}
          placeholder={placeholder}
          min="0"
          className={`h-9 peer block w-full ${res.disabled ? "" : "cursor-pointer"} rounded-md border ${
            ["time"].includes(String(type)) ? "" : "py-2"
          } pl-10 text-sm outline-2 placeholder:text-gray-500 ${error ? "border-red-300" : "border-gray-200"} ${
            res.disabled ? "text-gray-400" : "text-black"
          } p-1`}
          ref={ref}
        />
      </div>
      {error && <p className="text-xs italic text-red-500 mt-2">{error as string}</p>}
    </div>
  );
}

const TimeInputField = React.forwardRef(TimeInput);
export default TimeInputField;
