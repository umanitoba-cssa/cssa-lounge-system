import type { PluginContext } from "@tessellatepos/plugin-sdk";

interface TabRow {
  id: number;
  name: string;
  tab_amount: string;
  tab_currency: string;
  date: string;
}

// sample data
const SAMPLE_TABS: TabRow[] = [
  { id: 1, name: "Pop and chips", tab_amount: "4.50", tab_currency: "CAD", date: "2026-11-11T00:00:00" },
  { id: 2, name: "Pizza slice", tab_amount: "3.75", tab_currency: "CAD", date: "2026-11-12T00:00:00" },
  { id: 3, name: "Energy drink", tab_amount: "3.25", tab_currency: "CAD", date: "2026-11-13T00:00:00" },
];

const toCents = (amount: string) => Math.round(Number(amount) * 100);
const formatMoney = (cents: number) => `$${(cents / 100).toFixed(2)}`;

const cellStyle = {
  padding: "0.25rem 0.75rem 0.25rem 0",
  textAlign: "left",
} as const;

function TabPage({ context }: { context?: PluginContext }) {
  const totalCents = SAMPLE_TABS.reduce((sum, row) => sum + Number(row.tab_amount), 0);

  return (
    <div style={{ maxWidth: "40rem", margin: "1.5rem auto", padding: "1rem" }}>
      <h2>Your tabs</h2>
      <p>
        {SAMPLE_TABS.length} items, {formatMoney(toCents(totalCents.toString()))} owed in total
      </p>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={cellStyle}>Item</th>
            <th style={cellStyle}>Amount</th>
            <th style={cellStyle}>Currency</th>
            <th style={cellStyle}>Date Added</th>
          </tr>
        </thead>
        <tbody>
          {SAMPLE_TABS.map((tab) => (
            <tr key={tab.id}>
              <td style={cellStyle}>{tab.name}</td>
              <td style={cellStyle}>{formatMoney(toCents(tab.tab_amount))}</td>
              <td style={cellStyle}>{tab.tab_currency}</td>
              <td style={cellStyle}>{new Date(tab.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {context && (
        <button type="button" onClick={() => context.navigate("/")}>
          Back to storefront
        </button>
      )}
    </div>
  );
}

export default TabPage;