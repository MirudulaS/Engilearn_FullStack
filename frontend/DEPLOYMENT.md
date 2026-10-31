# Deploying the EngiLearn Frontend

This is a static Vite build — it deploys to any static host. These
instructions use **Vercel**, with Netlify as the alternative (a `netlify.toml`
is included for that path too).

## 1. Deploy the backend first

The frontend needs a live API URL before it's useful. Follow
`engilearn-backend/DEPLOYMENT.md` first and note the deployed URL
(e.g. `https://engilearn-api.onrender.com/api`).

## 2. Deploy to Vercel

1. Push this `engilearn` folder to its own GitHub repo
2. In Vercel, **New Project**, import the repo
   - Framework preset: **Vite**
   - Build command: `npm run build`  ·  Output directory: `dist`
     (Vercel usually detects both automatically)
3. Add an environment variable:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | your deployed backend URL + `/api`, e.g. `https://engilearn-api.onrender.com/api` |

4. Deploy. The included `vercel.json` handles client-side routing — without
   it, refreshing on a route like `/dashboard` would 404, since there's no
   `dashboard/index.html` on a static host; the rewrite sends every path to
   `index.html` and lets React Router take over from there.

## Alternative: Netlify

Same steps, using Netlify's UI instead:
- Build command: `npm run build`  ·  Publish directory: `dist`
- Set `VITE_API_URL` under **Site settings → Environment variables**
- The included `netlify.toml` provides the same SPA-routing fix as `vercel.json`

## After deploying

1. Go back to the backend's environment variables and set `CLIENT_URL` to
   this frontend's real deployed URL (e.g. `https://engilearn.vercel.app`).
   Until that's set correctly, every API request from the deployed frontend
   will fail CORS — the frontend will load, but nothing that touches the
   API will work.
2. Register a real account through the deployed UI and click through
   Dashboard → a module → Practice → Compiler → Progress to confirm the
   whole path works against the live API.

## Production checklist

- [ ] `VITE_API_URL` points at the deployed backend, not `localhost`
      (Vite env vars are baked in at build time — changing this requires a
      rebuild, not just a config change)
- [ ] Backend's `CLIENT_URL` matches this frontend's deployed origin exactly
- [ ] Deep-linking to a route (e.g. pasting `/practice` directly into the
      address bar) works, not just navigating there from the home page
- [ ] Login persists across a page refresh (confirms the token round-trip
      through `VITE_API_URL` is actually working, not just the initial load)
