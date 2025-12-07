import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Simple Linear Congruential Generator for stable random numbers.
 * Creates a seeded random function that returns values between 0 and 1.
 */
export const createSeededRandom = (seed: number) => {
  const m = 2147483648;
  const a = 1103515245;
  const c = 12345;
  let state = seed;

  return () => {
    state = (a * state + c) % m;
    return state / m;
  };
};

/**
 * Converts a string to a numeric seed using a hash function.
 */
export const stringToSeed = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return Math.abs(hash);
};

