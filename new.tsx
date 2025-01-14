import React, { FC, ChangeEvent, KeyboardEvent, useState } from "react";
import { BsSearch } from "react-icons/bs";

import { FiltersState } from "../types";
import { searchInstructionIntl } from "../consts";

const SearchFieldSecondary: FC<{
  setHoveredNode: (node: string | null) => void;
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
          body: JSON.stringify({
            question: search,
            language: filters.language,
          }),
        });
        const data = await response.json();
        const top = data.top;
        const all = data.all;
        console.log("top", top);
        console.log("all", all);
        window.open(
          "https://digitallibrary.un.org/search?ln=en&p=subjectheading:[" +
            top[0].replace(/ /g, "+") +
            "]",
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
        placeholder={searchInstructionIntl[filters.language]}
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
