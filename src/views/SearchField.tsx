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
import { set } from "lodash";

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
  const [checkedLabels, setCheckedLabels] = useState<Set<string>>(new Set());
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const startTimer = () => {
    cancelTimer();
    typingTimeout.current = setTimeout(() => {
      refreshValues();
    }, 1500);
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

    setIsRefreshing(true);

    cancelTimer();

    if (search.length === 0) {
      setValues([]);
      return;
    }

    if (inputChanged.current && search.length > 0) {
      setCheckedLabels(new Set());
      setTopResults({});
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
      setIsRefreshing(false);
    }
  };

  const searchUnDigitalLibrary = async () => {
    if (search === "") {
      return;
    }
    var query = "";
    if (checkedLabels.size === 0) {
      await refreshValues();
      if (isRefreshing || Object.keys(topResults).length === 0) {
        return;
      }
      Object.entries(topResults).forEach(([key, value]) => {
        if (query !== "") {
          query += "+OR+";
        }
        query += "subjectheading:[" + key.replace(/ /g, "+") + "]";
      });
      window.open("https://digitallibrary.un.org/search?ln=en&p=" + query);
    } else {
      checkedLabels.forEach((label) => {
        if (query !== "") {
          query += "+OR+";
        }
        query += "subjectheading:[" + label.replace(/ /g, "+") + "]";
      });
    }
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
    setInputChanged(true);
    startTimer();
  }, [search]);

  const onInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setValues([]);
  };

  const handleSelect = (id: string, label: string) => {
    setSearch(label);
    setSelected(id);
    setHoveredNode(id);
    setValues([]);
  };

  const handleToggleCheck = (label: string) => {
    setCheckedLabels((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(label)) {
        newSet.delete(label);
      } else {
        newSet.add(label);
      }
      return newSet;
    });
  };

  const onKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      refreshValues();
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
          {values.map((value) => (
            <li
              key={value.id}
              className={checkedLabels.has(value.label) ? "checked" : ""}
              onClick={() => handleToggleCheck(value.label)}
              onDoubleClick={() => handleSelect(value.id, value.label)}
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
