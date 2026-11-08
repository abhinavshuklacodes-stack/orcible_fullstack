import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    provider: { type: String, enum: ["google", "github", "linkedin", "guest"], required: true },
    providerId: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String },
    avatarUrl: { type: String },
  },
  { timestamps: true }
);

userSchema.index({ provider: 1, providerId: 1 }, { unique: true });

export default mongoose.model("User", userSchema);
