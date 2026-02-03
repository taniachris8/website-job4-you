import { useEffect } from "react";
import "./DropdownUser.css";
import Dropdown from "react-bootstrap/Dropdown";
import { Button } from "../buttons/Button";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthContext";

interface DropdownUserProps {
  showDropdownUser?: boolean;
  onToggle?: (show: boolean) => void;
  iconRef?: React.RefObject<HTMLElement | null>;
}

export function DropdownUser({
  showDropdownUser,
  onToggle,
  iconRef,
}: DropdownUserProps) {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const iconRect = iconRef?.current?.getBoundingClientRect?.();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  useEffect(() => {
    if (iconRect) {
      console.log(iconRect); // This will show the icon's position and dimensions
    }
  }, [iconRect]);

  return (
    <Dropdown show={showDropdownUser} onToggle={onToggle}>
      <Dropdown.Menu className="dropdown-menu">
        {user ? (
          <>
            <Dropdown.Item href="#/action-1" className="dropdown-item">
              {user?.name} {user?.familyName}
            </Dropdown.Item>
            <Link className="dropdown-link" to="/users-settings">
              <Dropdown.Item href="#/action-2" className="dropdown-item">
                Settings
              </Dropdown.Item>
            </Link>
            <Link className="dropdown-link" to="/users-savedJobs">
              <Dropdown.Item href="#/action-3" className="dropdown-item">
                Saved Jobs
              </Dropdown.Item>
            </Link>
            <Link className="dropdown-link" to="/users-CV">
              <Dropdown.Item href="#/action-3" className="dropdown-item">
                My CVs
              </Dropdown.Item>
            </Link>
            <Button variant="logout" onClick={handleLogout}>
              Logout
            </Button>
          </>
        ) : (
          <Dropdown.Item href="#/action-1">No user logged in</Dropdown.Item>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
