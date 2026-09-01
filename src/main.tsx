import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/app.tsx";
import Management from "./components/management.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import logo from "/logo.svg";

// import tab from "";
const tab = 9.99; // temporary... 4 testing

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <div>
      <a href="/">
        <img src={logo} className="logo" alt="UManitoba CSSA logo" />
      </a>
    </div>
    <Routes>
      <Route path="/" element={<App tab={tab} />} />
      <Route path="/management" element={<Management />} />
    </Routes>
  </BrowserRouter>,
);
