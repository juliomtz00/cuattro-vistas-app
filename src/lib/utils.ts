import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Merge Tailwind classes and handle conditional classes
export function cn(...inputs: unknown[]) {
  return twMerge(clsx(inputs));
}

// Capitalize text utility
export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
