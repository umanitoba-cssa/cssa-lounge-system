import { useState } from "react";
import { useSession } from "../useSession.ts";
import Login from "./login.tsx";

function AcceptTab({ tab, onSuccess }: { tab: number; onSuccess: () => void }) {
  const { user, loading, logout } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const insertItem = async () => {
    setError(null);
    setSubmitting(true);

    try {
      const amountCents = Math.round(tab * 100).toString();
      // post to /api/tabs to create a new tab
      const res = await fetch("/api/tabs", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amountCents }),
      });

      if (!res.ok) {
        const body = await res.json();
        setError(body.error ?? "Failed to update tab");
        return;
      }

      setShowConfirm(false);
      setSuccess(true);
      onSuccess();
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error("Failed to update tab: ", err);
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Login />;
  }

  // get auth input
  if (showConfirm) {
    return (
      <div className="accept-tab">
        <p>
          Add ${tab.toFixed(2)} to {user.name}'s tab?
        </p>
        <div className="accept-tab__actions">
          <button onClick={insertItem} disabled={submitting}>
            {submitting ? "Adding..." : "Confirm"}
          </button>
          <button onClick={() => setShowConfirm(false)} disabled={submitting}>
            Cancel
          </button>
        </div>
        {error && <p className="accept-tab__error">{error}</p>}
      </div>
    );
  }

  // tab acceptance ui
  return (
    <div className="accept-tab">
      <p>Signed in as {user.name}</p>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={submitting}
        className={success ? "accept-tab__button--success" : ""}
      >
        {submitting ? "Adding..." : success ? "Added" : "Add to tab"}
      </button>
      <button onClick={logout} className="accept-tab__logout">
        Sign out
      </button>
      {error && <p className="accept-tab__error">{error}</p>}
    </div>
  );
}

export default AcceptTab;
