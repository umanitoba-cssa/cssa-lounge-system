import logo from "/logo.svg";
import "./app.css";
import AllTabs from "../components/all-tabs";

// hook onto the canteen system by getting the tab from a tabProvider
function App({ tab }: { tab: number }) {
  tab = 9.99; // temporary... 4 testing

  return (
    <>
      <div>
        <a href="https://umanitobacssa.ca/" target="_blank">
          <img src={logo} className="logo" alt="UManitoba CSSA logo" />
        </a>
      </div>
      <h1>Lounge Tab System</h1>
      <h2>Confirm adding ${tab} CAD</h2>
      <AllTabs tab={tab}></AllTabs>
      <p>
        You can't add to your tab if it will become greater than $50.00 CAD.
      </p>
      <p className="read-the-docs">Created by the CSSA.</p>
    </>
  );
}

export default App;
