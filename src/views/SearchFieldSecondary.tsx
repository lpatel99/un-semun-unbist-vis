import React, { FC, ChangeEvent, KeyboardEvent, useState } from "react";
import { BsSearch } from "react-icons/bs";

import { FiltersState } from "../types";
import { queryNaturalLanguageIntl } from "../consts";

const SearchFieldSecondary: FC<{
  filters: FiltersState;
}> = ({ filters }) => {
  const [search, setSearch] = useState<string>("");

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const onKeyPress = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      try {
        const response = await fetch("http://localhost:5002/ask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: search }),
        });
        const data = await response.json();
        // get string data.output
        const output = data.output;
        console.log(output);
        window.open(
          "https://digitallibrary.un.org/search?ln=en&p=" +
            output.replace(/ /g, "+"),
          "_blank"
        );
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  return (
    <div className="search-wrapper">
      <input
        type="search"
        placeholder={queryNaturalLanguageIntl[filters.language]}
        list="nodes-secondary"
        value={search}
        onChange={onInputChange}
        onKeyPress={onKeyPress}
      />
      <BsSearch className="icon" />
      <datalist id="nodes-secondary">{/* No options for now */}</datalist>
    </div>
  );
};

export default SearchFieldSecondary;
