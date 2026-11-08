import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { groqChat } from "../utils/groq.js";
import Project from "../models/Project.js";

const router = Router();
router.use(requireAuth);

const ORCIBLE_SYSTEM_PROMPT = `You are Orcible, a calm, direct assistant that helps a person move
between different AI tools (Claude, ChatGPT, Gemini, Meta AI, Grok, DeepSeek, Kimi) on one project.
Answer plainly and concretely. If project metadata is supplied, treat it as ground truth about the
project and use it to tailor your answers.`;

// POST /api/chat  { message, history: [{role, content}], projectId? }
router.post("/", async (req, res) => {
  const { message, history = [], projectId } = req.body;
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "message is required." });
  }

  let metadataBlock = "";
  if (projectId) {
    const project = await Project.findOne({ _id: projectId, owner: req.userId }).lean();
    if (project?.metadata?.length) {
      metadataBlock =
        "\n\nProject metadata:\n" + project.metadata.map((m) => `- ${m.key}: ${m.value}`).join("\n");
    }
  }

  const messages = [
    { role: "system", content: ORCIBLE_SYSTEM_PROMPT + metadataBlock },
    ...history.slice(-10).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: message },
  ];

  try {
    const reply = await groqChat(messages);
    res.json({ reply });
  } catch (err) {
    console.error("[orcible] groq chat failed:", err.message);
    res.status(502).json({ error: "Chat with Orcible is unavailable right now. Try again shortly." });
  }
});

export default router;
