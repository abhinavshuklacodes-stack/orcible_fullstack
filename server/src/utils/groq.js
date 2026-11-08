import axios from "axios";

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const DEFAULT_MODEL = "llama-3.3-70b-versatile";

/**
 * Send a chat completion request to Groq's free, OpenAI-compatible API.
 * @param {{role: "system"|"user"|"assistant", content: string}[]} messages
 * @param {{model?: string, temperature?: number, max_tokens?: number}} options
 */
export async function groqChat(messages, options = {}) {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY is not set in .env");
  }
  const response = await axios.post(
    GROQ_URL,
    {
      model: options.model || DEFAULT_MODEL,
      messages,
      temperature: options.temperature ?? 0.5,
      max_tokens: options.max_tokens ?? 1024,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json",
      },
      timeout: 30000,
    }
  );
  return response.data.choices[0].message.content;
}
