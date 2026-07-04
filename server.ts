import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialize Gemini SDK client to prevent startup crash if key is missing
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required. Please set it in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// 1. Destination Discovery & Generation Route
app.post("/api/destination", async (req, res) => {
  try {
    const { name, preferences } = req.body;
    if (!name) {
       res.status(400).json({ error: "Destination name is required" });
       return;
    }

    const ai = getGeminiClient();

    // Construct a comprehensive prompt based on user interest
    const prompt = `You are a world-renowned cultural anthropologist, historian, and expert local curator.
Generate an immersive cultural travel profile for the destination: "${name}".
Ensure all recommendations are highly authentic, grounded in genuine local customs, history, and real geographical locations (no fake or hallucinated spots).
Tailor the highlights and recommended attractions based on these traveler preferences:
- Focus/Interest: ${preferences?.interest || 'history'}
- Travel Pace: ${preferences?.pace || 'moderate'}
- Travel Budget: ${preferences?.budget || 'moderate'}

Create detailed content covering:
1. Dynamic local proverb or saying that encapsulates the local philosophy, with translation and deep meaning.
2. Recommended attractions specifically curated for their interest.
3. Hidden gems that are off the beaten path, complete with high-fidelity historical storytelling, local legends, and instructions on how to experience them respectably.
4. Local experiences like culinary encounters, artisanship, and community traditions, highlighting local etiquette.
5. Heritage events and festivals, their deep seasonal timing, and cultural significance.
6. A 3-question interactive cultural trivia quiz to help travelers learn local norms, folklore, and etiquette prior to arrival. Include rich explanations for correct answers.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "name",
            "country",
            "summary",
            "localProverb",
            "coordinates",
            "attractions",
            "hiddenGems",
            "experiences",
            "events",
            "trivia"
          ],
          properties: {
            name: {
              type: Type.STRING,
              description: "The name of the city or region, e.g., Kyoto, Oaxaca, Luxor."
            },
            country: {
              type: Type.STRING,
              description: "The name of the country."
            },
            summary: {
              type: Type.STRING,
              description: "A rich, evocative cultural introduction that outlines the destination's unique spiritual, architectural, or modern pulse."
            },
            localProverb: {
              type: Type.OBJECT,
              required: ["text", "translation", "meaning"],
              properties: {
                text: { type: Type.STRING, description: "The saying in native script or transliteration." },
                translation: { type: Type.STRING, description: "Literal English translation." },
                meaning: { type: Type.STRING, description: "The deep philosophical or cultural lesson." }
              }
            },
            coordinates: {
              type: Type.OBJECT,
              required: ["lat", "lng"],
              properties: {
                lat: { type: Type.NUMBER, description: "Approximate latitude coordinate." },
                lng: { type: Type.NUMBER, description: "Approximate longitude coordinate." }
              }
            },
            attractions: {
              type: Type.ARRAY,
              description: "Attractions tailored specifically to the user's travel preferences.",
              items: {
                type: Type.OBJECT,
                required: ["id", "name", "description", "location", "historicalSignificance", "visitorTip", "category"],
                properties: {
                  id: { type: Type.STRING, description: "Unique snake_case identifier." },
                  name: { type: Type.STRING, description: "Name of the attraction." },
                  description: { type: Type.STRING, description: "A detailed summary of its current appeal." },
                  location: { type: Type.STRING, description: "Specific district or area." },
                  historicalSignificance: { type: Type.STRING, description: "Deep historical context or architectural triumph." },
                  visitorTip: { type: Type.STRING, description: "Respectful guidelines or timing tips for visitors." },
                  category: { type: Type.STRING, description: "E.g., Heritage, Culinary, spiritual, Nature, Art" }
                }
              }
            },
            hiddenGems: {
              type: Type.ARRAY,
              description: "Rare, lesser-known, off-the-beaten-path cultural treasures.",
              items: {
                type: Type.OBJECT,
                required: ["id", "name", "description", "culturalStory", "howToExperience"],
                properties: {
                  id: { type: Type.STRING, description: "Unique snake_case identifier." },
                  name: { type: Type.STRING, description: "Name of the hidden gem." },
                  description: { type: Type.STRING, description: "What makes it magical and quiet." },
                  culturalStory: { type: Type.STRING, description: "Deep, narrative-driven folklore, legend, or historic significance that gives this location high cultural value." },
                  howToExperience: { type: Type.STRING, description: "Etiquette, instructions, or steps to visit in a respectful, low-impact manner." },
                  localLegend: { type: Type.STRING, description: "Optional local folklore or ghost story associated with the spot." }
                }
              }
            },
            experiences: {
              type: Type.ARRAY,
              description: "Genuine local cultural connections (workshops, direct learning).",
              items: {
                type: Type.OBJECT,
                required: ["id", "title", "description", "type", "howToConnect", "culturalEtiquette"],
                properties: {
                  id: { type: Type.STRING, description: "Unique identifier." },
                  title: { type: Type.STRING, description: "E.g., Traditional Wagashi Cookery, Berber Carpet Weaving." },
                  description: { type: Type.STRING, description: "Evocative summary of the experience." },
                  type: { type: Type.STRING, enum: ["artisanship", "culinary", "performance", "nature", "community"] },
                  howToConnect: { type: Type.STRING, description: "Where or how to search for or find independent locals doing this (no tourist traps)." },
                  culturalEtiquette: { type: Type.STRING, description: "How to avoid offending, proper greetings, tipping, or camera protocols." }
                }
              }
            },
            events: {
              type: Type.ARRAY,
              description: "Traditional seasonal festivals or regional cultural celebrations.",
              items: {
                type: Type.OBJECT,
                required: ["id", "name", "timeOfYear", "significance", "localTraditions"],
                properties: {
                  id: { type: Type.STRING, description: "Unique identifier." },
                  name: { type: Type.STRING, description: "Name of the event." },
                  timeOfYear: { type: Type.STRING, description: "The lunar date, season, or standard calendar period." },
                  significance: { type: Type.STRING, description: "The core reason it is celebrated." },
                  localTraditions: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Specific ceremonial items, foods, dances, or dress involved."
                  }
                }
              }
            },
            trivia: {
              type: Type.ARRAY,
              description: "A cultural trivia challenge of 3 multi-choice questions.",
              items: {
                type: Type.OBJECT,
                required: ["question", "options", "correctIndex", "explanation"],
                properties: {
                  question: { type: Type.STRING, description: "Trivia question regarding local customs, historical details, or etiquette." },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: "Exactly 4 multiple-choice options."
                  },
                  correctIndex: { type: Type.INTEGER, description: "0-based index of the correct option." },
                  explanation: { type: Type.STRING, description: "Educational takeaway explaining *why* this custom exists." }
                }
              }
            }
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (err: any) {
    console.error("Error generating destination data:", err);
    res.status(500).json({ error: err.message || "An error occurred while generating cultural details." });
  }
});

// 2. Immersive Long-Form Storyteller Route
app.post("/api/narrative", async (req, res) => {
  try {
    const { name, country, spotName, spotDescription } = req.body;
    if (!spotName) {
       res.status(400).json({ error: "Spot name is required" });
       return;
    }

    const ai = getGeminiClient();
    const prompt = `You are an eloquent travel storyteller and essayist.
Write a deep, sensory, narrative-focused traveler's journal entry for "${spotName}" located in ${name}, ${country || ''}.
Context about the spot: ${spotDescription || ''}

Please write in a warm, respectful, first-person journaling voice. Structure the narrative into 3 vivid, compact paragraphs:
1. **The First Encounter**: Focus heavily on sensory details (sound, smell, atmosphere, morning mist or dusty light) as you approach the place.
2. **The Living Ancestry**: Describe the deep-seated historic spirit, traditional whispers, or architectural detail that connects the past directly to the present.
3. **The Silent Reflection**: An intimate lesson, insight, or moral about human connection and cultural inheritance learned by visiting this spot.

Return only the narrative prose with beautiful markdown paragraphs. Do not add titles, headers, or generic wrapup text.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
    });

    res.json({ narrative: response.text });
  } catch (err: any) {
    console.error("Error generating storytelling narrative:", err);
    res.status(500).json({ error: err.message || "An error occurred while weaving the narrative." });
  }
});

