import { Router } from "express";
import crypto from "crypto";
import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

// Lets a login button fail gracefully (redirect back with a clear reason) instead of
// crashing the server when that provider's client ID/secret aren't in .env yet.
function requireProvider(name) {
  return (req, res, next) => {
    if (!passport._strategy(name)) {
      return res.redirect(`${CLIENT_URL}/login?error=${name}-not-configured`);
    }
    next();
  };
}

function issueCookieAndRedirect(req, res) {
  const token = jwt.sign({ sub: req.user._id.toString() }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
  res.cookie("orcible_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.redirect(`${CLIENT_URL}/dashboard`);
}

// --- Google ---
router.get("/google", requireProvider("google"), passport.authenticate("google", { session: false }));
router.get(
  "/google/callback",
  requireProvider("google"),
  passport.authenticate("google", { session: false, failureRedirect: `${CLIENT_URL}/login?error=google` }),
  issueCookieAndRedirect
);

// --- GitHub ---
router.get("/github", requireProvider("github"), passport.authenticate("github", { session: false }));
router.get(
  "/github/callback",
  requireProvider("github"),
  passport.authenticate("github", { session: false, failureRedirect: `${CLIENT_URL}/login?error=github` }),
  issueCookieAndRedirect
);

// --- LinkedIn ---
router.get("/linkedin", requireProvider("linkedin"), passport.authenticate("linkedin", { session: false }));
router.get(
  "/linkedin/callback",
  requireProvider("linkedin"),
  passport.authenticate("linkedin", {
    session: false,
    failureRedirect: `${CLIENT_URL}/login?error=linkedin`,
  }),
  issueCookieAndRedirect
);

// --- Guest ---
// No provider configuration needed. Creates a real user record (so projects/metadata
// persist normally) under a random id, and logs them straight in.
router.get("/guest", async (req, res) => {
  try {
    const guestId = crypto.randomUUID();
    req.user = await User.create({
      provider: "guest",
      providerId: guestId,
      name: `Guest-${guestId.slice(0, 4)}`,
    });
    issueCookieAndRedirect(req, res);
  } catch (err) {
    console.error("[orcible] guest login failed:", err.message);
    res.redirect(`${CLIENT_URL}/login?error=guest`);
  }
});

// --- Current user ---
router.get("/me", requireAuth, async (req, res) => {
  const user = await User.findById(req.userId).lean();
  if (!user) return res.status(404).json({ error: "User not found." });
  res.json({ user });
});

// --- Logout ---
router.post("/logout", (req, res) => {
  res.clearCookie("orcible_token");
  res.json({ ok: true });
});

export default router;
