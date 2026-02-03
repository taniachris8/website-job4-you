import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import "./components-css/SearchBar.css";

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
      <InputGroup className="mb-3">
        <Form.Control
          aria-label="Example text with button addon"
          aria-describedby="basic-addon1"
          placeholder={placeholder}
          onChange={(e) => setFilterSearch(e.target.value)}
        />
      </InputGroup>
    </>
  );
}
