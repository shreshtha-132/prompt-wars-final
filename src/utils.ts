/**
 * @module utils
 * Shared utility functions for Bharat Darshan.
 * Pure functions only — no side effects, fully testable.
 */

/** Sanitize a user-supplied destination name before sending to the API */
export function sanitizeDestinationName(input: string): string {
  return input.trim().replace(/[<>"'&]/g, '').slice(0, 100);
}

/** Validate that a destination name is non-empty and within acceptable length */
export function isValidDestinationName(name: string): boolean {
  const trimmed = name.trim();
  return trimmed.length > 0 && trimmed.length <= 100;
}

/** Derive a URL-safe slug from a destination name */
export function toDestinationSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/** Format coordinates to a human-readable string */
export function formatCoordinates(lat: number, lng: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(2)}°${latDir}, ${Math.abs(lng).toFixed(2)}°${lngDir}`;
}

/** Return the Tailwind badge class for a given experience type */
export function getExperienceTypeClass(
  type: 'artisanship' | 'culinary' | 'performance' | 'nature' | 'community' | string
): string {
  const map: Record<string, string> = {
    artisanship: 'badge-cultural',
    culinary: 'badge-culinary',
    performance: 'badge-cultural',
    nature: 'badge-nature',
    community: 'badge-spiritual',
  };
  return map[type] ?? 'badge-adventure';
}

/** Return the CSS class for attraction category badges */
export function getAttractionCategoryClass(category: string): string {
  const c = category?.toLowerCase() ?? '';
  if (c.includes('spiritual') || c.includes('temple') || c.includes('religious')) return 'badge-spiritual';
  if (c.includes('culinary') || c.includes('food')) return 'badge-culinary';
  if (c.includes('nature') || c.includes('forest') || c.includes('wildlife')) return 'badge-nature';
  if (c.includes('art') || c.includes('music') || c.includes('dance')) return 'badge-cultural';
  if (c.includes('heritage') || c.includes('palace') || c.includes('fort')) return 'badge-heritage';
  return 'badge-adventure';
}

/** Clamp a score between 0 and total */
export function clampScore(score: number, total: number): number {
  return Math.max(0, Math.min(score, total));
}

/** Calculate score percentage, guarding against division by zero */
export function scorePercent(score: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((clampScore(score, total) / total) * 100);
}

/** Truncate text to a max word count, appending ellipsis */
export function truncateWords(text: string, maxWords: number): string {
  const words = text.trim().split(/\s+/);
  if (words.length <= maxWords) return text;
  return words.slice(0, maxWords).join(' ') + '…';
}

/** Check if a string is a plausible Indian place name (not empty, only text + spaces) */
export function isPlausibleIndianPlace(name: string): boolean {
  const trimmed = name.trim();
  return /^[\p{L}\s,.-]+$/u.test(trimmed) && trimmed.length >= 2 && trimmed.length <= 100;
}
