import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/app.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { PGlite } from "@electric-sql/pglite";
import { live } from "@electric-sql/pglite/live";
import { PGliteProvider } from "@electric-sql/pglite-react";

const db = await PGlite.create({
  extensions: { live },
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route
        path={`/`}
        element={
          <PGliteProvider db={db}>
            <App />{" "}
          </PGliteProvider>
        }
      />
    </Routes>
  </BrowserRouter>,
);
