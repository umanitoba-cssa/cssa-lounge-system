import type { TabArrResponse } from "@/db/mountDB";
import { usePluginApi } from "@/hooks/usePluginAPI";
import { type PluginContext } from "@tessellatepos/plugin-sdk";
import { convertCentsToDollars } from "@tessellatepos/sdk";

interface TabRow {
  id: number;
  name: string;
  tab_amount: string;
  tab_currency: string;
  created_at: string;
}

// sample data
const SAMPLE_ITEMS: TabRow[] = [
  { id: 1, name: "Pop and chips", tab_amount: "4.50", tab_currency: "CAD", created_at: "2026-11-10T00:00:00" },
  { id: 2, name: "Pizza slice", tab_amount: "3.75", tab_currency: "CAD", created_at: "2026-11-12T00:00:00" },
  { id: 3, name: "Energy drink", tab_amount: "3.25", tab_currency: "CAD", created_at: "2026-11-13T00:00:00" },
];

const toCents = (amount: string) => Math.round(Number(amount) * 100);
const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const cellStyle = {
  padding: "0.25rem 0.75rem 0.25rem 0",
  textAlign: "left",
} as const;

function TabPage({ context }: { context: PluginContext }) {
  const totalCents = SAMPLE_ITEMS.reduce((sum, row) => sum + Number(row.tab_amount), 0);

  // Temporarily showing a list of all tabs, instead of just this user's tab until we can do auth and accounts properly 
  const tabs = usePluginApi<TabArrResponse>(context.api, "/tab");

  return (
    <div style={{ maxWidth: "40rem", margin: "1.5rem auto", padding: "1rem" }}>
      <h2>Your tab</h2>
      <p>
        {SAMPLE_ITEMS.length} items, {formatMoney(toCents(totalCents.toString()))} owed in total
      </p>

      {tabs.status === "ok" && tabs.data.entries.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={cellStyle}>ID</th>
              <th style={cellStyle}>Tab Amount</th>
              <th style={cellStyle}>Name</th>
              <th style={cellStyle}>Date Created</th>
            </tr>
          </thead>
          <tbody>
            {tabs.data.entries.map((entry) => (
              <tr key={entry.id}>
                <td style={cellStyle}>{entry.id}</td>
                <td style={cellStyle}>
                  ${convertCentsToDollars(entry.tab_amount)}
                </td>
                <td style={cellStyle}>{entry.name}</td>
                <td style={cellStyle}>
                  {new Date(
                    entry.created_at,
                  ).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {context && (
        <button type="button" onClick={() => context.navigate("/")}>
          Back to storefront
        </button>
      )}
    </div>
  );
}

export default TabPage;
