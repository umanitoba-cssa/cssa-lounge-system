import { useEffect, useState } from "react";
import Autosuggest from "react-autosuggest";
import AcceptTab from "./accept-tab";

interface TabRow {
  id: number;
  name: string;
  tab_amount: string; // cents, as a string (bigint over tha wire)
  tab_currency: string;
}

function AllTabs({ tab }: { tab: number }) {
  const [rows, setRows] = useState<TabRow[]>([]);

  const fetchTabs = async () => {
    const res = await fetch("/api/tabs");
    setRows(await res.json());
  };

  useEffect(() => {
    fetchTabs();
  }, []);

  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<TabRow[]>([]);

  const getSuggestions = (inputValue: string) => {
    const cleanValue = inputValue.trim().toLowerCase();
    if (!cleanValue) return [];
    return rows.filter((row) => row.name.toLowerCase().includes(cleanValue));
  };

  const onSuggestionsFetchRequested = ({ value }: { value: string }) => {
    setSuggestions(getSuggestions(value));
  };

  const onSuggestionsClearRequested = () => {
    setSuggestions([]);
  };

  const onChange = (
    _event: React.FormEvent,
    { newValue }: { newValue: string },
  ) => {
    setValue(newValue);
  };

  const inputProps = { placeholder: "Enter name...", value, onChange };

  const onSuggestionSelected = (
    _event: React.SyntheticEvent,
    { suggestionValue }: { suggestionValue: string },
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
        renderSuggestion={(suggestion) => (
          <div>{suggestion.name + " ($" + (Number(suggestion.tab_amount) / 100).toFixed(2) + ")"}</div>
        )}
        inputProps={inputProps}
      />
      <AcceptTab
        name={value}
        tab={tab}
        isNewName={!rows.some((row) => row.name.toLowerCase() === value.trim().toLowerCase())}
        onSuccess={fetchTabs}
      />    </div>
  );
}

export default AllTabs;
