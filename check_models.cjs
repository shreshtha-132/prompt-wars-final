const fs = require('fs');
const dotenv = require('dotenv');

// Load the .env file manually
const envConfig = dotenv.parse(fs.readFileSync('/Users/shreshtha/Downloads/promptwars/prompt-wars-final/.env'));
const key = envConfig.GEMINI_API_KEY;

if (!key || key === 'YOUR_API_KEY_HERE') {
  console.error("Error: It looks like the GEMINI_API_KEY is missing or hasn't been updated in .env");
  process.exit(1);
}

async function checkModels() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);
    const data = await response.json();
    
    if (data.error) {
      console.error("API Error:", data.error.message);
      return;
    }

    const geminiModels = data.models
      .filter(m => m.name.includes('gemini'))
      .map(m => `- ${m.name.replace('models/', '')} (${m.description})`);
      
    console.log("=== Available Gemini Models for your API Key ===");
    console.log(geminiModels.join('\n'));
    console.log("================================================");
  } catch (err) {
    console.error("Request failed:", err);
  }
}

checkModels();
