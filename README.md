# Orcible

One place to hold your project's memory — metadata, current context, and artifacts —
then jump into whichever AI tool (Claude, ChatGPT, Gemini, Meta AI, Grok, DeepSeek, Kimi)
fits the next step, or talk to Orcible itself (powered by Groq).

Monochrome black-and-white UI, light and dark mode, no gradients.

## Structure

```
orcible/
  server/   Node.js + Express + MongoDB API, Google/GitHub/LinkedIn OAuth, Groq chat
  client/   React + Vite frontend
```

## Quick start

### 1. Backend

```bash
cd server
cp .env.example .env     # fill in the values below
npm install
npm run dev               # http://localhost:4000
```

Required `.env` values:

| Variable | Where to get it |
|---|---|
| `MONGO_URI` | A MongoDB connection string (local `mongodb://localhost:27017/orcible` or an Atlas free cluster) |
| `JWT_SECRET` | Any long random string |
| `SESSION_SECRET` | Any long random string |
| `GROQ_API_KEY` | https://console.groq.com — free tier, used for "Chat with Orcible" and context summarizing |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | https://console.cloud.google.com/apis/credentials — free, create an OAuth 2.0 Client ID, add `http://localhost:4000/api/auth/google/callback` as a redirect URI |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET` | https://github.com/settings/developers — free, new OAuth App, callback URL `http://localhost:4000/api/auth/github/callback` |
| `LINKEDIN_CLIENT_ID` / `LINKEDIN_CLIENT_SECRET` | https://www.linkedin.com/developers/apps — free, add the "Sign In with LinkedIn using OpenID Connect" product, callback URL `http://localhost:4000/api/auth/linkedin/callback` |
| `CLIENT_URL` | `http://localhost:5173` in dev |

None of the three OAuth providers charge for standard sign-in scopes — you only pay if you later
add their paid data/marketing APIs, which Orcible doesn't use.

### 2. Frontend

```bash
cd client
cp .env.example .env     # VITE_API_URL=http://localhost:4000
npm install
npm run dev                # http://localhost:5173
```

## Footer links

`client/src/components/Footer.jsx` has a `CONTACT` object at the top with placeholder email and
social links (X, Facebook, Instagram, LinkedIn) — swap in your real ones. The "Why Orcible?" page
copy in `client/src/pages/Why.jsx` is a first draft; edit freely.

## The logo

`client/public/logo-mask.png` is your uploaded mark with the teal background removed, kept as a
white shape on a transparent background. `Logo.jsx` applies it as a CSS mask tinted with the
current theme's ink color, so the real artwork flips from black to white with light/dark mode
automatically. The favicon (`client/public/favicon.png`) is a flattened black version of the same
mask.

## What's fully built

- Google / GitHub / LinkedIn OAuth login, JWT session cookie
- **Guest login** — a "Continue as guest" button on the login page that works with zero
  configuration: it creates a real user record and logs you straight into the dashboard,
  so you can explore and test the app before any OAuth provider is set up
- Projects: create, list, delete, select "currently cooking" project
- Project Memory panel: editable Metadata (key/value, attached to every AI prompt), Current Context,
  Artifacts list
- AI tool row (Claude, ChatGPT, Gemini, Meta AI, Grok, DeepSeek, Kimi) — opens each tool's site in a
  new tab
- "Chat with Orcible" — live chat backed by Groq's free API (`llama-3.3-70b-versatile`)
- Light/dark mode toggle, monochrome theme, persisted per browser
- Context pipeline: paste a chat link → server fetches and extracts the page text → Groq summarizes
  it into Markdown → saved as the project's Current Context. A per-project counter runs the full
  fetch+summarize only 1 time in 3 (matching the "x ⅓ times" note in the brief) and serves the cached
  context the other 2 times, to save API calls.

## What's intentionally stubbed (separate projects of their own)

- **Browser extension** — the sidebar's "Download Extension" link points at `/how-to-use`, which
  explains it's coming soon. A real extension needs its own manifest/build and store listing.
- **Literal PDF round-trip** — the sketch describes chat → PDF → Markdown → summary site. The context
  pipeline above gets the same result (a Markdown context from a chat link) without the intermediate
  PDF file, since that step adds a heavy rendering dependency (e.g. Puppeteer) for no change in output.
  If you want the literal PDF step, swap `server/src/utils/extractText.js` for a Puppeteer PDF export
  followed by a PDF→Markdown conversion.
- **Artifact file storage** — per the sketch ("Artifacts... we are not storing it"), Orcible stores
  only the artifact's title, source tool, and chat link — never the file itself.
