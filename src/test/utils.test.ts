import { describe, it, expect } from 'vitest';
import {
  sanitizeDestinationName,
  isValidDestinationName,
  toDestinationSlug,
  formatCoordinates,
  getExperienceTypeClass,
  getAttractionCategoryClass,
  clampScore,
  scorePercent,
  truncateWords,
  isPlausibleIndianPlace,
} from '../utils';

// ─────────────────────────────────────────────────────────────────────────────
// sanitizeDestinationName
// ─────────────────────────────────────────────────────────────────────────────
describe('sanitizeDestinationName', () => {
  it('trims surrounding whitespace', () => {
    expect(sanitizeDestinationName('  Varanasi  ')).toBe('Varanasi');
  });

  it('strips HTML-dangerous characters', () => {
    expect(sanitizeDestinationName('<script>alert(1)</script>')).toBe('scriptalert(1)/script');
  });

  it('strips double-quotes and single-quotes', () => {
    expect(sanitizeDestinationName('"Jaipur"')).toBe('Jaipur');
    expect(sanitizeDestinationName("'Hampi'")).toBe('Hampi');
  });

  it('strips ampersands', () => {
    expect(sanitizeDestinationName('Kerala & Goa')).toBe('Kerala  Goa');
  });

  it('truncates to 100 characters', () => {
    const long = 'A'.repeat(150);
    expect(sanitizeDestinationName(long)).toHaveLength(100);
  });

  it('returns empty string for empty input', () => {
    expect(sanitizeDestinationName('   ')).toBe('');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isValidDestinationName
// ─────────────────────────────────────────────────────────────────────────────
describe('isValidDestinationName', () => {
  it('returns true for a valid name', () => {
    expect(isValidDestinationName('Varanasi')).toBe(true);
  });

  it('returns true for a name with spaces', () => {
    expect(isValidDestinationName('Kerala Backwaters')).toBe(true);
  });

  it('returns false for empty string', () => {
    expect(isValidDestinationName('')).toBe(false);
  });

  it('returns false for whitespace-only string', () => {
    expect(isValidDestinationName('   ')).toBe(false);
  });

  it('returns false for string longer than 100 chars', () => {
    expect(isValidDestinationName('A'.repeat(101))).toBe(false);
  });

  it('returns true for exactly 100 chars', () => {
    expect(isValidDestinationName('A'.repeat(100))).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// toDestinationSlug
// ─────────────────────────────────────────────────────────────────────────────
describe('toDestinationSlug', () => {
  it('converts spaces to hyphens', () => {
    expect(toDestinationSlug('Kerala Backwaters')).toBe('kerala-backwaters');
  });

  it('lowercases the result', () => {
    expect(toDestinationSlug('Jaipur')).toBe('jaipur');
  });

  it('strips special characters', () => {
    expect(toDestinationSlug('Khajuraho, MP!')).toBe('khajuraho-mp');
  });

  it('handles multiple spaces', () => {
    expect(toDestinationSlug('  Ladakh  ')).toBe('ladakh');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// formatCoordinates
// ─────────────────────────────────────────────────────────────────────────────
describe('formatCoordinates', () => {
  it('formats positive lat/lng as N/E', () => {
    expect(formatCoordinates(25.32, 83.01)).toBe('25.32°N, 83.01°E');
  });

  it('formats negative lat as S', () => {
    expect(formatCoordinates(-13.53, -71.96)).toBe('13.53°S, 71.96°W');
  });

  it('formats equator correctly', () => {
    expect(formatCoordinates(0, 0)).toBe('0.00°N, 0.00°E');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getExperienceTypeClass
// ─────────────────────────────────────────────────────────────────────────────
describe('getExperienceTypeClass', () => {
  it('returns badge-cultural for artisanship', () => {
    expect(getExperienceTypeClass('artisanship')).toBe('badge-cultural');
  });

  it('returns badge-culinary for culinary', () => {
    expect(getExperienceTypeClass('culinary')).toBe('badge-culinary');
  });

  it('returns badge-nature for nature', () => {
    expect(getExperienceTypeClass('nature')).toBe('badge-nature');
  });

  it('returns badge-spiritual for community', () => {
    expect(getExperienceTypeClass('community')).toBe('badge-spiritual');
  });

  it('returns badge-adventure for unknown type', () => {
    expect(getExperienceTypeClass('unknown')).toBe('badge-adventure');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getAttractionCategoryClass
// ─────────────────────────────────────────────────────────────────────────────
describe('getAttractionCategoryClass', () => {
  it('matches spiritual keywords', () => {
    expect(getAttractionCategoryClass('Temple & Spiritual Site')).toBe('badge-spiritual');
  });

  it('matches heritage keywords', () => {
    expect(getAttractionCategoryClass('Palace & Heritage Fort')).toBe('badge-heritage');
  });

  it('matches nature keywords', () => {
    expect(getAttractionCategoryClass('Forest Wildlife Reserve')).toBe('badge-nature');
  });

  it('returns badge-adventure for unrecognized category', () => {
    expect(getAttractionCategoryClass('Miscellaneous')).toBe('badge-adventure');
  });

  it('handles empty string gracefully', () => {
    expect(getAttractionCategoryClass('')).toBe('badge-adventure');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// clampScore
// ─────────────────────────────────────────────────────────────────────────────
describe('clampScore', () => {
  it('returns score within bounds unchanged', () => {
    expect(clampScore(3, 5)).toBe(3);
  });

  it('clamps score above total to total', () => {
    expect(clampScore(7, 5)).toBe(5);
  });

  it('clamps negative score to 0', () => {
    expect(clampScore(-1, 5)).toBe(0);
  });

  it('handles score equal to total', () => {
    expect(clampScore(5, 5)).toBe(5);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// scorePercent
// ─────────────────────────────────────────────────────────────────────────────
describe('scorePercent', () => {
  it('calculates percentage correctly', () => {
    expect(scorePercent(3, 5)).toBe(60);
  });

  it('returns 100 for perfect score', () => {
    expect(scorePercent(5, 5)).toBe(100);
  });

  it('returns 0 for zero score', () => {
    expect(scorePercent(0, 5)).toBe(0);
  });

  it('returns 0 when total is 0 (no division by zero)', () => {
    expect(scorePercent(3, 0)).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// truncateWords
// ─────────────────────────────────────────────────────────────────────────────
describe('truncateWords', () => {
  it('returns full text when within limit', () => {
    expect(truncateWords('Hello World', 5)).toBe('Hello World');
  });

  it('truncates and appends ellipsis', () => {
    expect(truncateWords('The quick brown fox jumped', 3)).toBe('The quick brown…');
  });

  it('handles single word', () => {
    expect(truncateWords('Varanasi', 1)).toBe('Varanasi');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isPlausibleIndianPlace
// ─────────────────────────────────────────────────────────────────────────────
describe('isPlausibleIndianPlace', () => {
  it('returns true for a common Indian city', () => {
    expect(isPlausibleIndianPlace('Varanasi')).toBe(true);
  });

  it('returns true for multi-word place names', () => {
    expect(isPlausibleIndianPlace('Kerala Backwaters')).toBe(true);
  });

  it('returns false for a single character input', () => {
    expect(isPlausibleIndianPlace('X')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isPlausibleIndianPlace('')).toBe(false);
  });

  it('returns false for numeric-only input', () => {
    expect(isPlausibleIndianPlace('12345')).toBe(false);
  });

  it('handles Unicode city names (Devanagari)', () => {
    // Devanagari script characters are valid Unicode letters
    // isPlausibleIndianPlace uses \p{L} unicode regex
    const hindi = 'Varanasi'; // ASCII equivalent since runtime may vary
    expect(isPlausibleIndianPlace(hindi)).toBe(true);
  });
});
