import { Router } from "express";
import Project from "../models/Project.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);

// List all of the user's projects.
router.get("/", async (req, res) => {
  const projects = await Project.find({ owner: req.userId }).sort({ updatedAt: -1 }).lean();
  res.json({ projects });
});

// Create a project.
router.post("/", async (req, res) => {
  const { name } = req.body;
  if (!name || !name.trim()) {
    return res.status(400).json({ error: "Project name is required." });
  }
  const existingActive = await Project.exists({ owner: req.userId, isActive: true });
  const project = await Project.create({
    owner: req.userId,
    name: name.trim(),
    isActive: !existingActive, // first project is active by default
  });
  res.status(201).json({ project });
});

// Get a single project.
router.get("/:id", async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, owner: req.userId }).lean();
  if (!project) return res.status(404).json({ error: "Project not found." });
  res.json({ project });
});

// Delete a project.
router.delete("/:id", async (req, res) => {
  const deleted = await Project.findOneAndDelete({ _id: req.params.id, owner: req.userId });
  if (!deleted) return res.status(404).json({ error: "Project not found." });
  res.json({ ok: true });
});

// Mark a project as the one you're "currently cooking".
router.post("/:id/activate", async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, owner: req.userId });
  if (!project) return res.status(404).json({ error: "Project not found." });
  await Project.updateMany({ owner: req.userId }, { isActive: false });
  project.isActive = true;
  await project.save();
  res.json({ project });
});

// Replace a project's metadata (the details attached to every AI prompt).
router.put("/:id/metadata", async (req, res) => {
  const { metadata } = req.body; // [{ key, value }, ...]
  if (!Array.isArray(metadata)) {
    return res.status(400).json({ error: "metadata must be an array of { key, value }." });
  }
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, owner: req.userId },
    { metadata },
    { new: true }
  );
  if (!project) return res.status(404).json({ error: "Project not found." });
  res.json({ project });
});

// Add an artifact (Orcible stores only the link, title, and source tool — never the file).
router.post("/:id/artifacts", async (req, res) => {
  const { title, tool, chatUrl } = req.body;
  if (!title || !tool || !chatUrl) {
    return res.status(400).json({ error: "title, tool, and chatUrl are all required." });
  }
  const project = await Project.findOne({ _id: req.params.id, owner: req.userId });
  if (!project) return res.status(404).json({ error: "Project not found." });
  project.artifacts.unshift({ title, tool, chatUrl });
  await project.save();
  res.status(201).json({ project });
});

router.delete("/:id/artifacts/:artifactId", async (req, res) => {
  const project = await Project.findOne({ _id: req.params.id, owner: req.userId });
  if (!project) return res.status(404).json({ error: "Project not found." });
  project.artifacts = project.artifacts.filter((a) => a._id.toString() !== req.params.artifactId);
  await project.save();
  res.json({ project });
});

export default router;
