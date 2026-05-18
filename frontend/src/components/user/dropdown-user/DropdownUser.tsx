import Dropdown from "react-bootstrap/Dropdown";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../../button/Button";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { logoutUser } from "../../../store/slices/authSlice";

import "./DropdownUser.css";

interface DropdownUserProps {
  showDropdownUser?: boolean;
  onToggle?: (show: boolean) => void;
  iconRef?: React.RefObject<HTMLElement | null>;
}

export function DropdownUser({
  showDropdownUser,
  onToggle,
}: DropdownUserProps) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    void dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <Dropdown
      className="dropdown-user-root"
      show={showDropdownUser}
      onToggle={onToggle}>
      <Dropdown.Menu className="dropdown-menu dropdown-menu-user">
        {user ? (
          <>
            <div className="dropdown-user-summary">
              <span className="dropdown-user-label">Account</span>
              <span className="dropdown-user-name">
                {user.name} {user.familyName}
                {user.role === "admin" ? " (Admin)" : ""}
              </span>
            </div>

            <div className="dropdown-user-links">
              {user.role !== "admin" && (
                <Dropdown.Item
                  as={Link}
                  className="dropdown-menu-link"
                  to="/users-settings">
                  Settings
                </Dropdown.Item>
              )}

              <Dropdown.Item
                as={Link}
                className="dropdown-menu-link"
                to="/users-savedJobs">
                Saved Jobs
              </Dropdown.Item>

              {user.role !== "admin" && (
                <Dropdown.Item
                  as={Link}
                  className="dropdown-menu-link"
                  to="/users-CV">
                  My CVs
                </Dropdown.Item>
              )}
            </div>

            <div className="dropdown-user-actions">
              <Button variant="logout" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </>
        ) : (
          <div className="dropdown-user-empty">No user logged in</div>
        )}
      </Dropdown.Menu>
    </Dropdown>
  );
}
