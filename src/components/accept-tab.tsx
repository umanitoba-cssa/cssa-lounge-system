// this is where the user will login and confirm the amount to add to their tab
import { usePGlite } from "@electric-sql/pglite-react";

function AcceptTab({ name, tab }: { name: string; tab: number }) {
  const db = usePGlite();

  const insertItem = async () => {
    if (!name.trim()) return;

    console.log("inserting tab", name, tab)
    try {
      await db.query(
              `insert into tabs(name, tab)
                   values ($1, $2)
                   on conflict (name)
                   do update set tab = tabs.tab + $2`, // adds to existing total balance
              [name, tab],
            );
    } catch (error) {
      console.error("Failed to update tab: ", error);
    }

  };

  return <button onClick={insertItem} disabled={!name.trim()}>Confirm</button>;
}

export default AcceptTab;
