import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/app.tsx";
import AddTab from "./app/add.tsx";
import Management from "./components/management.tsx";
import Confirm from "./components/confirm.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import logo from "/logo.svg";

// note we will need to import this properly from the POS once it is complete
const tab = 9.99; // <- <- <- temporary... 4 testing

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <div>
      <a href="/">
        <img src={logo} className="logo" alt="UManitoba CSSA logo" />
      </a>
    </div>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/add" element={<AddTab tab={tab} />} />
      <Route path="/management" element={<Management />} />
      <Route path="/confirm" element={<Confirm />} />
    </Routes>
  </BrowserRouter>,
);
