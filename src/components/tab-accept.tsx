import { useState } from "react";
import { useSession } from "../useSession.ts";
import Login from "./login.tsx";

// associated with add.tsx
function AcceptTab({ tab, onSuccess }: { tab: number; onSuccess: () => void }) {
  const { user, loading, logout } = useSession();
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [displayName, setDisplayName] = useState("");

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
        body: JSON.stringify({ name: displayName.trim() || undefined, amount: amountCents }),
      });

      if (!res.ok) {
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
          Add ${tab.toFixed(2)} to your tab?
        </p>
        <input
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder={"Enter name..."}
          maxLength={255}
        />
        <div className="accept-tab__actions">
          <button onClick={insertItem} disabled={submitting || !displayName.trim()}>
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
