// this will allow the user to view all of the tabs
import { useState } from "react";
import { useLiveQuery } from "@electric-sql/pglite-react";import Autosuggest from "react-autosuggest";
import AcceptTab from "./accept-tab";

// results from db
interface TabRow {
  id: number;
  name: string;
  tab: number;
}

function AllTabs({ tab }: { tab: number }) {
  const tabs = useLiveQuery<TabRow>(`select * from tabs`);

  const rows = tabs?.rows || [];

    const [value, setValue] = useState("");
    const [suggestions, setSuggestions] = useState<TabRow[]>([]);

    // Filter existing tab names based on input
    const getSuggestions = (inputValue: string) => {
      const cleanValue = inputValue.trim().toLowerCase();
      if (!cleanValue) return [];

      return rows.filter((row) =>
        row.name.toLowerCase().includes(cleanValue)
      );
    };

    const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
      setSuggestions(getSuggestions(value));
    };

    const onSuggestionsClearRequested = () => {
      setSuggestions([]);
    };

    const onChange = (
      _event: React.FormEvent,
      { newValue }: { newValue: string }
    ) => {
      setValue(newValue);
    };

    const inputProps = {
      placeholder: "Enter name...",
      value,
      onChange,
    };

    // show a loading indicator while tabs is undefined
    if (!tabs) {
      return <div>Loading tabs...</div>;
      }

    const onSuggestionSelected = (
      _event: React.SyntheticEvent,
      { suggestionValue }: { suggestionValue: string }
    ) => {
      setValue(suggestionValue);
    };

    return (
      <div>
        <Autosuggest
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          onSuggestionSelected={onSuggestionSelected}
          getSuggestionValue={(suggestion) => suggestion.name}
          renderSuggestion={(suggestion) => <div>{suggestion.name + " ($" + suggestion.tab + ")"}</div>}
          inputProps={inputProps}
        />
        <AcceptTab name={value} tab={tab} />
      </div>
    );

 }

  export default AllTabs;
