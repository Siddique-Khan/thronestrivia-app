# ⚔ ThronesTrivia

> *"A Maester of the Citadel shall uncover the truths of Westeros"*

ThronesTrivia is an AI-powered trivia app for fans of George R.R. Martin's **A Song of Ice and Fire** and the **Game of Thrones** TV series. Ask any lore question and the **Grand Maester** — an AI persona built on Google Gemini — will answer in a whimsical, Westeros-flavoured style.

---

## How It Works

1. **Type your question** into the inquiry panel (e.g. *"Who forged the Iron Throne, and with which dragon's fire?"*)
2. **Press Enter** or click **Summon the Maester**
3. The app sends your question to **Google Gemini** (`gemini-3.1-flash-lite-preview`) with a system prompt that instructs the model to act as the Maester of ThronesTrivia — knowledgeable, playful, and accurate to the lore
4. The response is streamed back and rendered as **Markdown** in the answer panel on the right

If a question has no clear answer in the lore, the Maester responds:
> *"The scrolls are silent on this matter, my lord/lady."*

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 6 |
| Styling | Tailwind CSS v4 + custom CSS variables |
| AI | Google Gemini (`@google/genai`) |
| Markdown rendering | `react-markdown` |
| Icons | `lucide-react` |
| Fonts | Cinzel Decorative, Cinzel, IM Fell English (Google Fonts) |

---

## Getting Started

### Prerequisites

- **Node.js** v18 or higher
- A **Google Gemini API key** — get one free at [aistudio.google.com](https://aistudio.google.com)

### 1. Clone the repo

```bash
git clone https://github.com/your-username/thronestrivia-app.git
cd thronestrivia-app
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add your API key

Create a `.env` file in the project root:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

> ⚠️ **Never commit your `.env` file.** Add it to `.gitignore` to keep your key safe.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server on port 3000 |
| `npm run build` | Build for production (outputs to `../public/thronestrivia`) |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run TypeScript type-checking |
| `npm run clean` | Remove the `dist` folder |

---

## Project Structure

```
thronestrivia-app/
├── src/
│   ├── App.tsx        # Main application component — all UI and AI logic
│   ├── index.css      # Global styles, CSS variables, animations
│   └── main.tsx       # React entry point
├── index.html         # HTML shell
├── vite.config.ts     # Vite config (base URL, env injection, build output)
├── package.json
└── .env               # Your Gemini API key (not committed)
```

### `App.tsx` — what's inside

- **`IronThroneSigil`** — decorative SVG crown rendered in the header
- **`RavenIcon`** — animated SVG raven shown while the AI is thinking
- **`SwordDivider`** — SVG ornament used as a section separator
- **`CornerTL/TR/BL/BR`** — SVG corner ornaments for the panels
- **`App` (default export)** — holds all state (`question`, `answer`, `isLoading`, `error`) and the `askMaester` async function that calls the Gemini API

---

## UI & Design

The interface uses a dark medieval aesthetic:

- **Colour palette** — near-black backgrounds (`#0a0907`), gold accents (`#c9a84c`), crimson highlights (`#8b1a1a`), and parchment text (`#e8dcc8`)
- **Typography** — *Cinzel Decorative* for the title, *Cinzel* for headings, *IM Fell English* for body copy
- **Panels** — two-column layout (input left, answer right) with gold corner ornaments
- **Animations** — a flying raven (`raven-fly`) and a pulsing text effect (`forge-pulse`) play during loading

### UI States

| State | What the user sees |
|---|---|
| **Empty** | A sigil placeholder with *"The scroll awaits your question, my lord."* |
| **Loading** | Animated raven + *"The raven flies across the Narrow Sea…"* |
| **Answer** | The Maester's reply rendered as styled Markdown |
| **Error** | A red warning box with a thematic error message |

---

## Deployment

The Vite config sets the base URL to `/thronestrivia/` and outputs the built files to `../public/thronestrivia`, so it's ready to be served as a sub-path of a larger site.

For a standalone deployment (e.g. Vercel, Netlify, GitHub Pages), update `base` in `vite.config.ts` to `"/"` and set your `GEMINI_API_KEY` as an environment variable in your hosting dashboard.

```bash
npm run build
```

---

## Security Notes

- The Gemini API key is **never sent to the browser.** The app calls a Cloud Function proxy (`functions/index.js`) at `/api/askMaester`; the function holds the key as a Firebase secret (Secret Manager) and applies the system prompt server-side.
- Set/rotate the secret with `firebase functions:secrets:set GEMINI_API_KEY`. Never commit the key to `.env*` or inline it into the build.
- For local `vite` dev, set `VITE_API_BASE` to the deployed origin (e.g. `https://funprojects.ai`) so the dev app calls the live function (CORS is enabled).
- The Maester's system prompt instructs the model never to reveal its underlying instructions or the API key.

---

## License

This project is for personal and fan use. *Game of Thrones* and *A Song of Ice and Fire* are trademarks of HBO and George R.R. Martin respectively.

---

*"When you play the game of thrones, you win or you die." — Cersei Lannister*
