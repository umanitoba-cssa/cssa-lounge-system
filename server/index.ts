import "dotenv/config";
import express from "express";
import { Pool } from "pg";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const createTables = readFileSync(join(__dirname, "../schema.sql"), "utf-8");

// initiate pool w env vars
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.PGHOST,
  database: process.env.POSTGRES_DB,
  password: String(process.env.POSTGRES_PASSWORD),
  port: Number(process.env.PGPORT) || 5432,
});

pool.on("error", (err) => {
  console.error(err);
});

async function init() {
  await pool.query(createTables);
}

// use express
const app = express();
app.use(express.json());

// endpoint: GET /api/tabs -> list all tabs
app.get("/api/tabs", async (_req, res) => {
  try {
    const result = await pool.query("select * from tabs");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tabs" });
  }
});

// endpoint: POST /api/tabs -> create a new tab
app.post("/api/tabs", async (req, res) => {
  const { name, amount } = req.body as { name?: string; amount?: string };
  // amount arrives as a string of cents, e.g. "999" for $9.99 CAD.
  if (!name?.trim() || !amount || !/^\d+$/.test(amount)) {
    return res.status(400).json({ error: "Name and cents amount is required" });
  }

  const amountCents = BigInt(amount); // Money interface conversion

  try {
    const existing = await pool.query(
      "select tab_amount from tabs where name = $1",
      [name],
    );
    const currentBalance = BigInt(existing.rows[0]?.tab_amount ?? "0");

    // force $50.00 CAD limit
    if (currentBalance + amountCents > 5000n) {
      return res.status(400).json({
        error: `Adding $${Number(amountCents) / 100} would exceed the $50.00 limit`,
      });
    }

    // insert or update tab, same operation regardless
    const result = await pool.query(
      `insert into tabs(name, tab_amount)
         values ($1, $2)
         on conflict (name)
         do update set tab_amount = tabs.tab_amount + $2
         returning id, name, tab_amount, tab_currency`,
      [name, amountCents.toString()],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update tab" });
  }
});

// endpoint: POST /api/tabs/:name/clear -> reset a tab to 0 (mark as paid off)
app.post("/api/tabs/:name/clear", async (req, res) => {
  const { name } = req.params;
  try {
    const result = await pool.query(
      `update tabs set tab_amount = 0 where name = $1 returning id, name, tab_amount, tab_currency`,
      [name],
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to clear tab" });
  }
});

// serve built React app
const distPath = join(__dirname, "../dist");
app.use(express.static(distPath));

app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(join(distPath, "index.html"));
});

const PORT = process.env.PORT || 3001;
init().then(() => {
  app.listen(PORT, () => console.log(`Listening on :${PORT}`));
});
