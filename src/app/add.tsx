import "../app/app.css";
import AcceptTab from "../components/tab-accept.tsx";
import { useSession } from "../useSession.ts";

// flow #2: POS checkout -> choose "add to tab option" -> redirect to add-tab page (this one)
function AddTab({ tab }: { tab: number }) {
  const { user } = useSession();
  const canManage = user?.role === "supervisor" || user?.role === "admin";

  // NOTE "onSuccess={() => (window.location.href = "/")}" is a placeholder
  // this will eventually redirect back to the POS and mark the payment as complete.
  return (
    <>
      <h1>Lounge Tab System</h1>
      <h2>Confirm adding ${tab} CAD</h2>
      <AcceptTab tab={tab} onSuccess={() => (window.location.href = "/confirm")} />
      {canManage && (
        <button onClick={() => (window.location.href = "/management")}>
          View All Tabs
        </button>
      )}
      <p>You can't add to your tab if it will become greater than $50.00 CAD.</p>
      <p className="read-the-docs">Created by the CSSA.</p>
    </>
  );
}

export default AddTab;
