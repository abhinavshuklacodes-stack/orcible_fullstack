import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as LinkedInStrategy } from "passport-linkedin-oauth2";
import User from "../models/User.js";

const SERVER_URL = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 4000}`;

async function upsertUser({ provider, providerId, name, email, avatarUrl }) {
  const user = await User.findOneAndUpdate(
    { provider, providerId },
    { provider, providerId, name, email, avatarUrl },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return user;
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${SERVER_URL}/api/auth/google/callback`,
        scope: ["profile", "email"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await upsertUser({
            provider: "google",
            providerId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            avatarUrl: profile.photos?.[0]?.value,
          });
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${SERVER_URL}/api/auth/github/callback`,
        scope: ["user:email"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await upsertUser({
            provider: "github",
            providerId: profile.id,
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value,
            avatarUrl: profile.photos?.[0]?.value,
          });
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
}

if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  passport.use(
    new LinkedInStrategy(
      {
        clientID: process.env.LINKEDIN_CLIENT_ID,
        clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
        callbackURL: `${SERVER_URL}/api/auth/linkedin/callback`,
        scope: ["openid", "profile", "email"],
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const user = await upsertUser({
            provider: "linkedin",
            providerId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0]?.value,
            avatarUrl: profile.photos?.[0]?.value,
          });
          done(null, user);
        } catch (err) {
          done(err);
        }
      }
    )
  );
}

// We issue our own JWT after OAuth succeeds, so no server-side session serialization is needed
// beyond what passport requires to complete the redirect flow.
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

export default passport;
