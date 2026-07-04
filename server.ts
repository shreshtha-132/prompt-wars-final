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
    const prompt = `You are a world-renowned Indian cultural anthropologist, historian, and expert regional curator specializing in the diverse cultures, traditions, and heritage of India (Bharat).
Generate a deeply immersive cultural travel profile for the Indian destination: "${name}".
This is specifically an INDIAN destination. Ensure all content is authentic, grounded in real Indian customs, history, and genuine geographical locations within India.
Tailor recommendations based on traveler preferences:
- Focus/Interest: ${preferences?.interest || 'history'}
- Travel Pace: ${preferences?.pace || 'moderate'}
- Travel Budget: ${preferences?.budget || 'moderate'}

Create detailed content covering:
1. A local proverb or saying in the regional language (Hindi, Tamil, Bengali, Kannada, Marathi, etc. as appropriate for the region), with its transliteration, English translation, and deep philosophical meaning.
2. 4-6 must-visit attractions curated for the traveler's interest — include temples, palaces, ghats, forts, art centers, or natural sites as appropriate. Be specific to real locations.
3. 4 hidden gems that are genuinely off the beaten path — include the local folklore, oral legend, or mythological significance that makes the spot sacred or special. Give detailed instructions on visiting respectfully.
4. 4 authentic local experiences — traditional crafts (block printing, Madhubani art, pottery, weaving), regional cuisine workshops, classical dance or music performances, nature experiences. Include specific etiquette: how to approach local artisans, remove footwear protocols, photography rules, tipping norms.
5. 3-4 heritage festivals or local celebrations — include exact season or Hindu calendar timing, the religious or agricultural significance, traditional rituals, foods, attire, and processions.
6. A 3-question interactive cultural trivia quiz on local customs, temple etiquette, folklore, or historical events. Make the correct answer explanations educational and culturally enriching.`;

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
    const prompt = `You are a celebrated Indian travel essayist and cultural storyteller, deeply versed in the mythology, spirituality, architecture, and living traditions of Bharat (India).
Write a deeply evocative, sensory, first-person traveler's journal entry for "${spotName}" located in ${name}, India.
Context about this Indian site: ${spotDescription || ''}

Write in a warm, poetic, respectful voice that honors the spiritual and historical weight of this Indian location. Structure into 3 vivid paragraphs:
1. **The Arrival**: Describe the sensory experience of approaching — the smell of incense or marigolds, the sound of temple bells or street vendors, the texture of old stone or cool river water, the golden light of dawn or dusk.
2. **The Living Spirit**: Describe how centuries of devotion, craftsmanship, or history are still palpable today — in the architecture's carvings, in the rituals of local worshippers, in the oral stories passed down through generations.
3. **The Takeaway**: An intimate cultural lesson or philosophical insight learned here — about impermanence, community, devotion, or the extraordinary richness of Indian civilizational heritage.

Return only the narrative prose. Do not add titles, headers, or generic wrapup text. Make every sentence lyrical and specific to India.`;

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

    let systemInstruction = `You are "Pandit Ji", a deeply wise, warm, and knowledgeable Cultural Concierge specializing in Incredible India.
Your mission is to help travelers explore India respectfully, authentically, and meaningfully.
You are well-versed in Indian history, classical arts (Bharatanatyam, Kathak, Carnatic music), regional languages and greetings, Hindu and other religious customs, Ayurveda, regional cuisines, traditional crafts, and the deep philosophical traditions of India (Vedanta, Buddhism, Jainism, Sufism).
Always greet with Namaste. Offer practical, hyper-local advice. Give responses in a warm, slightly lyrical, knowledgeable tone. Suggest authentic experiences, not tourist traps.
When relevant, teach travelers useful Hindi or regional language phrases. Explain the 'why' behind customs (e.g., why we remove footwear, why we offer prasad, why we circle a temple clockwise).`;

    if (destinationContext) {
      systemInstruction += `\nCurrently, the traveler is exploring "${destinationContext.name}" in ${destinationContext.country}.
Destination context:
- Cultural Summary: ${destinationContext.summary}
- Local Proverb: "${destinationContext.localProverb?.text}" (meaning: ${destinationContext.localProverb?.meaning})
Provide hyper-local advice specific to ${destinationContext.name}: temple protocols, local greetings in the regional language, specific dishes to try, respectful dress codes, how to interact with artisans, and any unique cultural sensitivities of this specific region of India.`;
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
