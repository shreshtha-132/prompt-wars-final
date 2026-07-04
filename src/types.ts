export interface LocationCoordinates {
  lat: number;
  lng: number;
}

export interface Attraction {
  id: string;
  name: string;
  description: string;
  location: string;
  historicalSignificance: string;
  visitorTip: string;
  category: string;
}

export interface HiddenGem {
  id: string;
  name: string;
  description: string;
  culturalStory: string;
  howToExperience: string;
  localLegend?: string;
}

export interface LocalExperience {
  id: string;
  title: string;
  description: string;
  type: 'artisanship' | 'culinary' | 'performance' | 'nature' | 'community';
  howToConnect: string;
  culturalEtiquette: string;
}

export interface HeritageEvent {
  id: string;
  name: string;
  timeOfYear: string;
  significance: string;
  localTraditions: string[];
}

export interface TriviaQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface DestinationData {
  name: string;
  country: string;
  summary: string;
  localProverb: {
    text: string;
    translation: string;
    meaning: string;
  };
  coordinates: LocationCoordinates;
  attractions: Attraction[];
  hiddenGems: HiddenGem[];
  experiences: LocalExperience[];
  events: HeritageEvent[];
  trivia: TriviaQuestion[];
}

export interface TravelPreference {
  interest: 'history' | 'culinary' | 'arts' | 'adventure' | 'spiritual';
  pace: 'slow' | 'moderate' | 'fast';
  budget: 'budget' | 'moderate' | 'luxury';
}

export interface JournalEntry {
  id: string;
  destinationName: string;
  country: string;
  dateAdded: string;
  notes: string;
  savedAttractions: string[];
  savedGems: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}
