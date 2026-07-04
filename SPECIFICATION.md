# TECHNICAL SPECIFICATION: CULTURAL ATLAS

This document details the system design, file organization, API architecture, and responsive user interfaces of **Cultural Atlas**, a full-stack, GenAI-powered cultural discovery and immersive storyteller application.

---

## 1. System Architecture & File Tree

The application is structured as a full-stack React + Express utility utilizing Vite for local builds and esbuild for custom production bundling. All Gemini API calls are strictly handled server-side to prevent client-side credential exposure.

### 1.1 Complete File Tree
```
/
├── .env.example              # Example environment configuration
├── .gitignore                # Node and build ignore list
├── index.html                # Vite app shell
├── metadata.json             # AI Studio app capabilities and titles
├── package.json              # Script directives and npm dependencies
├── server.ts                 # Full-stack Node.js server with Vite and Express
├── tsconfig.json             # TypeScript rules configuration
├── vite.config.ts            # Vite asset router and aliases
├── src/
│   ├── main.tsx              # Application client-side entry point
│   ├── index.css             # Tailwind styling and typography imports
│   ├── App.tsx               # Main UI hub containing the dashboard
│   ├── types.ts              # Global type interfaces and schemas
│   └── components/
│       ├── CustomMap.tsx     # Simulated vector location visualizer
│       ├── PreferenceBar.tsx # Dynamic travel criteria selectors
│       ├── DiscoveryDeck.tsx # Curated highlights and hidden gems slider
│       ├── ExperienceLog.tsx # Hands-on artisan workshops & local etiquettes
│       ├── StoryNarrative.tsx# Sensory journal narrator with audio-synth feedback
│       ├── CulturalTrivia.tsx# Dynamic multi-choice local quiz module
│       └── CulturalAdvisor.tsx# Chat concierge for real-time cultural advice
```

---

## 2. GenAI Integration Blueprint

All artificial intelligence capabilities utilize the modern `@google/genai` TypeScript SDK on the server, leveraging the performant `gemini-3.5-flash` model.

### 2.1 API Endpoint Handlers (Defined in `server.ts`)

1. **`POST /api/destination`**
   - **Input**: `{ name: string, preferences: TravelPreference }`
   - **Gemini Task**: Generates a high-fidelity, structured JSON cultural atlas including location details, tailored attractions, custom local proverbs, highly specific hidden gems, regional events, local experiences, and custom etiquette guidelines.
   - **Model Used**: `gemini-3.5-flash` with a strict `responseSchema`.

2. **`POST /api/narrative`**
   - **Input**: `{ name: string, country: string, spotName: string, spotDescription: string }`
   - **Gemini Task**: Generates a deeply descriptive, sensory, warm traveler’s journal narrative of the specified location.
   - **Model Used**: `gemini-3.5-flash` text completion.

3. **`POST /api/chat`**
   - **Input**: `{ messages: ChatMessage[], destinationContext: DestinationData }`
   - **Gemini Task**: Resolves interactive questions, details custom rules, provides language survival tips, or designs custom walking loops with local wisdom.
   - **Model Used**: `gemini-3.5-flash` chat sessions.

---

## 3. Step-by-Step Implementation Strategy

### Step 3.1: Foundation & Types
- Ensure `src/types.ts` defines all types for attractions, local events, experiences, journals, trivia questions, and chat logs.

### Step 3.2: Full-Stack Server (`server.ts`)
- Implement Express routes, parse body contents, lazy-initialize Gemini client, protect secrets, and mount Vite middleware properly.

### Step 3.3: Interactive Visual Components (`src/components/`)
- **`CustomMap.tsx`**: SVG-based region selectors or coordinates tracker.
- **`PreferenceBar.tsx`**: Filters for Travel style (Adventurer, Culinary Nomad, Historian, Spiritual Seeker) and budget indicators.
- **`DiscoveryDeck.tsx`**: Renders custom attractions, highlights, and story loops.
- **`ExperienceLog.tsx`**: Highlights artisanship classes, native manners, and etiquette.
- **`StoryNarrative.tsx`**: Evocative, reading journals paired with synthetic sound waves.
- **`CulturalTrivia.tsx`**: Interactive quiz mechanics to engage visitors with folklore.
- **`CulturalAdvisor.tsx`**: Multi-turn chat assistant.

### Step 3.4: Main Hub integration (`src/App.tsx`)
- Coordinates asynchronous state fetchers, keeps persistent traveler logs, manages layout responsive columns, and styles via Tailwind slate palettes.
