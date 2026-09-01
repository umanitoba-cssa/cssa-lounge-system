import "./app.css";
import AllTabs from "../components/all-tabs";

function App({ tab }: { tab: number }) {

  return (
    <>
      <h1>Lounge Tab System</h1>
      <h2>Confirm adding ${tab} CAD</h2>
      <AllTabs tab={tab} />
      <button onClick={() => window.location.href = "/management"}>View All Tabs</button>
      <p>You can't add to your tab if it will become greater than $50.00 CAD.</p>
      <p className="read-the-docs">Created by the CSSA.</p>
    </>
  );
}

export default App;
