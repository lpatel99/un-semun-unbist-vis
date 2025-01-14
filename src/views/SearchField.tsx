import React, {
  KeyboardEvent,
  ChangeEvent,
  FC,
  useEffect,
  useState,
  useRef,
} from "react";
import { useSigma } from "@react-sigma/core";
import { BsSearch } from "react-icons/bs";

import { FiltersState } from "../types";
import { searchInstructionIntl } from "../consts";

/**
 * This component is basically a fork from React-sigma-v2's SearchControl
 * component, to get some minor adjustments:
 * 1. We need to hide hidden nodes from results
 * 2. We need custom markup
 */
const SearchField: FC<{
  setHoveredNode: (node: string | null) => void;
  filters: FiltersState;
}> = ({ setHoveredNode, filters }) => {
  const sigma = useSigma();

  const [search, setSearch] = useState<string>("");
  const [values, setValues] = useState<Array<{ id: string; label: string }>>(
    []
  );
  const [selected, setSelected] = useState<string | null>(null);
  const [topResults, setTopResults] = useState<Results>({});
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const inputChanged = useRef<boolean>(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const startTimer = () => {
    cancelTimer();
    typingTimeout.current = setTimeout(() => {
      refreshValues();
    }, 1000);
  };

  const cancelTimer = () => {
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }
  };

  const setInputChanged = (value: boolean) => {
    if (value) {
      setTopResults({});
    }
    inputChanged.current = value;
  };

  interface Results {
    [key: string]: string;
  }

  const refreshValues = async (question = null) => {
    const newValues: Array<{
      id: string;
      label: string;
    }> = [];

    cancelTimer();

    console.log("inputChanged", inputChanged);
    console.log("search", search);

    if (search.length === 0) {
      setValues([]);
      return;
    }

    if (inputChanged.current && search.length > 0) {
      setInputChanged(false);
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
        const top: Results = data.top;
        const all: Results = data.all;
        console.log("top", top);
        console.log("all", all);
        setTopResults(top);
        Object.entries(top).forEach(([key, value]) => {
          newValues.push({
            id: value,
            label: key,
          });
        });
        Object.entries(all).forEach(([key, value]) => {
          newValues.push({
            id: value,
            label: key,
          });
        });
        setValues(newValues);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    }
  };

  const searchUnDigitalLibrary = async () => {
    await refreshValues();
    var query = "";
    Object.entries(topResults).forEach(([key, value]) => {
      if (query !== "") {
        query += "+OR+";
      }
      query += "subjectheading:[" + key.replace(/ /g, "+") + "]";
    });
    window.open("https://digitallibrary.un.org/search?ln=en&p=" + query);
  };

  useEffect(() => {
    if (!selected) return;

    sigma.getGraph().setNodeAttribute(selected, "highlighted", true);

    const nodeDisplayData = sigma.getNodeDisplayData(selected);

    if (nodeDisplayData) {
      sigma.getCamera().animate(
        { ...nodeDisplayData, ratio: 0.05 },
        {
          duration: 600,
        }
      );
    }

    return () => {
      sigma.getGraph().setNodeAttribute(selected, "highlighted", false);
      sigma.getCamera().animate(
        { ...nodeDisplayData, ratio: 0.05 },
        {
          duration: 600,
        }
      );
    };
  }, [selected]);

  useEffect(() => {
    setHighlightedIndex(-1);
    setInputChanged(true);
    startTimer();
  }, [search]);

  useEffect(() => {
    if (highlightedIndex >= 0) {
      const listItems = document.querySelectorAll(".search-results li");
      const listItem = listItems[highlightedIndex] as HTMLElement;
      if (listItem) {
        listItem.scrollIntoView({ block: "nearest" });
      }
    }
  }, [highlightedIndex]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log("onInputChange");
    setSearch(e.target.value);
    setValues([]);
  };

  const handleSelect = (id: string, label: string) => {
    setSearch(label);
    setSelected(id);
    setHoveredNode(id);
    setValues([]);
  };

  const handleClick = (id: string, label: string) => {
    // if clicked element not the highlighted one, highlight it
    const index = values.findIndex((value) => value.id === id);
    if (index === highlightedIndex) {
      handleSelect(id, label);
    } else {
      setHighlightedIndex(index);
    }
  };

  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (highlightedIndex >= 0 && highlightedIndex < values.length) {
        console.log("highlightedIndex", highlightedIndex);
        handleSelect(
          values[highlightedIndex].id,
          values[highlightedIndex].label
        );
      } else {
        refreshValues();
      }
    } else if (e.key === "ArrowDown") {
      setHighlightedIndex((prevIndex) =>
        prevIndex < values.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : values.length - 1
      );
    }
  };

  return (
    <div>
      <div className="search-wrapper">
        <input
          type="search"
          placeholder={searchInstructionIntl[filters.language]}
          value={search}
          onChange={onInputChange}
          onKeyDown={onKeyPress}
        />
        <BsSearch
          className="icon"
          onClick={searchUnDigitalLibrary}
          title={"Click to search documents in UN digital library"}
        />
      </div>
      {values.length > 0 && (
        <ul className="search-results">
          {values.map((value, index) => (
            <li
              key={value.id}
              className={index === highlightedIndex ? "highlighted" : ""}
              onClick={() => handleClick(value.id, value.label)}
            >
              {value.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchField;
