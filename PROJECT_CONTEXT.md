# ThronesTrivia — Project Context

Load this file at the start of a new session to resume work with full context.

---

## What the App Does

ThronesTrivia is a Game of Thrones / ASOIAF lore Q&A app. The user types a trivia question, and a "Grand Maester" AI persona answers it with rich markdown prose and citation badges (e.g. "House Targaryen", "Season 6"). The UI is themed as an immersive gothic throne room — "The Great Hall" — with CSS-only animations (torches, floating motes, ember particles, stained-glass windows, banners).

Live URL: **https://funprojects.ai/thronestrivia**

---

## System Design

```
User Browser
    │
    ├── funprojects.ai (Firebase Hosting)
    │       ├── /                  → public/index.html  (homepage with project cards)
    │       ├── /thronestrivia/    → public/thronestrivia/index.html  (React SPA build output)
    │       └── /newproject/       → public/newproject/index.html  (coming soon page)
    │
    └── askMaester Cloud Function (Firebase)
            └── POST /api/askMaester  →  proxies to Gemini REST API
                    using the GEMINI_API_KEY secret (server-side only)
```

The React app calls its own **Cloud Function proxy** (`/api/askMaester`), never Google directly — so the API key stays server-side in Firebase Secret Manager and out of the browser bundle.

---

## Repository & Hosting

| Thing | Value |
|---|---|
| GitHub repo | https://github.com/Siddique-Khan/thronestrivia-app |
| Firebase project | `funprojects-ai` |
| Live domain | `funprojects.ai` (GoDaddy, A records pointing to Firebase) |
| Hosting folder | `funprojects-site/public/` |
| React source | `funprojects-site/thronestrivia-app/` |
| Build output | `funprojects-site/public/thronestrivia/` (Vite writes here) |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Bundler | Vite 6 |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"`) + CSS custom properties |
| AI | Google Gemini REST API (no SDK — direct `fetch`) |
| Markdown rendering | `react-markdown` |
| Icons | `lucide-react` |
| Hosting | Firebase Hosting (static) |
| Domain | GoDaddy → funprojects.ai |

---

## Authentication / API Key

- **No user authentication.** The app is fully public.
- **The Gemini API key is server-side only** — it never reaches the browser. The React app calls the `/api/askMaester` Cloud Function (`functions/index.js`), which holds the key as a **Firebase secret** (Secret Manager) via `defineSecret('GEMINI_API_KEY')`.
- Set or rotate the secret with:
  ```bash
  firebase functions:secrets:set GEMINI_API_KEY
  firebase deploy --only functions
  ```
- Do **not** put the key in `.env*` or inject it into the Vite build (that was the old, insecure approach — the key was visible in the bundle/network tab; fixed by routing through the function).
- Get or rotate the key at: **https://aistudio.google.com/apikey**

---

## Gemini Integration

Model: `gemini-3.1-flash-lite-preview` (a post-May-2025 Google release — Claude may not know about it, but it works).

The app calls the REST API directly with no SDK:

```ts
POST https://generativelanguage.googleapis.com/v1beta/models/
     gemini-3.1-flash-lite-preview:generateContent?key={API_KEY}

Body:
{
  system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
  contents: [{ role: "user", parts: [{ text: "The noble asks: {question}" }] }],
  generationConfig: { temperature: 0.6 }
}
```

The system prompt instructs Gemini to respond **only** as JSON:
```json
{ "answer": "<markdown>", "citations": ["tag1", "tag2"] }
```

The `parseMaester()` function defensively parses this — strips markdown fences, extracts the JSON object, and falls back to plain text if parsing fails.

---

## Key Files

```
funprojects-site/
├── firebase.json                         # Hosting config (public dir, rewrites)
├── .firebaserc                           # { "default": "funprojects-ai" }
├── public/
│   ├── index.html                        # Homepage (dark, two project cards)
│   ├── thronestrivia/                    # Built React app (git-ignored, Vite output)
│   └── newproject/index.html            # Coming soon page
└── thronestrivia-app/
    ├── .env                              # GEMINI_API_KEY (git-ignored, never commit)
    ├── package.json                      # Dependencies (no @google/genai — uses fetch)
    ├── vite.config.ts                    # base: '/thronestrivia/', outDir: '../public/thronestrivia'
    ├── src/
    │   ├── App.tsx                       # Main component (SVGs, Gemini call, UI)
    │   ├── index.css                     # Great Hall design system + scene CSS
    │   └── main.tsx                      # React entry point
    └── design_handoff_throne_hall/       # Original design spec (reference only)
```

---

## Local Development

```bash
cd /Users/shafi/Documents/GITHubProjects/FunProjects-ai/funprojects-site/thronestrivia-app
npm install
npm run dev
# → http://localhost:3000
```

Note: in dev mode the app runs at `localhost:3000/` (not `/thronestrivia/`). That's normal — the `base` path only applies to production builds.

---

## Deploy to Firebase

```bash
cd /Users/shafi/Documents/GITHubProjects/FunProjects-ai/funprojects-site/thronestrivia-app
npm run build
cd ..
firebase deploy --only hosting
```

---

## Push to GitHub (without API key)

The `.env` file must be in `.gitignore` before pushing. Then:

```bash
cd /Users/shafi/Documents/GITHubProjects/FunProjects-ai/funprojects-site/thronestrivia-app
git add .
git commit -m "your message"
git push origin main
```

GitHub requires a **Personal Access Token** (not a password):
- Generate at: https://github.com/settings/tokens (classic, `repo` scope)
- Set remote with token: `git remote set-url origin https://Siddique-Khan:TOKEN@github.com/Siddique-Khan/thronestrivia-app.git`

---

## UI Design — "The Great Hall"

- **Background scene**: CSS-only throne room with vault, lancet stained-glass windows, god-ray, two flanking banners, throne silhouette, four torch flames, floating motes, rising ember particles, and a film-grain overlay. All `aria-hidden`.
- **Design tokens**: defined in `:root` inside `src/index.css` — colors (`--color-gold`, `--color-parchment`, etc.), gradients, glows, typography, spacing, radii.
- **Fonts**: Cinzel Decorative (title), Cinzel (headings/labels), IM Fell English (body prose) — all loaded from Google Fonts in `index.html`.
- **Layout**: compact header (sigil + title inline) → two-column grid (inquiry panel left, scroll panel right).
- **Inquiry panel**: eyebrow label → textarea (3 rows, Enter to submit) → quest chips → Summon button → hint text. All within one panel so the button is always visible.
- **Scroll panel**: three states — empty (Compass SVG placeholder), loading (Raven SVG + pulse text), answered (unfurl animation + ReactMarkdown prose + citation Badge chips).
- **`unfurl` animation**: transform only (`scaleY` + `translateY`) — never animates opacity, per design spec.
- **Reduced motion**: all animations disabled via `@media (prefers-reduced-motion: reduce)`.

---

## Known Issues / Notes

- The Gemini free tier has rate limits (429 errors). If you see "raven intercepted by wildlings", wait ~60 seconds and retry.
- `@google/genai` npm package is not used — replaced with a direct `fetch` call because the package was blocked in the Cowork sandbox during development.
- The `functions/` folder (`askMaester` in `funprojects-site/functions/index.js`, referenced in `firebase.json`) **is now the backend** for ThronesTrivia — the app calls `/api/askMaester` instead of Gemini directly, keeping the key off the client. Deploying functions requires the Firebase **Blaze** plan.
