# 🌴 Halo Indonesia!

A fun, Duolingo-style Bahasa Indonesia learning app for children — built with React + Vite, deployed via Cloudflare Pages.

## Features

- 🏝️ **5 island levels**: Greetings, Numbers, Family, Food, Animals
- 🃏 **Flashcards** — flip and learn each word
- 🔗 **Match Game** — pair Indonesian to English
- ⭐ **Quiz** — multiple-choice questions with instant feedback
- 🦜 **Kiki the Parrot** — AI-powered assistant (Claude) who answers questions
- 💾 Progress saved automatically in the browser

## Local Development

```bash
npm install
npm run dev
```

Create a `.env.local` file with your Anthropic API key:

```
VITE_ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxxxxx
```

## Deploy to Cloudflare Pages

1. Push this repo to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com) → Create a project
3. Connect your GitHub repo
4. Set these build settings:
   - **Framework preset**: Vite
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Add environment variable:
   - `VITE_ANTHROPIC_API_KEY` = your Anthropic API key
6. Deploy!

Every `git push` to `main` will auto-deploy.

## Project Structure

```
src/
├── App.jsx        — Main app shell, level map, modal
├── Flashcard.jsx  — Flashcard activity
├── MatchGame.jsx  — Word matching activity
├── Quiz.jsx       — Multiple choice quiz
├── KikiChat.jsx   — AI parrot chat assistant
├── data.js        — All lesson content
├── main.jsx       — Entry point
└── index.css      — Global styles
```

## Adding More Levels

Edit `src/data.js` — add a new object to the `LEVELS` array with `title`, `titleIndo`, `emoji`, `color`, `bg`, and `words`.
