// this will allow the user to view all of the tabs
import { useLiveIncrementalQuery } from "@electric-sql/pglite-react";
import Autosuggest from "react-autosuggest";
import AcceptTab from "./accept-tab";

function AllTabs({ tab }: { tab: number }) {
  const maxNumber = 100;
  const tabs = useLiveIncrementalQuery(`select * from tabs`, [maxNumber], "id");

  const state = {
    value: "",
    suggestions: [],
  };

  const getSuggestions = (value: string) => {
    return tabs?.filter((name) => name.includes(value));
  };

  // Update the input value as the user types
  const onChange = (event, { newValue }) => {
    setState({
      value: newValue,
    });
  };

  // triggered when a suggestion is selected
  const onSuggestionSelected = (event, { suggestion }) => {};

  // render each suggestion in the suggestion list
  const renderSuggestion = (suggestion) => {
    return <div>{suggestion}</div>;
  };

  const inputProps = {
    placeholder: "Enter your name...",
    value: state.value,
    onChange: onChange,
  };

  return (
    <div>
      <Autosuggest
        suggestions={getSuggestions}
        onSuggestionsFetchRequested={getSuggestions}
        onSuggestionsClearRequested={getSuggestions}
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={(suggestion) => suggestion.name}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
      />
      <AcceptTab name={state.value} tab={tab}></AcceptTab>
    </div>
  );
}

export default AllTabs;
