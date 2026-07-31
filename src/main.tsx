import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/app.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { PGlite } from "@electric-sql/pglite";
import { PGliteProvider } from "@electric-sql/pglite-react";
import { useEffect, useState } from "react";
import { usePGlite } from "@electric-sql/pglite-react";
import createTables from "./schema.sql?raw";
import { live } from "@electric-sql/pglite/live";

const db = new PGlite("idb://canteen", {
  extensions: { live },
});

export function InitApp({ tab }: { tab: number }) {
  const db = usePGlite();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function initDb() {
      try {
        await db.exec(createTables);
        setIsReady(true);
      } catch (err) {
        console.error("Failed to initialize database:", err);
      }
    }

    initDb();
  }, [db]);

  if (!isReady) {
    return <div>Loading database...</div>;
  }

  return <App tab={tab} />;
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route
        path={`/`}
        element={
          <PGliteProvider db={db}>
            <InitApp tab={10} />
          </PGliteProvider>
        }
      />
    </Routes>
  </BrowserRouter>,
);
