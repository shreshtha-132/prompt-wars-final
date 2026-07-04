# 🗺️ Cultural Atlas: GenAI-Powered Heritage Companion & Immersive Storyteller

Welcome to the **Cultural Atlas** codebase. This document outlines the comprehensive system architecture, technical context, design principles, and instructions for any agent (including **Antigravity**) inheriting this project to start working smoothly.

---

## 1. Project Vision & Mission

**Cultural Atlas** is a highly polished, full-stack cultural discovery and storyteller application. Instead of generic lists of tourist attractions, it acts as an immersive cultural bridge, allowing travelers to:
- Deeply understand **indigenous proverbs**, folklore, and regional philosophies.
- Uncover **off-the-beaten-path hidden gems** rich with oral history and legends.
- Connect respectfully via local **social etiquette rules**, customs, and seasonal heritage festivals.
- Listen to evocative, sensory **spoken journals** narrated directly in-browser.
- Test their understanding using an interactive, explanation-backed **Cultural Trivia & Etiquette Quiz**.
- Inquire about hyper-local customs using an interactive **Multi-Turn Concierge Chat Scribe**.

---

## 2. System Architecture & Tech Stack

This is a **full-stack React 19 (Vite) + Express (Node.js)** application that is compiled and served from a single container environment. 

### Key Technical Aspects:
- **Zero Mock Data**: All cultural information, legends, trivia, and chat answers are dynamically generated in real-time by the **Gemini 3.5 Flash** model.
- **Server-Side Security**: All calls to the `@google/genai` SDK are securely routed through server-side endpoints in `server.ts` to fully isolate and hide the `GEMINI_API_KEY` from client browsers.
- **Type-Safe Structured Output**: The primary destination generator utilizes Gemini's `responseSchema` capabilities, forcing the model to respond in strict, predictable JSON that matches the TypeScript types in `src/types.ts`.
- **Fast Production Bundling**: The dev server uses `tsx` to run the TypeScript Express backend directly, while the build process compiles the server-side code into a single, self-contained CommonJS bundle (`dist/server.cjs`) with `esbuild` for rapid startup.

---

## 3. UI, Aesthetic & Styling Guidelines

The visual style of Cultural Atlas has been carefully crafted to convey a premium, clean, editorial experience:
- **Light-Mode Editorial Theme**: The visual layout has been transitioned away from typical dark, gamer-like/cyberpunk glow themes to a pristine, light-mode design.
- **Color Palette**: Off-white and soft neutral canvases (`bg-slate-50`, `bg-white`) bordered by razor-thin dividers (`border-slate-200`), with an elegant, professional **Royal/Indigo Blue accent line** (`text-blue-600`, `bg-blue-50`, `border-blue-200`) and soft rose for highlights and bookmarks.
- **Typography Pairings**: Optimized for legibility and structure:
  - **Primary Body**: Clean, proportional sans-serif (`Inter`) for body copy, buttons, and form labels.
  - **Display / Headings**: Space-efficient display sans-serif (`Space Grotesk`) for layout headers and titles.
  - **Indicators**: High-contrast, tech-adjacent monospace font (`JetBrains Mono`) for coordinate data, timestamps, tags, and status displays.
- **Layout Rhythm**: Clear separation of sections with generous negative space, minimal border shadows, and smooth motion transitions.

---

## 4. File-by-File Code Structure

Below is the directory map of the codebase and the exact logical role of each file:

