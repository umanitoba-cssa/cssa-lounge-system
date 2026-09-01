import "dotenv/config";
import express from "express";
import { Pool } from "pg";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const createTables = readFileSync(join(__dirname, "../schema.sql"), "utf-8");

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: String(process.env.PGPASSWORD),
  port: Number(process.env.PGPORT) || 5432,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

const MAX_TAB = 50.0;

async function init() {
  await pool.query(createTables);
}

const app = express();
app.use(express.json());

app.get("/api/tabs", async (_req, res) => {
  try {
    const result = await pool.query("select * from tabs");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tabs" });
  }
});

app.post("/api/tabs", async (req, res) => {
  const { name, amount } = req.body as { name?: string; amount?: string };
  // amount arrives as a string of cents, e.g. "999" for $9.99
  if (!name?.trim() || !amount || !/^\d+$/.test(amount)) {
    return res.status(400).json({ error: "name and amount (cents, as a string) are required" });
  }

  const amountCents = BigInt(amount);

  try {
    const existing = await pool.query(
      "select tab_amount from tabs where name = $1",
      [name],
    );
    const currentBalance = BigInt(existing.rows[0]?.tab_amount ?? "0");

    if (currentBalance + amountCents > 5000n) {
      return res.status(400).json({
        error: `Adding $${Number(amountCents) / 100} would exceed the $50.00 limit`,
      });
    }

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

// serve the built React app
const distPath = join(__dirname, "../dist");
app.use(express.static(distPath));

app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(join(distPath, "index.html"));
});

const PORT = process.env.PORT || 3001;
init().then(() => {
  app.listen(PORT, () => console.log(`Listening on :${PORT}`));
});
