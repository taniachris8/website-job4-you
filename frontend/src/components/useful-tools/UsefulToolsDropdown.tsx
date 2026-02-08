import Dropdown from "react-bootstrap/Dropdown";
import { Link } from "react-router-dom";
import "./UsefulToolsDropdown.css";

interface UsefulToolsDropdownProps {
  showUsefulToolsDropdown?: boolean;
  onToggle?: (show: boolean) => void;
}

export function UsefulToolsDropdown({
  showUsefulToolsDropdown,
  onToggle,
}: UsefulToolsDropdownProps) {
  return (
    <Dropdown show={showUsefulToolsDropdown} onToggle={onToggle}>
      <Dropdown.Menu className="dropdown-menu-useful-tools">
        <Link className="dropdown-link" to="/tips">
          <Dropdown.Item href="#/action-1">טיפים</Dropdown.Item>
        </Link>
        <Link className="dropdown-link" to="/rights">
          <Dropdown.Item href="#/action-2">זכויות עובדים</Dropdown.Item>
        </Link>
        <Link className="dropdown-link" to="/terms-of-use">
          <Dropdown.Item href="#/action-3">תנאי שימוש</Dropdown.Item>
        </Link>
      </Dropdown.Menu>
    </Dropdown>
  );
}
