import { useState } from "react";
/// the email field doesn't do any thing yet. figure that out

function AcceptTab({
  name,
  tab,
  isNewName,
  onSuccess,
}: {
  name: string;
  tab: number;
  isNewName: boolean;
  onSuccess: () => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const insertItem = async (emailToSend?: string) => {
    if (!name.trim()) return;

    setError(null);
    setSubmitting(true);

    try {
      const amountCents = Math.round(tab * 100).toString();
      const res = await fetch("/api/tabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          amount: amountCents,
          ...(emailToSend?.trim() ? { email: emailToSend.trim() } : {}),
        }),
      });
      if (!res.ok) {
        const body = await res.json();
        setError(body.error ?? "Failed to update tab");
        return;
      }
      setShowConfirm(false);
      setEmail("");
      setSuccess(true);
      onSuccess();
      setTimeout(() => { setSuccess(false); }, 2000);
    } catch (err) {
      console.error("Failed to update tab: ", err);
      setError("Network error");
    } finally {
      setSubmitting(false);
    }
  };

  // wait till confirm clicked to display
  const handleConfirmClick = () => {
    if (isNewName) {
      setShowConfirm(true);
    } else {
      insertItem();
    }
  };

  if (showConfirm) {
    return (
      <div className="accept-tab">
        <p>
          Create a new tab for "{name}"?
        </p>
        <input
          type="email"
          placeholder="Student Email/Auth???"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
        />
        <div className="accept-tab__actions">
          <button onClick={() => insertItem(email)} disabled={submitting}>
            {submitting ? "Creating..." : "Create Tab"}
          </button>
          <button onClick={() => setShowConfirm(false)} disabled={submitting}>
            Cancel
          </button>
        </div>
        {error && <p className="accept-tab__error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="accept-tab">
      <button
        onClick={handleConfirmClick}
        disabled={!name.trim() || submitting}
        className={success ? "accept-tab__button--success" : ""}
      >
        {submitting ? "Adding..." : success ? "✓ Added" : "Confirm"}
      </button>
      {error && <p className="accept-tab__error">{error}</p>}
    </div>
  );
}

export default AcceptTab;
