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
    <Dropdown
      className="useful-tools-dropdown-root"
      show={showUsefulToolsDropdown}
      onToggle={onToggle}>
      <Dropdown.Menu className="dropdown-menu-useful-tools">
        <Dropdown.Item as={Link} className="dropdown-menu-link" to="/tips">
          טיפים
        </Dropdown.Item>
        <Dropdown.Item as={Link} className="dropdown-menu-link" to="/rights">
          זכויות עובדים
        </Dropdown.Item>
        <Dropdown.Item
          as={Link}
          className="dropdown-menu-link"
          to="/terms-of-use">
          תנאי שימוש
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
}
