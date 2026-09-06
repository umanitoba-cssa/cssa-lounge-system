import "./app.css";
import AcceptTab from "../components/accept-tab";
import { useSession } from "../useSession.ts";

function App({ tab }: { tab: number }) {
  const { user, logout } = useSession();
  const canManage = user?.role === "supervisor" || user?.role === "admin";

  return (
    <>
      <h1>Lounge Tab System</h1>
      <h2>Confirm adding ${tab} CAD</h2>
      <AcceptTab tab={tab} onSuccess={() => (window.location.href = "/")} />
      {canManage && (
        <button onClick={() => (window.location.href = "/management")}>
          View All Tabs
        </button>
      )}
      {user && <button onClick={logout}>Sign out ({user.name})</button>}
      <p>You can't add to your tab if it will become greater than $50.00 CAD.</p>
      <p className="read-the-docs">Created by the CSSA.</p>
    </>
  );
}

export default App;
