# Bharat Darshan — Hackathon Evaluation Guide

This guide ensures that any future changes to the codebase maintain or improve our AI evaluation scores across the six hackathon categories. 

## Current Score Trajectory

*   **Problem Statement Alignment (98):** Excellent. The app heavily uses Generative AI (Gemini) to create dynamic, India-specific cultural profiles instead of mock data. **Do not hardcode content.**
*   **Security (100):** Perfect. The Gemini API key is safely stored in `.env` and accessed securely via the Express backend proxy (`server.ts`). The React frontend never exposes the key.
*   **Code Quality (86 ↗ 90+):** Improved. Added `utils.ts` to separate pure logic from React components. All files are properly typed with TypeScript interfaces in `types.ts`.
*   **Efficiency (80 ↗ 85+):** Good. We removed unused components (`CustomMap`, `PreferenceBar`) and Vite handles chunking. 
*   **Accessibility (45 ↗ 80+):** Addressed. 
    *   Added `aria-label` to all buttons and interactive elements.
    *   Added semantic landmarks (`role="main"`, `role="navigation"`, `role="tablist"`).
    *   Added `role="status"` and `role="alert"` for loading and error states.
    *   Added `:focus-visible` outlines and a "Skip to content" link.
*   **Testing (0 ↗ 60+):** Addressed.
    *   Installed Vitest and Testing Library.
    *   Wrote 67 passing unit tests in `src/test/utils.test.ts` and `src/test/types.test.ts`.

---

## The Golden Rules for Future Edits

To protect these scores, strictly adhere to the following when making changes:

### 1. Code Quality (High Impact)
*   **Use TypeScript:** Always define interfaces in `src/types.ts` for new data structures. Do not use `any`.
*   **Keep it Modular:** Do not put massive logic in `App.tsx`. Use separate components.
*   **Extract Logic:** Put pure functions in `src/utils.ts` so they can be unit-tested without rendering React.

### 2. Testing (Low Impact, but easy points)
*   If you add a new utility function to `utils.ts`, **you must add a corresponding test** in `src/test/utils.test.ts`.
*   If you add a new data type to `types.ts`, **you must add shape validation** in `src/test/types.test.ts`.
*   Run `npm run test` before committing any changes.

### 3. Accessibility (Low Impact, but easy points)
*   **Buttons & Inputs:** Every `<button>` and `<input>` must have an `aria-label` or descriptive inner text.
*   **Dynamic Changes:** Use `aria-live="polite"` or `role="status"` on loading indicators so screen readers announce them.
*   **Focus:** Do not remove the `*:focus-visible` outline from `index.css`. Keyboard users rely on it.

### 4. Problem Statement (High Impact)
*   The prompt requires **Zero Mock Data**.
*   All cultural stories, proverbs, and hidden gems must flow through `server.ts` using the `@google/genai` SDK. 
*   Never hardcode JSON files containing destinations in the `src/` directory.

### 5. Security (Medium Impact)
*   **Never** import `@google/genai` inside a `.tsx` file. All AI generation must happen in `server.ts`.
*   Do not commit `.env` to GitHub.

## Commands to Run Before Submission

```bash
# 1. Check for TypeScript errors
npm run lint

# 2. Run all tests
npm run test

# 3. Test production build
npm run build
```
