// utils/normalize.ts
export function normalize(str: string) {
  return (str || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^\w\s]/g, "") // remove punctuation
    .replace(/\s+/g, " ") // collapse spaces
    .trim();
}

// Capitalize first letter (lowercase the rest)
export function capitalizeFirst(str: string) {
  if (!str) return "";
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

// Format zip to 5 digits
export function formatZip(zip: string | number) {
  return String(zip).padStart(5, "0");
}
