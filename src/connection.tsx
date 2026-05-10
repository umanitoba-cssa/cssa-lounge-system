import { PGlite } from "@electric-sql/pglite";
import ddl from "../../create-tables.sql?raw";

const src = import.meta.env.VITE_DATABASE_URL;
const pgliteDb = await PGlite.create(src); // make src

export default function db() {
  return pgliteDb;
}

if (src == "memory://") {
  db().exec(ddl);
}
