// this will allow the user to view all of the tabs
import { useLiveIncrementalQuery } from "@electric-sql/pglite-react";
import Tab from "../components/tab";

export default function Management() {
  const maxNumber = 100;
  const tabs = useLiveIncrementalQuery(`select * from tabs`, [maxNumber], "id");

  return (
    <>
      {tabs.map((item) => (
        <Tab item={(item.name, item.tab)} />
      ))}
    </>
  );
}
