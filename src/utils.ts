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

export const INDIAN_CULTURAL_FACTS = [
  "India has 22 officially recognized languages, but over 19,500 languages or dialects are spoken as mother tongues.",
  "The Kumbh Mela, a major Hindu pilgrimage, is visible from space due to the massive gathering of millions of people.",
  "Varanasi is believed to be one of the oldest continuously inhabited cities in the world, dating back over 3,000 years.",
  "Ayurveda, originating in India over 5,000 years ago, is considered the oldest medical system in the world.",
  "India is the birthplace of chess, originally known as 'Chaturanga' in the 6th century.",
  "Mawsynram, a village in Meghalaya, holds the Guinness World Record for the highest average annual rainfall.",
  "The Golden Temple in Amritsar feeds over 100,000 people a day for free through its community kitchen (Langar).",
  "India has the highest number of post offices in the world, including a floating post office on Dal Lake, Srinagar.",
  "The Bandra-Worli Sea Link in Mumbai has steel wires equal to the earth's circumference.",
  "Shani Shingnapur is a village in Maharashtra where houses have no doors, due to deep faith in Lord Shani.",
  "India is home to the world's highest rail bridge, the Chenab Bridge in Jammu and Kashmir, which is taller than the Eiffel Tower.",
  "Yoga originated in India over 5,000 years ago and is deeply rooted in physical, mental, and spiritual practices.",
  "Sushruta, an ancient Indian physician, is widely regarded as the 'Father of Surgery' for his work in 600 BCE.",
  "The Indian state of Sikkim became the first fully organic state in the world in 2016."
];
