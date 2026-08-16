# Skilxz

Bodyweight/calisthenics skill-tree workout tracker with an AI coach.

## Run locally

```
npm install
npm run dev
```

## AI coach

The in-app Coach talks to Claude through the serverless function at
`api/chat.js`, so the API key never reaches the browser. Set an
`ANTHROPIC_API_KEY` environment variable wherever this is deployed
(e.g. Vercel project settings) — see `.env.example`.

## Deploy

Import this repo into Vercel. It auto-detects Vite for the frontend and
picks up `api/chat.js` as a serverless function. Add `ANTHROPIC_API_KEY`
under Project Settings → Environment Variables before the Coach will work.

Persistence (accounts, saved history, membership tiers) is not wired up
yet — current state (`user`, `tier`, workout history, etc.) lives only in
memory. Hook up Supabase for that next.
