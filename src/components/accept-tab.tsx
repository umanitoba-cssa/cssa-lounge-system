// this is where the user will login and confirm the amount to add to their tab
import { usePGlite } from "@electric-sql/pglite-react";

function AcceptTab({ name, tab }: { name: string; tab: number }) {
  const db = usePGlite();

  const insertItem = () => {
    db.query(
      `insert into tabs(name, tab)
           values ($1, $2)
           on conflict (username)
           do update set tab = $2`,
      [name, tab],
    );
  };

  return <button onClick={insertItem}>Confirm</button>;
}

export default AcceptTab;
