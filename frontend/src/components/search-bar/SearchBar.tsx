import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";

import "./SearchBar.css";

interface SearchBarProps {
  placeholder?: string;
  setFilterSearch: (value: string) => void;
}

export function SearchBar({
  placeholder = "",
  setFilterSearch,
}: SearchBarProps) {
  return (
    <>
      <InputGroup className="search-bar-group">
        <Form.Control
          aria-label="Example text with button addon"
          aria-describedby="basic-addon1"
          className="search-bar-input"
          placeholder={placeholder}
          onChange={(e) => setFilterSearch(e.target.value)}
        />
      </InputGroup>
    </>
  );
}
