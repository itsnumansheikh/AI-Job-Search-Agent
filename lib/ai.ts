import { GoogleGenAI } from "@google/genai";

export const ai = new GoogleGenAI({}); // finds your key in .env.local
export const MODEL = "gemini-3.5-flash"; // same name that worked in your test