// 3. Cultural Guide Chat Integration
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, destinationContext } = req.body;
    if (!messages || !Array.isArray(messages)) {
       res.status(400).json({ error: "Messages array is required" });
       return;
    }

    const ai = getGeminiClient();

    let systemInstruction = `You are "Scribe", a deeply wise, polite, and well-traveled Cultural Concierge and Local Assistant.
Your mission is to help travelers engage with the local community responsibly, respectfully, and authentically.
Use your vast knowledge of history, language, philosophy, and cultural etiquette.`;

    if (destinationContext) {
      systemInstruction += `\nCurrently, the traveler is exploring "${destinationContext.name}" in ${destinationContext.country}.
Context of this destination:
- Summary: ${destinationContext.summary}
- Local Philosophy/Proverb: "${destinationContext.localProverb?.text}" (meaning: ${destinationContext.localProverb?.meaning})
Provide highly localized advice, respectful greetings in their native tongue, custom etiquettes (e.g., shoe removal, tipping conventions, temple gestures), and avoid tourist-trap commercial recommendations.`;
    }

    // Map conversation array to the expected SDK format
    const sdkContents = messages.map((m: any) => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: sdkContents,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    res.json({ text: response.text });
  } catch (err: any) {
    console.error("Error in cultural advisor chat:", err);
    res.status(500).json({ error: err.message || "An error occurred during guide conversation." });
  }
});

// Vite server setup for development or static file server for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
