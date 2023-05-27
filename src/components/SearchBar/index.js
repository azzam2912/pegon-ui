import { useState } from "react";
import { InputGroup, InputLeftElement, Input } from "@chakra-ui/react";
import { MdSearch } from "react-icons/md";

const SearchBar = ({ searchDocuments }) => {
  const [query, setQuery] = useState("");

  const handleSearch = (event) => {
    const updatedQuery = event.target.value;
    setQuery(updatedQuery);
    searchDocuments(updatedQuery);
  };

  return (
    <InputGroup mr={3}>
      <InputLeftElement pointerEvents="none" children={<MdSearch />} />
      <Input
        type="text"
        placeholder="Search Here"
        value={query}
        onChange={handleSearch}
      />
    </InputGroup>
  );
};

export default SearchBar;
