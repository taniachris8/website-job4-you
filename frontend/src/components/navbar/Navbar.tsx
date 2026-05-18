import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

import { useAppSelector } from "../../store/hooks";
import { useTheme } from "../../contexts/ThemeContext";

import { ApplyForm } from "../apply-form/ApplyForm";
import { UsefulToolsDropdown } from "../useful-tools/UsefulToolsDropdown";
import { DropdownUser } from "../user/dropdown-user/DropdownUser";

import "./Navbar.css";

export function Navbar() {
  const [click, setClick] = useState(false);
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [showApplySuccess, setShowApplySuccess] = useState(false);
  const [showDropdownUser, setShowDropdownUser] = useState(false);
  const [showUsefulToolsDropdown, setShowUsefulToolsDropdown] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const user = useAppSelector((state) => state.auth.user);
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const userIconRef = useRef<HTMLButtonElement | null>(null);
  const isHomePage = location.pathname === "/";

  const handleCloseModal = () => setShowApplyForm(false);
  const handleShowModal = () => {
    setShowApplySuccess(false);
    setShowApplyForm(true);
  };
  const handleClick = () => setClick((prev) => !prev);
  const closeMobileMenu = () => setClick(false);

  useEffect(() => {
    if (!click) {
      setShowUsefulToolsDropdown(false);
    }
  }, [click]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoginRedirect = () => {
    closeMobileMenu();

    if (!user) {
      navigate("/login");
      return;
    }

    setShowDropdownUser(true);
  };

  const handleToggleDropdownUser = (isOpen: boolean) =>
    setShowDropdownUser(isOpen);

  const handleToggleUsefulToolsDropdown = (isOpen: boolean) => {
    setShowUsefulToolsDropdown(isOpen);
  };

  return (
    <>
      <nav
        className={`navbar ${isHomePage ? "navbar-overlay" : ""} ${
          isScrolled ? "is-scrolled" : ""
        }`.trim()}
        aria-label="Main navigation">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand" onClick={closeMobileMenu}>
            <span className="logo-container">
              <img className="navbar-logo" alt="Job4You logo" src="logo-job1.webp" />
            </span>
          </Link>

          <button
            type="button"
            className="menu-icon"
            onClick={handleClick}
            aria-expanded={click}
            aria-controls="primary-navigation"
            aria-label={click ? "Close navigation menu" : "Open navigation menu"}>
            <i className={click ? "fas fa-times" : "fas fa-bars"} aria-hidden="true" />
          </button>

          <div className={click ? "nav-panel active" : "nav-panel"}>
            <ul
              id="primary-navigation"
              className={click ? "nav-menu active" : "nav-menu"}>
              <li className="nav-item">
                <Link
                  to="/about-company"
                  className="nav-links"
                  onClick={closeMobileMenu}>
                  פרופיל החברה
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/jobs" className="nav-links" onClick={closeMobileMenu}>
                  דרושים
                </Link>
              </li>
              <li className="nav-item nav-item-tools">
                <div className="nav-tools">
                  <button
                    type="button"
                    className="nav-links nav-links-button"
                    onClick={() =>
                      handleToggleUsefulToolsDropdown(!showUsefulToolsDropdown)
                    }
                    aria-expanded={showUsefulToolsDropdown}
                    aria-haspopup="menu">
                    <span className="nav-links-with-dropdown">כלים שימושים למועמד</span>
                    <i
                      className={
                        showUsefulToolsDropdown
                          ? "fa-solid fa-chevron-up nav-caret"
                          : "fa-solid fa-chevron-down nav-caret"
                      }
                      aria-hidden="true"
                    />
                  </button>
                  <UsefulToolsDropdown
                    showUsefulToolsDropdown={showUsefulToolsDropdown}
                    onToggle={handleToggleUsefulToolsDropdown}
                  />
                </div>
              </li>
              {user?.role !== "admin" && (
                <li className="nav-item">
                  <Link
                    to="/users-CV"
                    className="nav-links"
                    onClick={closeMobileMenu}>
                    כתיבת קורות חיים
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className="nav-icons">
            <button
              type="button"
              className="nav-icon-button nav-theme-toggle"
              onClick={toggleTheme}
              aria-label={
                theme === "dark" ? "Switch to light theme" : "Switch to dark theme"
              }
              aria-pressed={theme === "dark"}>
              <i
                className={
                  theme === "dark"
                    ? "fa-solid fa-sun style-icon-theme"
                    : "fa-solid fa-moon style-icon-theme"
                }
                aria-hidden="true"></i>
            </button>

            {user?.role !== "admin" && (
              <>
                <button
                  type="button"
                  className="nav-icon-button"
                  onClick={handleShowModal}
                  aria-label="Open application form">
                  <i
                    className="fa-solid fa-envelope style-icon-envelope"
                    aria-hidden="true"></i>
                </button>

                <ApplyForm
                  showApplyForm={showApplyForm}
                  onHide={handleCloseModal}
                  onSuccess={() => setShowApplySuccess(true)}
                />
              </>
            )}

            <div className="nav-user-menu">
              <button
                type="button"
                className="nav-icon-button nav-user-button"
                onClick={handleLoginRedirect}
                ref={userIconRef}
                aria-label={user ? "Open user menu" : "Go to login"}>
                <i
                  className="fa-solid fa-user style-icon-user"
                  aria-hidden="true"></i>
              </button>
              <DropdownUser
                showDropdownUser={showDropdownUser}
                onToggle={handleToggleDropdownUser}
                iconRef={userIconRef}
              />
            </div>
          </div>
        </div>
      </nav>
      {showApplySuccess ? (
        <div className="navbar-form-alert-shell">
          <Alert
            variant="success"
            dismissible
            onClose={() => setShowApplySuccess(false)}
            className="navbar-form-alert">
            הפנייה נשלחה בהצלחה. נחזור אליך בהקדם.
          </Alert>
        </div>
      ) : null}
    </>
  );
}
