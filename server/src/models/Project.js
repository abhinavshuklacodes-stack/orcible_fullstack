import mongoose from "mongoose";

const artifactSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tool: {
      type: String,
      enum: ["claude", "chatgpt", "gemini", "meta", "grok", "deepseek", "kimi"],
      required: true,
    },
    // Link back to the chat where this artifact was created. Orcible never stores the file itself.
    chatUrl: { type: String, required: true },
  },
  { timestamps: true, _id: true }
);

const metadataEntrySchema = new mongoose.Schema(
  {
    key: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    name: { type: String, required: true },

    // Essential details attached to every AI prompt for this project.
    metadata: { type: [metadataEntrySchema], default: [] },

    // The project's current working context, as Markdown.
    currentContext: { type: String, default: "" },
    contextSourceUrl: { type: String, default: "" },
    // How many times context/build has been called for this project, used to throttle
    // the full fetch+summarize pipeline to 1 run in every 3 calls.
    contextBuildCount: { type: Number, default: 0 },
    contextUpdatedAt: { type: Date },

    artifacts: { type: [artifactSchema], default: [] },

    isActive: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
