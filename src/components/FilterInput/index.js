import React from "react";
import {
  Input,
  InputGroup,
  InputRightElement,
  CloseButton,
} from "@chakra-ui/react";

const FilterInput = ({ placeholder, value, setValue }) => (
  <InputGroup>
    <Input
      flex={{ base: "1", md: "auto" }}
      width="20%"
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
    {value && (
      <InputRightElement>
        <CloseButton onClick={() => setValue("")} />
      </InputRightElement>
    )}
  </InputGroup>
);

export default FilterInput;
