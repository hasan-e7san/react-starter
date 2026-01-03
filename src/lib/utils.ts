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

/**
 * Format payloads for specific endpoints (multipart, boolean fixes, etc.).
 * This is the library-friendly replacement for the old formatAxiosData.
 */
export function formatPayloadForEndpoint(payload: any, endpoint: string) {
  switch (endpoint) {
    case '/users':
      return { ...payload, isActive: String(payload?.isActive) === '1' };
    case '/locations':
    case '/employees':
    case '/countries':
    case '/lessons':
    case '/testimonials':
    case '/employee-shifts':
      return buildMultipartFormData(payload);
    case '/employee-shifts/schedule-update':
      return buildEmployeeShiftFormData(payload);
    case '/roles':
      return buildRolePermissionsFormData(payload);
    default:
      return payload;
  }
}

// Backward compatible alias
export const formatAxiosData = formatPayloadForEndpoint;

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

export function removeHtmlTags(input?: string) {
  if (!input) return '';
  return input.replace(/<\/?[^>]+(>|$)/g, '');
}

export function toUTCDateString(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function toUTCDateTimeString(date: Date) {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  const hour = String(date.getUTCHours()).padStart(2, '0');
  const minute = String(date.getUTCMinutes()).padStart(2, '0');
  const second = String(date.getUTCSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
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

// Alias with a clearer name for multipart construction
export const buildMultipartFormData = appendFormData;

export function buildRolePermissionsFormData(data: any) {
  const formData = new FormData();
  formData.append("name", data?.name ?? '');
  for (const key in data) {
    if (data[key] === true) {
      formData.append("permissions[]", key);
    }
  }
  return formData;
}

export function buildEmployeeShiftFormData(data: any) {
  const formData = new FormData();
  for (const key in data) {
    if (key === 'employeeShifts' && typeof data['employeeShifts'] === "object") {
      for (const day in data['employeeShifts']) {
        if (data['employeeShifts'][day] !== false) {
          formData.append(`${key}[]`, JSON.stringify(data['employeeShifts'][day]));
        }
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

export function parseTimeToMilliseconds(timeStr?: string) {
  if (!timeStr) return 0;
  const [hours = '0', minutes = '0'] = timeStr.split(':');
  const h = parseInt(hours, 10) || 0;
  const m = parseInt(minutes, 10) || 0;
  return h * 60 * 60 * 1000 + m * 60 * 1000;
}

export function diffHoursFromTimestamps(endMs: number, startMs: number) {
  const diffMs = endMs >= startMs ? endMs - startMs : (24 * 60 * 60 * 1000 - startMs) + endMs;
  return (diffMs / (1000 * 60 * 60)).toFixed(2);
}

export function subtractTimeStrings(time1: string, time2: string) {
  const diffSeconds = Math.floor(parseTimeToMilliseconds(time1) / 1000) - Math.floor(parseTimeToMilliseconds(time2) / 1000);
  return formatSecondsToHms(diffSeconds);
}

export function sumTimeStrings(time1: string, time2: string) {
  const sumSeconds = Math.floor(parseTimeToMilliseconds(time1) / 1000) + Math.floor(parseTimeToMilliseconds(time2) / 1000);
  return formatSecondsToHms(sumSeconds);
}

export function formatSecondsToHms(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, '0');
  const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

export function getWeekRange(selectedDate: Date): { startDate: Date; endDate: Date } {
  const day = selectedDate.getDay();
  const diffToMonday = (day === 0 ? -6 : 1) - day;
  const diffToSunday = day === 0 ? 0 : (6 - day) + 1;

  const startDate = new Date(selectedDate);
  startDate.setDate(selectedDate.getDate() + diffToMonday);
  startDate.setHours(0, 0, 0, 0);

  const endDate = new Date(selectedDate);
  endDate.setDate(selectedDate.getDate() + diffToSunday);
  endDate.setHours(23, 59, 59, 999);

  return { startDate, endDate };
}

// Backward-compatible aliases
export const getUTCDate = toUTCDateString;
export const getUTCDateTime = toUTCDateTimeString;
export const TimeDiffHours = diffHoursFromTimestamps;
export const parseTime = parseTimeToMilliseconds;
export const formatTimeStr = formatSecondsToHms;
export const secondsToTime = formatSecondsToHms;
export const getWeekBounds = getWeekRange;
