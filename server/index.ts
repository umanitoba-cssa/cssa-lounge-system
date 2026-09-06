import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import { Pool } from "pg";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { requireAuth, requireRole, setSessionCookie, clearSessionCookie, type SessionUser } from "./auth.js";
import {
  makeState,
  discordAuthorizeUrl,
  exchangeDiscordCode,
  microsoftAuthorizeUrl,
  exchangeMicrosoftCode,
  findOrCreateByDiscord,
  findOrCreateByMicrosoft,
} from "./oauth.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const createTables = readFileSync(join(__dirname, "../schema.sql"), "utf-8");

// open the pool
const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: String(process.env.PGPASSWORD),
  port: Number(process.env.PGPORT) || 5432,
});

pool.on("error", (err) => console.error(err));

async function init() {
  await pool.query(createTables);
}

// use express/cookies
const app = express();
app.use(express.json());
app.use(cookieParser());

const FRONTEND_URL = process.env.FRONTEND_URL ?? "http://localhost:5173";

// = discord oauth endpoint =
app.get("/api/auth/discord", (_req, res) => {
  const state = makeState();
  res.cookie("oauth_state", state, { httpOnly: true, sameSite: "lax", maxAge: 5 * 60 * 1000 });
  res.redirect(discordAuthorizeUrl(state));
});

// = discord oauth callback endpoint =
app.get("/api/auth/discord/callback", async (req, res) => {
  const { code, state } = req.query as { code?: string; state?: string };
  const expectedState = req.cookies?.oauth_state;
  res.clearCookie("oauth_state");

  if (!code || !state || state !== expectedState) {
    return res.status(400).send("Invalid OAuth state");
  }

  try {
    const profile = await exchangeDiscordCode(code);
    const row = await findOrCreateByDiscord(pool, profile);
    setSessionCookie(res, {
      id: row.id,
      name: row.name,
      email: row.email,
      discordId: row.discord_id,
      microsoftId: row.microsoft_id,
      role: row.role,
    });
    res.redirect(FRONTEND_URL);
  } catch (err) {
    console.error(err);
    res.status(500).send("Discord sign-in failed");
  }
});

// = microsoft oauth endpoint =
app.get("/api/auth/microsoft", (_req, res) => {
  const state = makeState();
  res.cookie("oauth_state", state, { httpOnly: true, sameSite: "lax", maxAge: 5 * 60 * 1000 });
  res.redirect(microsoftAuthorizeUrl(state));
});

// = microsoft oauth callback endpoint =
app.get("/api/auth/microsoft/callback", async (req, res) => {
  const { code, state } = req.query as { code?: string; state?: string };
  const expectedState = req.cookies?.oauth_state;
  res.clearCookie("oauth_state");

  if (!code || !state || state !== expectedState) {
    return res.status(400).send("Invalid OAuth state");
  }

  try {
    const profile = await exchangeMicrosoftCode(code);
    if (!profile.email?.toLowerCase().endsWith("@myumanitoba.ca")) {
      return res.status(403).send("Please sign in with your @myumanitoba.ca account");
    }
    const row = await findOrCreateByMicrosoft(pool, profile);
    setSessionCookie(res, {
      id: row.id,
      name: row.name,
      email: row.email,
      discordId: row.discord_id,
      microsoftId: row.microsoft_id,
      role: row.role,
    });
    res.redirect(FRONTEND_URL);
  } catch (err) {
    console.error(err);
    res.status(500).send("Microsoft sign-in failed");
  }
});

// = session =
app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json(req.user);
});

// = session logout =
app.post("/api/auth/logout", (_req, res) => {
  clearSessionCookie(res);
  res.status(204).end();
});

// = tabs =
app.post("/api/tabs", requireAuth, async (req, res) => {
  const { amount } = req.body as { amount?: string };
  const { name, email, discordId, microsoftId } = req.user!;

  // check for cents amount
  if (!amount || !/^\d+$/.test(amount)) {
    return res.status(400).json({ error: "Amount in cents is required" });
  }

  const amountCents = BigInt(amount);
  const conflictColumn = discordId ? "discord_id" : "microsoft_id"; // need one
  const identityValue = discordId ?? microsoftId;

  try {
    const existing = await pool.query(`select tab_amount from tabs where ${conflictColumn} = $1`, [identityValue]);
    const currentBalance = BigInt(existing.rows[0]?.tab_amount ?? "0");

    // enforce balance limit
    if (currentBalance + amountCents > 5000n) {
      return res.status(400).json({
        error: `Adding $${Number(amountCents) / 100} would exceed the $50.00 limit`,
      });
    }

    const result = await pool.query(
      `insert into tabs(name, email, discord_id, microsoft_id, tab_amount)
         values ($1, $2, $3, $4, $5)
         on conflict (${conflictColumn})
         do update set
           tab_amount = tabs.tab_amount + $5,
           name = $1,
           email = coalesce($2, tabs.email)
         returning id, name, tab_amount, tab_currency, email, role`,
      [name, discordId ?? null, microsoftId ?? null, amountCents.toString()],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update tab" });
  }
});

// api endpoint to fetch all tabs
app.get("/api/tabs", requireAuth, requireRole("supervisor", "admin"), async (_req, res) => {
  try {
    const result = await pool.query("select * from tabs");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tabs" });
  }
});

// api endpoint to create a new tab
app.post("/api/tabs/:id/clear", requireAuth, requireRole("supervisor", "admin"), async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `update tabs set tab_amount = 0 where id = $1 returning id, name, tab_amount, tab_currency`,
      [id],
    );
    if (!result.rows[0]) return res.status(404).json({ error: "Tab not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to clear tab" });
  }
});

// serve built React app
const distPath = join(__dirname, "../dist");
app.use(express.static(distPath));
app.get(/^\/(?!api).*/, (_req, res) => res.sendFile(join(distPath, "index.html")));

const PORT = process.env.PORT || 3001;
init().then(() => app.listen(PORT, () => console.log(`Listening on :${PORT}`)));
