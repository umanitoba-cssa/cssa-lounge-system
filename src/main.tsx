import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/app.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import ddl from "../create-tables.sql?raw";
import db from "./connection.ts";

// load the tables into the database
await db().exec(ddl);

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path={`/`} element={<App />} />
    </Routes>
  </BrowserRouter>,
);