```
/
├── package.json              # Project script workflows & packages
├── server.ts                 # Express Backend: API endpoints & Gemini proxy router
├── vite.config.ts            # Vite asset compilation & server port configurations
├── tsconfig.json             # TypeScript rules and compiler guidelines
├── .env.example              # Template for required environment variables
├── SPECIFICATION.md          # Full architectural engineering outline
├── index.html                # App entry html shell with Google Font imports
└── src/
    ├── main.tsx              # Front-end React compiler hook
    ├── index.css             # Core Tailwind `@import` styles and typography themes
    ├── App.tsx               # Main Dashboard: Layout coordination, state & persistence
    ├── types.ts              # Single Source of Truth for schemas, types, and interfaces
    └── components/
        ├── PreferenceBar.tsx # Dynamic Travel Lens: filters for Focus Theme, Rhythm & Budget
        ├── CustomMap.tsx     # Vector visualizer: centers coordinates & highlights region pins
        ├── DiscoveryDeck.tsx # Highlights list: Curated Attractions & Hidden Gems with lore
        ├── ExperienceLog.tsx # Community log: hands-on artisans workshops & local etique-rules
        ├── StoryNarrative.tsx# Story narrator: sensory journal compiler, audio-synth soundwave & Text-To-Speech (SpeechSynthesis)
        ├── CulturalTrivia.tsx# Etiquette quiz: interactive questions with comprehensive explanations
        └── CulturalAdvisor.tsx# Interactive Concierge: multi-turn advice chatbot with preset prompts
```

### Component Details:
1. **`server.ts`**: Implements 3 REST endpoints proxying `gemini-3.5-flash`:
   - `POST /api/destination`: Generates a fully populated, structured `DestinationData` JSON object matching `src/types.ts`.
   - `POST /api/narrative`: Compiles a deeply immersive, sensory storyteller journal of the selected landmark.
   - `POST /api/chat`: Runs an ongoing multi-turn conversation thread.
2. **`src/types.ts`**: Controls the exact parameters for all elements: `Attraction`, `HiddenGem`, `LocalExperience`, `HeritageEvent`, `LocalProverb`, `TriviaQuestion`, and `ChatMessage`.
3. **`src/App.tsx`**: Owns main state handling (persistent diary bookmarks and customized packing/travel thoughts via `localStorage`), coordinating loading visualizers, error alerts, and column distribution.
4. **`src/components/StoryNarrative.tsx`**: Uses the browser's built-in `window.speechSynthesis` API to narrate the custom-generated sensory chronicles. It includes interactive toggle play/mute states, synchronized glowing soundwave bar animations, and on-the-fly regeneration.

---

## 5. Getting Started & Development Workflows

To run and iterate on this codebase, use the following operational commands:

### 1. Environment Configuration
Create a local `.env` file at the project root with your Gemini credentials:
```env
GEMINI_API_KEY="your-api-key-here"
```

### 2. Dependency Management
Install all pre-configured client and server packages:
```bash
npm install
```

### 3. Start Development Server
Launches the full-stack server on `http://localhost:3000` (combining Express and Vite middleware mode):
```bash
npm run dev
```

### 4. Build for Production
Bundles the frontend using Vite and bundles the server-side TypeScript into a unified CommonJS file at `dist/server.cjs` via esbuild:
```bash
npm run build
```

### 5. Start Production Server
Bootstraps the compiled container server:
```bash
npm start
```

### 6. Lint Verification
Runs static type checking without code outputting:
```bash
npm run lint
```

---

## 6. Guidance for Next Developer (Antigravity Context)

If you are continuing development on this workspace, please respect the established design principles and system configurations:
- **Editorial Cleanliness First**: Avoid introducing overly crowded visual grids, dark-mode toggle overlays, or system console log components inside outer page margins. Keep backgrounds minimal and content cards highly legible.
- **Keep Logic Modular**: Do not bloat `App.tsx` with detailed sub-view rendering logic. Maintain clean isolation by keeping map indicators, trivia states, and advice prompts in their dedicated components under `src/components/`.
- **Consistent Typings**: All schema additions or model properties must be synchronized in both `src/types.ts` and the `responseSchema` defined inside `server.ts` to prevent runtime hydration discrepancies.
- **Port Compliance**: The reverse proxy routes ingress traffic exclusively to **Port 3000**. Never override server ports, bind host setups, or HMR sockets.

Happy coding! 🗺️✨
