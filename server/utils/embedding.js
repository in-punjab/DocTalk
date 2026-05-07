export async function getEmbedding(text) {
  const apiKey = process.env.GEMINI_API_KEY;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-004:embedContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "models/gemini-embedding-2",
        content: {
          parts: [{ text: text.slice(0, 2000) }] // ✅ prevent overflow
        }
      }),
    }
  );

  const data = await response.json();

  if (!data.embedding?.values) {
    throw new Error("No embedding returned");
  }

  return data.embedding.values;
}