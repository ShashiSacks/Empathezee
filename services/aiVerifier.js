const OpenAI = require("openai");

// Initialize OpenAI
const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Function to verify medical post
async function verifyPost(content) {
    try {
        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "system",
                    content: `
You are a medical AI safety checker.

Your job:
- Check if a health/medical post is SAFE or FAKE or MISLEADING
- Return ONLY JSON

Format:
{
  "status": "SAFE | FAKE | SUSPICIOUS",
  "reason": "short explanation"
}
`
                },
                {
                    role: "user",
                    content: content
                }
            ]
        });

        return response.choices[0].message.content;

    } catch (error) {
        console.error("AI ERROR:", error.message);

        return JSON.stringify({
            status: "SUSPICIOUS",
            reason: "AI check failed"
        });
    }
}

// Function to fetch medicines using ChatGPT
async function getMedicinesFromAI(query) {
    try {
        if (!process.env.OPENAI_API_KEY) {
            console.warn("OpenAI API Key is missing.");
            return [];
        }

        const response = await client.chat.completions.create({
            model: "gpt-4o-mini",
            response_format: { type: "json_object" },
            messages: [
                {
                    role: "system",
                    content: `
You are a pharmacist and medical assistant. 
Given a query (e.g., 'Diabetes' or 'Ventolin'), return exactly 3 to 5 relevant medicines/tablets in JSON format.
Always respond in this JSON structure:
{
  "medicines": [
    {
      "name": "Medicine name (e.g. Ventolin Inhaler)",
      "description": "Short description of what the tablet does, guidelines, or dosage details.",
      "disease": "Target illness or condition (e.g. Asthma)",
      "requiresPrescription": true or false
    }
  ]
}
`
                },
                {
                    role: "user",
                    content: `Find medicines related to: ${query}`
                }
            ]
        });

        const data = JSON.parse(response.choices[0].message.content);
        return data.medicines || [];

    } catch (error) {
        console.error("AI Medicine Fetch Error:", error.message);
        return [];
    }
}

module.exports = { verifyPost, getMedicinesFromAI };