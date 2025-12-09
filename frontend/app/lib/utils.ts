// src/lib/utils.ts (or wherever you want to place it)

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges Tailwind CSS classes and custom classes while automatically
 * resolving conflicts (e.g., 'p-4' and 'p-6' will resolve to 'p-6').
 *
 * @param inputs - A variable list of class names (strings, objects, or arrays).
 * @returns A single merged and optimized class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}