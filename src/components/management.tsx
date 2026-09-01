import { useEffect, useState } from "react";

interface TabRow {
  id: number;
  name: string;
  tab_amount: string; // cents, as a string
  tab_currency: string;
}

function Management() {
  const [rows, setRows] = useState<TabRow[]>([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTabs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/tabs");
      setRows(await res.json());
    } catch (err) {
      console.error("Failed to fetch tabs: ", err);
      setError("Failed to load tabs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTabs();
  }, []);

  // clear tab method, will require auth eventually yeah
  const clearTab = async (name: string) => {
    setError(null);
    try {
      const res = await fetch(`/api/tabs/${encodeURIComponent(name)}/clear`, {
        method: "POST",
      });
      if (!res.ok) {
        const body = await res.json();
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

  return (
    <div>
      <button onClick={() => window.location.href = "/"}>Back</button>
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
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>${(Number(row.tab_amount) / 100).toFixed(2)}</td>
                <td>
                  <button
                    onClick={() => clearTab(row.name)}
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
