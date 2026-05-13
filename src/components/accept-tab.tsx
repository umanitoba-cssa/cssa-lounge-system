// this is where the user will login and confirm the amount to add to their tab
import { usePGlite } from "@electric-sql/pglite-react";
import { useState } from "react";

export default function AcceptTab() {
  const db = usePGlite();
  const [name] = useState("CSSA"); // get this from `app.tsx`
  const [tab] = useState(40.0);

  const insertItem = () => {
    db.query(
      `insert into tabs(name, tab)
           values ($1, $2)
           on conflict (username)
           do update set tab = $2`,
      [name, tab],
    );
  };

  return <button onClick={insertItem}></button>;
}
