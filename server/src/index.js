import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import session from "express-session";
import { connectDB } from "./config/db.js";
import passport from "./config/passport.js";

import authRoutes from "./routes/auth.routes.js";
import projectsRoutes from "./routes/projects.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import contextRoutes from "./routes/context.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Session is only used transiently during the OAuth handshake (passport needs it for the
// redirect round-trip); the app itself is authenticated via the JWT cookie issued afterward.
app.use(
  session({
    secret: process.env.SESSION_SECRET || "orcible-dev-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());

app.get("/api/health", (_req, res) => res.json({ ok: true, service: "orcible-server" }));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectsRoutes);
app.use("/api/projects/:id/context", contextRoutes);
app.use("/api/chat", chatRoutes);

app.use((err, _req, res, _next) => {
  console.error("[orcible] unhandled error:", err);
  res.status(500).json({ error: "Something went wrong." });
});

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`[orcible] server listening on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error("[orcible] failed to connect to MongoDB:", err.message);
    process.exit(1);
  });
