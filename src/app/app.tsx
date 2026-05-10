import { useState } from "react";
import logo from "/logo.svg";
import "./app.css";

function App() {
  const [tab] = useState(20);

  return (
    <>
      <div>
        <a href="https://umanitobacssa.ca/" target="_blank">
          <img src={logo} className="logo" alt="UManitoba CSSA logo" />
        </a>
      </div>
      <h1>Lounge Tab System</h1>
      <div className="card">
        <label>
          Amount to add: <input name="additional" type="number" />
        </label>
      </div>
      <button onClick={() => setTab(tab)} className="bg-none">
        Add to Tab
      </button>
      <p>You can't make purchases if your tab is greater than $50.00 CAD.</p>
      <p className="read-the-docs">Created by Edith H.</p>
    </>
  );
}

function setTab(tab: number): void {
  tab = tab + 1;
}

export default App;
