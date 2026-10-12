import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({}); // finds GEMINI_API_KEY in your secret drawer

const MODEL = "gemini-3.5-flash"; // the worker's name

const response = await ai.models.generateContent({
  model: MODEL,
  contents: "Say hello to my job search app in one sentence!",
});

console.log(response.text);