import logo from "/logo.svg";
import "./app.css";
import AcceptTab from "../components/accept-tab";
import Management from "../components/management";

function App() {
  // const name = useState("CSSA");
  const tab = 40.0;

  return (
    <>
      <div>
        <a href="https://umanitobacssa.ca/" target="_blank">
          <img src={logo} className="logo" alt="UManitoba CSSA logo" />
        </a>
      </div>
      <h1>Lounge Tab System</h1>
      <h2>Confirm adding ${tab} CAD</h2>

      <div className="card">
        <label>
          Your name: <input name="name" />
        </label>
      </div>
      <button onClick={() => setTab(tab)}>Add ${tab}</button>
      <p>
        You can't add to your tab if it will become greater than $50.00 CAD.
      </p>
      <AcceptTab></AcceptTab>
      <p className="read-the-docs">Created by Edith Hohner</p>
    </>
  );
}

function setTab(tab: number) {
  return tab;
}

export default App;
