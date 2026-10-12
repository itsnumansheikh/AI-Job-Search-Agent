"use client";
import { useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("");
  const [profile, setProfile] = useState<any>(null);

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setStatus("Reading your CV...");
    setProfile(null);

    const res = await fetch("/api/parse-cv", { method: "POST", body: formData });
    const data = await res.json();

    if (!res.ok) {
      setStatus(data.error);
      return;
    }
    setProfile(data.profile);
    setStatus("Done! Here is what the AI found:");
  }

  return (
    <main className="p-10 max-w-3xl">
      <h1 className="text-3xl font-bold">My AI Job Search Agent</h1>
      <p className="mt-2 text-gray-400">Step 1: upload your CV (PDF).</p>

      <form onSubmit={handleUpload} className="mt-6 flex gap-3 items-center">
        <input type="file" name="cv" accept="application/pdf" required />
        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">
          Read my CV
        </button>
      </form>

      <p className="mt-4">{status}</p>
      {profile && (
        <pre className="mt-2 p-4 rounded bg-gray-900 text-sm overflow-auto">
          {JSON.stringify(profile, null, 2)}
        </pre>
      )}
    </main>
  );
}