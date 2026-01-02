import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';
import { ChangeEvent } from 'react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function convertToHourMinuteString(hours: number) {
  const wholeHours = Math.floor(hours);
  const fractionalPart = hours - wholeHours;
  const minutes = Math.round(fractionalPart * 60);

  return `${wholeHours}:${minutes < 10 ? '0' + minutes : minutes}`;
}

export function formatErrorToList(str: string[] | string) {
  if (typeof str === "string") {
    return (
      '<ul>' +
      '<li style="list-style: circle">' + str + '</li>' +
      '</ul>'
    )
  } else {
    return (
      '<ul>' +
      str.map(s => '<li style="list-style: circle">' + s + '</li>').join('') +
      '</ul>'
    )
  }
}

export function formatDate(date: Date | string, formatStr: string = 'yyyy-MM-dd'): string {
  // Basic date formatting - you can enhance this or use date-fns
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return formatStr
    .replace('yyyy', String(year))
    .replace('MM', month)
    .replace('dd', day);
}

/**
 * Format date using date-fns format
 * Note: This is named 'dateFromat' to match the original typo in the codebase
 * 
 * @param date - Date string or Date object
 * @returns Formatted date string or empty string if date is null/empty
 * 
 * @example
 * ```tsx
 * dateFromat(new Date()) // "Jan 01, 2026 12:30"
 * dateFromat("2026-01-01") // "Jan 01, 2026 00:00"
 * ```
 */
export const dateFromat = (date: string | Date): string => {
  if (date === "" || date == null) {
    return "";
  }
  return format(date, "LLL dd, y HH:mm");
}

/**
 * Create a synthetic change event for form inputs
 * Useful for programmatic form updates when working with custom components
 * 
 * @param name - Input name attribute
 * @param value - Input value
 * @returns Synthetic React ChangeEvent
 * 
 * @example
 * ```tsx
 * const handleSelect = (selectedValue: string) => {
 *   const syntheticEvent = createChangeEvent<HTMLSelectElement>('category', selectedValue);
 *   onChange(syntheticEvent);
 * };
 * ```
 */
export const createChangeEvent = <T extends HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
  name: string,
  value: string
): ChangeEvent<T> => {
  return {
    target: { name, value } as T,
    currentTarget: { name, value } as T,
    bubbles: true,
    cancelable: true,
    defaultPrevented: false,
    eventPhase: 0,
    isTrusted: true,
    nativeEvent: {} as Event,
    preventDefault: () => {},
    stopPropagation: () => {},
    isPropagationStopped: () => false,
    isDefaultPrevented: () => false,
    timeStamp: Date.now(),
    type: 'change',
    persist: () => {},
  } as ChangeEvent<T>;
};

export function appendFormData(data: Record<string, any>): FormData {
  const formData = new FormData();
  
  for (const key in data) {
    if (['file', 'image', 'photo', 'classImage', 'certificate'].includes(key)) {
      if (data[key] && typeof data[key] === "object") {
        formData.append(key, data[key]);
      }
    } else {
      formData.append(key, data[key]);
    }
  }
  
  return formData;
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
