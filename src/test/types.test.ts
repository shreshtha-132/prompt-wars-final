import { describe, it, expect } from 'vitest';
import type {
  Attraction,
  HiddenGem,
  LocalExperience,
  HeritageEvent,
  TriviaQuestion,
  DestinationData,
  TravelPreference,
  ChatMessage,
  LocationCoordinates,
} from '../types';

/**
 * Type-shape validation tests.
 * These ensure that our domain types are structurally correct and
 * that TypeScript-inferred shape guards work at runtime.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Fixture factory helpers
// ─────────────────────────────────────────────────────────────────────────────

function makeAttraction(overrides: Partial<Attraction> = {}): Attraction {
  return {
    id: 'attr-1',
    name: 'Dashashwamedh Ghat',
    description: 'The main ghat of Varanasi where the Ganga Aarti is performed.',
    location: 'Varanasi, Uttar Pradesh',
    historicalSignificance: 'One of the oldest ghats, mentioned in ancient texts.',
    visitorTip: 'Arrive before 6 AM for the best Aarti experience.',
    category: 'Spiritual',
    ...overrides,
  };
}

function makeHiddenGem(overrides: Partial<HiddenGem> = {}): HiddenGem {
  return {
    id: 'gem-1',
    name: 'Lalita Ghat',
    description: 'A lesser-known ghat with a beautiful Nepali temple.',
    culturalStory: 'Built by the King of Nepal in the 19th century.',
    howToExperience: 'Walk along the ghats early morning from Dashashwamedh.',
    localLegend: 'Said to be blessed by Lord Pashupatinath.',
    ...overrides,
  };
}

function makeExperience(overrides: Partial<LocalExperience> = {}): LocalExperience {
  return {
    id: 'exp-1',
    title: 'Banarasi Silk Weaving Workshop',
    description: 'Learn the intricate Banarasi brocade weaving technique.',
    type: 'artisanship',
    howToConnect: 'Visit the weavers colony in Madanpura.',
    culturalEtiquette: 'Ask permission before photographing the looms.',
    ...overrides,
  };
}

function makeEvent(overrides: Partial<HeritageEvent> = {}): HeritageEvent {
  return {
    id: 'evt-1',
    name: 'Ganga Mahotsav',
    timeOfYear: 'November (Kartik Purnima)',
    significance: 'Five-day festival celebrating the river Ganga.',
    localTraditions: ['Dev Deepawali lamps', 'Classical music performances', 'Boat processions'],
    ...overrides,
  };
}

function makeTrivia(overrides: Partial<TriviaQuestion> = {}): TriviaQuestion {
  return {
    question: 'What is the significance of the clockwise circumambulation of a temple?',
    options: ['It is a form of aerobic exercise', 'It symbolises the movement of the cosmos', 'It is done for good luck only', 'It has no special meaning'],
    correctIndex: 1,
    explanation: 'Pradakshina (circumambulation) mimics the movement of planets around the sun, symbolising cosmic order.',
    ...overrides,
  };
}

function makeDestination(overrides: Partial<DestinationData> = {}): DestinationData {
  return {
    name: 'Varanasi',
    country: 'India',
    summary: 'One of the oldest continuously inhabited cities in the world.',
    localProverb: {
      text: 'काशी में मरण मुक्ति',
      translation: 'Death in Kashi is liberation',
      meaning: 'Dying in Varanasi grants moksha, breaking the cycle of rebirth.',
    },
    coordinates: { lat: 25.3176, lng: 82.9739 },
    attractions: [makeAttraction()],
    hiddenGems: [makeHiddenGem()],
    experiences: [makeExperience()],
    events: [makeEvent()],
    trivia: [makeTrivia()],
    ...overrides,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LocationCoordinates
// ─────────────────────────────────────────────────────────────────────────────
describe('LocationCoordinates type', () => {
  it('has numeric lat and lng fields', () => {
    const coords: LocationCoordinates = { lat: 25.32, lng: 82.97 };
    expect(typeof coords.lat).toBe('number');
    expect(typeof coords.lng).toBe('number');
  });

  it('accepts negative coordinates (southern/western hemisphere)', () => {
    const coords: LocationCoordinates = { lat: -13.53, lng: -71.97 };
    expect(coords.lat).toBeLessThan(0);
    expect(coords.lng).toBeLessThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Attraction
// ─────────────────────────────────────────────────────────────────────────────
describe('Attraction shape', () => {
  it('has all required fields', () => {
    const attr = makeAttraction();
    expect(attr).toHaveProperty('id');
    expect(attr).toHaveProperty('name');
    expect(attr).toHaveProperty('description');
    expect(attr).toHaveProperty('location');
    expect(attr).toHaveProperty('historicalSignificance');
    expect(attr).toHaveProperty('visitorTip');
    expect(attr).toHaveProperty('category');
  });

  it('all fields are non-empty strings', () => {
    const attr = makeAttraction();
    (['id', 'name', 'description', 'location', 'historicalSignificance', 'visitorTip', 'category'] as const)
      .forEach((field) => {
        expect(typeof attr[field]).toBe('string');
        expect(attr[field].length).toBeGreaterThan(0);
      });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// HiddenGem
// ─────────────────────────────────────────────────────────────────────────────
describe('HiddenGem shape', () => {
  it('has required fields', () => {
    const gem = makeHiddenGem();
    expect(gem).toHaveProperty('id');
    expect(gem).toHaveProperty('name');
    expect(gem).toHaveProperty('description');
    expect(gem).toHaveProperty('culturalStory');
    expect(gem).toHaveProperty('howToExperience');
  });

  it('localLegend is optional', () => {
    const gem = makeHiddenGem({ localLegend: undefined });
    expect(gem.localLegend).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// LocalExperience
// ─────────────────────────────────────────────────────────────────────────────
describe('LocalExperience shape', () => {
  it('type is one of the valid enum values', () => {
    const validTypes = ['artisanship', 'culinary', 'performance', 'nature', 'community'];
    const exp = makeExperience();
    expect(validTypes).toContain(exp.type);
  });

  it('has howToConnect and culturalEtiquette fields', () => {
    const exp = makeExperience();
    expect(exp.howToConnect.length).toBeGreaterThan(0);
    expect(exp.culturalEtiquette.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// HeritageEvent
// ─────────────────────────────────────────────────────────────────────────────
describe('HeritageEvent shape', () => {
  it('localTraditions is an array', () => {
    const evt = makeEvent();
    expect(Array.isArray(evt.localTraditions)).toBe(true);
  });

  it('localTraditions can be empty', () => {
    const evt = makeEvent({ localTraditions: [] });
    expect(evt.localTraditions).toHaveLength(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TriviaQuestion
// ─────────────────────────────────────────────────────────────────────────────
describe('TriviaQuestion shape', () => {
  it('correctIndex is within options bounds', () => {
    const q = makeTrivia();
    expect(q.correctIndex).toBeGreaterThanOrEqual(0);
    expect(q.correctIndex).toBeLessThan(q.options.length);
  });

  it('has at least 2 options', () => {
    const q = makeTrivia();
    expect(q.options.length).toBeGreaterThanOrEqual(2);
  });

  it('explanation is non-empty', () => {
    const q = makeTrivia();
    expect(q.explanation.length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// DestinationData (composite)
// ─────────────────────────────────────────────────────────────────────────────
describe('DestinationData shape', () => {
  it('has name, country, and summary', () => {
    const d = makeDestination();
    expect(d.name).toBeTruthy();
    expect(d.country).toBeTruthy();
    expect(d.summary).toBeTruthy();
  });

  it('localProverb has text, translation, and meaning', () => {
    const d = makeDestination();
    expect(d.localProverb.text).toBeTruthy();
    expect(d.localProverb.translation).toBeTruthy();
    expect(d.localProverb.meaning).toBeTruthy();
  });

  it('arrays are all arrays', () => {
    const d = makeDestination();
    expect(Array.isArray(d.attractions)).toBe(true);
    expect(Array.isArray(d.hiddenGems)).toBe(true);
    expect(Array.isArray(d.experiences)).toBe(true);
    expect(Array.isArray(d.events)).toBe(true);
    expect(Array.isArray(d.trivia)).toBe(true);
  });

  it('coordinates are valid numbers', () => {
    const d = makeDestination();
    expect(typeof d.coordinates.lat).toBe('number');
    expect(typeof d.coordinates.lng).toBe('number');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// TravelPreference
// ─────────────────────────────────────────────────────────────────────────────
describe('TravelPreference shape', () => {
  it('interest is one of the valid values', () => {
    const valid = ['history', 'culinary', 'arts', 'adventure', 'spiritual'];
    const prefs: TravelPreference = { interest: 'history', pace: 'moderate', budget: 'moderate' };
    expect(valid).toContain(prefs.interest);
  });

  it('pace is one of slow, moderate, fast', () => {
    const valid = ['slow', 'moderate', 'fast'];
    const prefs: TravelPreference = { interest: 'culinary', pace: 'slow', budget: 'budget' };
    expect(valid).toContain(prefs.pace);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ChatMessage
// ─────────────────────────────────────────────────────────────────────────────
describe('ChatMessage shape', () => {
  it('role is either user or model', () => {
    const userMsg: ChatMessage = { id: '1', role: 'user', text: 'Hello', timestamp: '10:00' };
    const modelMsg: ChatMessage = { id: '2', role: 'model', text: 'Namaste!', timestamp: '10:01' };
    expect(['user', 'model']).toContain(userMsg.role);
    expect(['user', 'model']).toContain(modelMsg.role);
  });

  it('has id, text, and timestamp fields', () => {
    const msg: ChatMessage = { id: 'abc', role: 'user', text: 'Test', timestamp: '12:00' };
    expect(msg.id).toBe('abc');
    expect(msg.text).toBe('Test');
    expect(msg.timestamp).toBe('12:00');
  });
});
