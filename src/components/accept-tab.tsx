import { useState } from "react";

function AcceptTab({
  name,
  tab,
  onSuccess,
}: {
  name: string;
  tab: number;
  onSuccess: () => void;
}) {
  const [error, setError] = useState<string | null>(null);

  const insertItem = async () => {
    if (!name.trim()) return;
    setError(null);
    try {
      const amountCents = Math.round(tab * 100).toString();
      const res = await fetch("/api/tabs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, amount: amountCents }),
      });
      if (!res.ok) {
        const body = await res.json();
        setError(body.error ?? "Failed to update tab");
        return;
      }
      onSuccess();
    } catch (err) {
      console.error("Failed to update tab: ", err);
      setError("Network error");
    }
  };

  return (
    <div>
      <button onClick={insertItem} disabled={!name.trim()}>
        Confirm
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default AcceptTab;
