import { useEffect, useState } from "react";
import { useSession } from "../useSession.ts";
import Login from "./login.tsx";

interface TabRow {
  id: number;
  name: string;
  tab_amount: string; // cents, as a string
  tab_currency: string;
}

function Management() {
  const { user, loading: sessionLoading } = useSession();
  const [rows, setRows] = useState<TabRow[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // check for management privileges
  const canManage = user?.role === "supervisor" || user?.role === "admin";

  // fetch tabs if user can manage
  const fetchTabs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tabs", { credentials: "include" });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "Failed to clear tab");
        return;
      }
      setRows(await res.json() as TabRow[]);
    } catch (err) {
      console.error("Failed to fetch tabs: ", err);
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  // fetch tabs on mount if user can manage
  useEffect(
    () => {
    if (canManage) {
      fetchTabs();
    } else {
      setLoading(false);
    }
  }, [canManage]);

  // clear tab and refetch tabs
  const clearTab = async (id: number) => {
    setError(null);
    try {
      const res = await fetch(`/api/tabs/${id}/clear`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? "Failed to clear tab");
        return;
      }
      fetchTabs();
    } catch (err) {
      console.error("Failed to clear tab: ", err);
      setError("Network error");
    }
  };

  const filtered = rows
    .filter((row) => row.name.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => Number(b.tab_amount) - Number(a.tab_amount)); // sort by highest

  const totalOwed = rows.reduce((sum, row) => sum + Number(row.tab_amount), 0);

  if (sessionLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    return <Login />;
  }

  if (!canManage) {
    return (
      <div>
        <button onClick={() => (window.location.href = "/")}>Back</button>
        <p>You don't have access to this page.</p>
      </div>
    );
  }

  // render management interface as a table
  return (
    <div>
      <button onClick={() => (window.location.href = "/")}>Back</button>
      <h1>Tab Management</h1>
      <p>Total outstanding: ${(totalOwed / 100).toFixed(2)} CAD</p>

      <input
        type="text"
        placeholder="Search name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Balance</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>${(Number(row.tab_amount) / 100).toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => clearTab(row.id)}
                    disabled={Number(row.tab_amount) === 0}
                  >
                    Mark Paid
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Management;
