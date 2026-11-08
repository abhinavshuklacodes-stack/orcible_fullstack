import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { extractTextFromUrl } from "../utils/extractText.js";
import { groqChat } from "../utils/groq.js";
import Project from "../models/Project.js";

// mergeParams lets this router read :id from the parent /api/projects/:id mount.
const router = Router({ mergeParams: true });
router.use(requireAuth);

const SUMMARY_SYSTEM_PROMPT = `You turn a raw AI chat transcript or page into a tight Markdown
"current context" brief for a project: what was discussed, decisions made, and open threads.
Use headings and bullet points. Keep it under 400 words. Output Markdown only.`;

// POST /api/projects/:id/context/build  { chatUrl }
// Builds (or refreshes) the project's current context from a chat link.
// The full fetch + summarize pipeline runs only 1 time in every 3 calls; the other 2 calls
// return the existing cached context, to keep API usage down.
router.post("/build", async (req, res) => {
  const { chatUrl } = req.body;
  if (!chatUrl) return res.status(400).json({ error: "chatUrl is required." });

  const project = await Project.findOne({ _id: req.params.id, owner: req.userId });
  if (!project) return res.status(404).json({ error: "Project not found." });

  project.contextBuildCount += 1;
  const shouldRunFullPipeline = project.contextBuildCount % 3 === 1;

  if (!shouldRunFullPipeline && project.currentContext) {
    await project.save();
    return res.json({ project, refreshed: false });
  }

  try {
    const rawText = await extractTextFromUrl(chatUrl);
    const markdown = await groqChat([
      { role: "system", content: SUMMARY_SYSTEM_PROMPT },
      { role: "user", content: rawText || "(no readable content found at the link)" },
    ]);

    project.currentContext = markdown;
    project.contextSourceUrl = chatUrl;
    project.contextUpdatedAt = new Date();
    await project.save();

    res.json({ project, refreshed: true });
  } catch (err) {
    console.error("[orcible] context build failed:", err.message);
    res.status(502).json({ error: "Couldn't build context from that link. Check the URL and try again." });
  }
});

// Manual edit of current context from the UI.
router.put("/", async (req, res) => {
  const { currentContext } = req.body;
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId },
    { currentContext, contextUpdatedAt: new Date() },
    { new: true }
  );
  if (!project) return res.status(404).json({ error: "Project not found." });
  res.json({ project });
});

export default router;
