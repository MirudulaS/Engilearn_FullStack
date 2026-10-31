# EngiLearn — Full Project (Frontend + Backend)

This folder contains the complete MERN application:

```text
engilearn-fullstack/
├── frontend/   React + Vite app (see frontend/README.md for its own details)
├── backend/    Express + MongoDB API (see backend/DEPLOYMENT.md for hosting it)
└── README.md   ← you are here — setup from a totally fresh machine
```

Follow this guide top to bottom. It assumes nothing is installed yet except
the ability to install software (admin/sudo rights).

---

## 0. Prerequisites

- **Node.js 18 or newer** — check with `node -v`. Get it from https://nodejs.org if missing.
- **A code editor** (VS Code or similar) — optional but helpful.
- **A terminal** — you'll run the backend and frontend in two separate terminal windows/tabs at the same time.

---

## 1. Set up MongoDB

You need a MongoDB database. Pick **one** of the three options below —
Option A is the easiest if you don't want to install anything locally;
Option B is fastest if you already have Docker; Option C installs MongoDB
directly on your machine.

### Option A — MongoDB Atlas (cloud, no local install, free tier)

1. Go to https://www.mongodb.com/cloud/atlas/register and create a free account.
2. Create a new **free (M0) cluster** — accept the defaults, pick any region close to you.
3. Under **Security → Database Access**, click **Add New Database User**.
   Set a username and password (write these down — you'll need them in a moment).
4. Under **Security → Network Access**, click **Add IP Address → Allow Access from Anywhere** (`0.0.0.0/0`).
   This is fine for local development; tighten it later if you deploy for real.
5. Go to **Database → Connect → Drivers**, copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
6. Replace `<username>` and `<password>` with the values from step 3, and add
   `engilearn` as the database name right after `.net/`, so it ends up like:
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/engilearn?retryWrites=true&w=majority
   ```
   **This full string is your `MONGO_URI`** — you'll paste it into the backend's `.env` in step 2.

### Option B — Docker (fastest if you already have Docker installed)

```bash
docker run -d --name engilearn-mongo -p 27017:27017 mongo:7
```

Your `MONGO_URI` is simply:
```
mongodb://127.0.0.1:27017/engilearn
```

To stop/start it later: `docker stop engilearn-mongo` / `docker start engilearn-mongo`.

### Option C — Install MongoDB locally (no Docker, no cloud)

**macOS (Homebrew):**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:**
Download the MSI installer from https://www.mongodb.com/try/download/community,
run it (choose "Install as a Service" during setup), and it starts automatically.

**Ubuntu/Debian:**
MongoDB isn't in Ubuntu's default package repos — follow MongoDB's official
install guide for your exact Ubuntu version at
https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-ubuntu/
(it involves adding MongoDB's own apt repository, then `sudo apt install mongodb-org`
and `sudo systemctl start mongod`).

Either way, your `MONGO_URI` is:
```
mongodb://127.0.0.1:27017/engilearn
```

---

## 2. Set up and run the backend

Open a terminal:

```bash
cd engilearn-fullstack/backend
cp .env.example .env
```

Open the new `.env` file in your editor and fill in:

```ini
NODE_ENV=development
PORT=5000

# Paste the MONGO_URI from step 1 (Option A, B, or C above)
MONGO_URI=mongodb://127.0.0.1:27017/engilearn

# Any long random string — this one is fine for local development
JWT_SECRET=change-this-to-anything-random-for-local-dev
JWT_EXPIRES_IN=7d

# Must match the frontend's URL — leave as-is for local development
CLIENT_URL=http://localhost:5173

# Leave these three blank — real code execution is optional (see backend/DEPLOYMENT.md)
JUDGE0_API_URL=
JUDGE0_API_KEY=
JUDGE0_API_HOST=
```

Now install dependencies, load the starter content into your database, and start the server:

```bash
npm install
npm run seed
npm run dev
```

You should see:
```
[db] Connected to MongoDB at mongodb://127.0.0.1:27017/engilearn
[server] EngiLearn API running in development mode on port 5000
[server] Health check: http://localhost:5000/api/health
```

**Verify it worked:** open http://localhost:5000/api/health in a browser. You should see:
```json
{"success":true,"status":"ok","db":"connected",...}
```
If `"db"` says `"disconnected"` instead, your `MONGO_URI` isn't reachable — double-check step 1.

**Leave this terminal running.** The backend needs to stay up while you use the app.

---

## 3. Set up and run the frontend

Open a **second** terminal (leave the backend running in the first one):

```bash
cd engilearn-fullstack/frontend
cp .env.example .env
```

The default `.env` content is already correct for local development:
```ini
VITE_API_URL=http://localhost:5000/api
```

Install dependencies and start it:

```bash
npm install
npm run dev
```

You'll see something like:
```
  VITE v8.2.2  ready in 400 ms
  ➜  Local:   http://localhost:5173/
```

Open that URL in your browser.

---

## 4. Confirm everything works end to end

Walk through this checklist in the browser:

1. **Landing page loads** with three department cards (IT, ECE, EEE) — confirms the frontend can reach the backend, which can reach MongoDB.
2. **Register a new account** (`/register`) — pick any department. You should land on the Dashboard.
3. **Browse a department** → open a category (e.g. IT → Web Development) → open a module → click **Mark as complete**. Refresh the page — it should still show as completed (confirms it's actually saved in MongoDB, not just local state).
4. **Go to Practice**, open a problem, click **Open in Compiler**, click **Run** then **Submit** — you should get a mock "Accepted" result.
5. **Check `/progress`, `/achievements`, and `/dashboard`** — numbers should reflect what you just did (1 module completed, 1 problem solved, a "First Problem Solved" achievement, a "Solved..." line in Recent Activity).
6. **Log out and log back in** — your progress should persist.

If all six pass, the full stack — MongoDB, Express, React, and the connections between them — is working correctly.

---

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `/api/health` shows `"db":"disconnected"` | `MONGO_URI` in `backend/.env` is wrong, or MongoDB isn't running (Docker container stopped, local service not started, Atlas IP not whitelisted) |
| Frontend loads but nothing works, browser console shows CORS errors | `CLIENT_URL` in `backend/.env` doesn't match the frontend's actual URL, or the backend isn't running at all |
| `npm run seed` hangs or errors | Same as the first row — fix `MONGO_URI` first, then re-run the seed |
| Register/login does nothing | Open the browser's Network tab — if requests to `localhost:5000` fail entirely, the backend isn't running; restart it in its terminal |
| Port 5000 or 5173 already in use | Something else is using that port; either stop it, or change `PORT` in `backend/.env` (and `VITE_API_URL` in `frontend/.env` to match) |

## Going further

- To deploy this for real (not just local development), see `backend/DEPLOYMENT.md` and `frontend/DEPLOYMENT.md`.
- To run the backend's automated tests (no MongoDB needed for these): `cd backend && npm test`.
- To enable real code execution instead of the mock compiler: see the Judge0 section in `backend/DEPLOYMENT.md` and the header comment in `backend/src/services/judge0Service.js`.
