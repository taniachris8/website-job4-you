import { useLocation, useNavigate } from "react-router-dom";
import Alert from "react-bootstrap/Alert";

import { useAppDispatch } from "../../store/hooks";
import { clearAuthError } from "../../store/slices/authSlice";

import { Button } from "../../components/button/Button";
import { LoginForm } from "../../components/login-form/LoginForm";

import "./LoginPage.css";

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage =
    typeof location.state?.message === "string" ? location.state.message : "";

  const handleRedirect = () => {
    dispatch(clearAuthError());
    navigate("/registration");
  };

  return (
    <section className="login-container">
      <div className="login-page-shell">
        <div className="form-container">
          <div className="login-form-card">
            <p className="login-eyebrow">כניסה למערכת</p>
            <h1 className="login-title">התחברות</h1>
            <p className="login-subtitle">
              התחברו לחשבון שלכם כדי לנהל מועמדויות, לשמור משרות ולעקוב אחרי
              הפעילות שלכם במקום אחד.
            </p>
            {successMessage ? (
              <Alert variant="success" className="login-success-alert">
                {successMessage}
              </Alert>
            ) : null}
            <LoginForm showSignupLink={false} className="login-form-fields" />
          </div>
        </div>

        <aside className="redirect-to-signup-container">
          <div className="signup-panel">
            <p className="signup-eyebrow">חדש כאן?</p>
            <h2 className="signup-title">אם עדיין אין לך חשבון</h2>
            <p className="signup-subtitle">
              פתיחת חשבון מאפשרת לך לנהל את תהליך החיפוש בצורה מסודרת, לשמור
              משרות רלוונטיות ולהישאר מחובר להזדמנויות חדשות.
            </p>
            <div className="prg-wrapper">
              <div className="check">
                <i className="fa-solid fa-check prg-check"></i>
                <p className="prg">נהל את פרטי החשבון שלך</p>
              </div>
              <div className="check">
                <i className="fa-solid fa-check prg-check"></i>
                <p className="prg">הוסף פוסטים לרשימת משרות</p>
              </div>
              <div className="check">
                <i className="fa-solid fa-check prg-check"></i>
                <p className="prg">שמור איתנו על קשר</p>
              </div>
            </div>
            <Button variant="secondary" onClick={handleRedirect}>
              להירשם
            </Button>
          </div>
        </aside>
      </div>
    </section>
  );
}
