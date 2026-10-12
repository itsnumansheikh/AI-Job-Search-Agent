import { ai, MODEL } from "@/lib/ai";

// The instruction note we hand to the AI
const PROMPT = `Read this CV and return JSON with exactly these fields:
{
  "name": string | null,
  "email": string | null,
  "phone": string | null,
  "summary": string | null,
  "skills": string[],
  "experience": [{ "title": string, "company": string, "start": string | null, "end": string | null, "bullets": string[] }],
  "education": [{ "degree": string, "school": string, "year": string | null }]
}
Rules: only use facts that are written in the CV. Never invent anything.
If something is missing, use null or an empty list.`;

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("cv");

  if (!(file instanceof File)) {
    return Response.json({ error: "Please choose a PDF file." }, { status: 400 });
  }
  if (file.type !== "application/pdf") {
    return Response.json({ error: "For now, only PDF files work." }, { status: 400 });
  }
  if (file.size > 5 * 1024 * 1024) {
    return Response.json({ error: "File is too big (max 5 MB)." }, { status: 400 });
  }

  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");

  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [{ inlineData: { mimeType: "application/pdf", data: base64 } }, PROMPT],
      config: { responseMimeType: "application/json" },
    });
    const profile = JSON.parse(response.text ?? "");
    return Response.json({ profile });
  } catch (err) {
    console.error(err);
    return Response.json(
      { error: "The AI could not read this CV. Wait a minute and try again." },
      { status: 500 }
    );
  }
}