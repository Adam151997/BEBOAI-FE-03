import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const response = (err as { response?: { data?: { message?: string } } }).response;
    return response?.data?.message || "An error occurred";
  }
  return "An error occurred";
}

/**
 * Normalizes an array of IDs to number[] for API submission.
 * 
 * IMPORTANT: The backend requires reference arrays (assigned_to, contacts, teams, tags)
 * to be arrays of integers. This function ensures proper type conversion regardless of
 * whether the input contains strings, numbers, or objects with an 'id' property.
 * 
 * @param ids - Array of IDs that may be strings, numbers, or objects with id property
 * @returns Array of numbers, filtering out any invalid/NaN values
 * 
 * @example
 * normalizeIdArray(["1", "2", "3"]) // => [1, 2, 3]
 * normalizeIdArray([1, 2, 3]) // => [1, 2, 3]
 * normalizeIdArray([{ id: "1" }, { id: 2 }]) // => [1, 2]
 * normalizeIdArray(undefined) // => []
 * normalizeIdArray(null) // => []
 */
export function normalizeIdArray(
  ids: (string | number | { id: string | number } | null | undefined)[] | null | undefined
): number[] {
  // Return empty array for null/undefined input
  if (!ids || !Array.isArray(ids)) {
    return [];
  }

  return ids
    .map((item) => {
      // Handle null/undefined items
      if (item == null) {
        return NaN;
      }
      // Handle objects with id property (e.g., User objects)
      if (typeof item === 'object' && 'id' in item) {
        const id = item.id;
        return typeof id === 'number' ? id : parseInt(String(id), 10);
      }
      // Handle string or number values directly
      return typeof item === 'number' ? item : parseInt(String(item), 10);
    })
    .filter((num): num is number => !isNaN(num));
}

/**
 * Normalizes a single ID value to a number for API submission.
 * 
 * IMPORTANT: The backend requires single ID references (like account, lead) to be
 * integers. This function ensures proper type conversion.
 * 
 * @param id - A single ID that may be a string, number, or null/undefined
 * @returns The ID as a number, or null if invalid
 * 
 * @example
 * normalizeId("123") // => 123
 * normalizeId(123) // => 123
 * normalizeId("") // => null
 * normalizeId(null) // => null
 */
export function normalizeId(
  id: string | number | null | undefined
): number | null {
  if (id == null || id === '') {
    return null;
  }
  const parsed = typeof id === 'number' ? id : parseInt(String(id), 10);
  return isNaN(parsed) ? null : parsed;
}
