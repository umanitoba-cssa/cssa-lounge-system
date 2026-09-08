import "./app.css";
import { useSession } from "../useSession.ts";
import PayTab from "../components/tab-pay.tsx";

// flow #1: POS home -> choose to "manage tab" -> redirect to home page (this one)
function App() {
  const { user } = useSession();
  const canManage = user?.role === "supervisor" || user?.role === "admin";

 // NOTE we will need to add a button to return to the POS from here
  return (
    <>
      <h1>Lounge Tab System</h1>
      <PayTab onSuccess={() => (window.location.href = "/confirm")} />
      {canManage && (
        <button onClick={() => (window.location.href = "/management")}>
          View All Tabs
        </button>
      )}
      <p className="read-the-docs">Created by the CSSA.</p>
    </>
  );
}

export default App;
