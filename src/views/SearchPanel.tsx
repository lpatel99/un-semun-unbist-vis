import { FC } from "react";
import { MdSearch } from "react-icons/md";
import { Radio, Text, Stack } from "@chakra-ui/react";
import Panel from "./Panel";

const SearchPanel: FC<{
  queryOperator: "OR" | "AND";
  toggleQueryOperator: (operator: "OR" | "AND") => void;
}> = ({ queryOperator, toggleQueryOperator }) => {
  return (
    <Panel
      title={
        <>
          <MdSearch className="icon" /> Search Options
        </>
      }
    >
      <Text fontStyle="italic" color="gray.500" mb={4} minH={10} mt={4}>
        Choose the query operator:
      </Text>
      <Stack spacing={2} mt={4}>
        {["OR", "AND"].map((operator) => (
          <Radio
            key={operator}
            isChecked={queryOperator === operator}
            onChange={() => toggleQueryOperator(operator as "OR" | "AND")}
            id={`operator-${operator}`}
            value={operator}
            color="#5b92e5"
            size="lg"
          >
            <Text color="gray.500" fontSize="sm">
              {operator}
            </Text>
          </Radio>
        ))}
      </Stack>
    </Panel>
  );
};

export default SearchPanel;
