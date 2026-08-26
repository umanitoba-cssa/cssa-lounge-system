import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/app.tsx";
import { BrowserRouter, Route, Routes } from "react-router";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route
        path={`/`}
        element={
          <App tab={10} />
        }
      />
    </Routes>
  </BrowserRouter>,
);
