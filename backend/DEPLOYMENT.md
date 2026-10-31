# Deploying the EngiLearn API

This backend is a stateless Express app plus MongoDB — it deploys cleanly to any
Node host. These instructions use **Render** and **MongoDB Atlas** since both
have workable free tiers, but the steps translate directly to Railway, Fly.io,
or a plain VPS.

## 1. Set up MongoDB Atlas (free tier)

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Under **Database Access**, create a user with a strong password
3. Under **Network Access**, allow access from anywhere (`0.0.0.0/0`) — Render's
   IPs aren't static on the free tier, so this is the practical option; a paid
   plan on either side lets you tighten this to a fixed IP list
4. Copy the connection string from **Connect → Drivers** — it looks like
   `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/engilearn`
   (add `/engilearn` as the database name if it isn't already there)

## 2. Deploy the API to Render

1. Push this `engilearn-backend` folder to its own GitHub repo
2. In Render, **New → Web Service**, connect the repo
   (the included `render.yaml` will pre-fill most of this if you use
   **New → Blueprint** instead)
3. Set these environment variables in Render's dashboard:

   | Key | Value |
   |---|---|
   | `NODE_ENV` | `production` |
   | `MONGO_URI` | the Atlas connection string from step 1 |
   | `JWT_SECRET` | a long random string (Render's "Generate" button works) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `CLIENT_URL` | your deployed frontend URL, e.g. `https://engilearn.vercel.app` (comma-separate multiple origins) |

4. Build command: `npm install`  ·  Start command: `npm start`
5. Once deployed, seed the production database once:
   ```bash
   MONGO_URI="<your atlas uri>" npm run seed
   ```
   (run this from your own machine, pointed at the production `MONGO_URI` —
   there's no seed endpoint exposed over HTTP, intentionally)
6. Confirm it's live: `https://<your-service>.onrender.com/api/health` should
   return `{"success":true,"status":"ok","db":"connected",...}`

## Production checklist

- [ ] `JWT_SECRET` is a real random value, not the `.env.example` placeholder
      (the app refuses to boot in production with the placeholder — see `src/config/env.js`)
- [ ] `MONGO_URI` points at Atlas, not `127.0.0.1`
- [ ] `CLIENT_URL` matches your actual deployed frontend origin(s) exactly
      (including `https://`, no trailing slash) — CORS will otherwise reject
      every request from the frontend
- [ ] `npm run seed` has been run once against the production database
- [ ] `npm test` passes (44 tests, no DB required — safe to run in CI)

## What's still a mock in this API

`src/services/codeExecutionService.js` routes each language to either
`judge0Service.js` (real execution, when `JUDGE0_API_URL` is set) or
`mockJudge.js` (canned responses) per language — see that file's own header
comment for exactly which languages Judge0 can run and which stay mocked
regardless (HTML, CSS, SQL, Verilog — none of which Judge0 has a meaningful
way to "run"). **`judge0Service.js` was written against Judge0's documented
API but has not been exercised against a live Judge0 instance** — verify it
yourself with a real `JUDGE0_API_URL` before relying on it. Leaving
`JUDGE0_API_URL` unset keeps everything on the mock judge, which is safe and
fully functional for demoing the rest of the app.
