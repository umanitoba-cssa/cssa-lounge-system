import { useState } from "react";
import { useSession } from "../useSession.ts";
import Login from "./login.tsx";

// associated with app.tsx
function PayTab({ onSuccess }: { onSuccess: () => void }) {
  const { user, loading, logout } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submittingTransfer, setSubmittingTransfer] = useState(false);
  const [submittingInPerson, setSubmittingInPerson] = useState(false);
  const [success, setSuccess] = useState(false);

  if (loading) {
    return (
      <div className="pay-tab">
        <p className="pay-tab-status">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  const handlePayClick = () => {
    setError(null);
    setShowConfirm(true);
  };

  // issue #20, how are we handling in person?
  // regardless, simulate a successful payment
  const handleInPerson = async () => {
    setSubmittingInPerson(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSuccess(true);
      setShowConfirm(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Something went wrong marking your tab as paid.");
    } finally {
      setSubmittingInPerson(false);
    }
  };

  // in theory call on interac
  // but i ain't codin all that quite yet
  // so this also just simulates a succesful payment
  const handleTransfer = async () => {
    setSubmittingTransfer(true);
    setError(null);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setSuccess(true);
      setShowConfirm(false);
      onSuccess();
    } catch (err) {
      console.error(err);
      setError("Something went wrong marking your tab as paid.");
    } finally {
      setSubmittingTransfer(false);
    }
  };

  if (success) { return true; }

  // display confirmation
  return (
    <div className="pay-tab">
      <div className="pay-tab-card">
        <h2>Confirm tab payment</h2>
        <p>Signed in as {user.name}</p>

        {error && <p className="pay-tab-error">{error}</p>}

        {!showConfirm ? (
          <div className="pay-tab-actions">
            <button className="pay-tab-button primary" onClick={handlePayClick}>
              Pay tab
            </button>
            <button className="pay-tab-button secondary" onClick={logout}>
              Log out
            </button>
          </div>
        ) : (
          <div className="pay-tab-confirm">
            <p>Would you like to pay in-person or by e-transfer?</p>
            <div className="pay-tab-actions">
              <button
                className="pay-tab-button primary"
                onClick={handleTransfer}
                disabled={submittingTransfer}
              >
                {submittingTransfer ? "Processing…" : "Pay by e-transfer"}
              </button>
              <button
                className="pay-tab-button secondary"
                onClick={handleInPerson}
                disabled={submittingInPerson}
              >
                {submittingInPerson ? "Processing…" : "Pay in-person"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PayTab;
