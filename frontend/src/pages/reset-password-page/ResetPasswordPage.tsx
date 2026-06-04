import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Cookies from "js-cookie";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  TOKEN_TYPE_COOKIE,
} from "../../axios/axiosConfig";
import { Button } from "../../components/button/Button";
import { ErrorMessage } from "../../components/error-message/ErrorMessage";
import { API_URL } from "../../consts/general";
import { ApiService } from "../../services/ApiService";
import { getApiErrorMessage } from "../../utils/apiError";

import "../password-recovery-page/PasswordRecoveryPage.css";
import "./ResetPasswordPage.css";

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token")?.trim() ?? "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const validateForm = () => {
    if (!token) {
      return "קישור האיפוס חסר אסימון אימות. בקשו אימייל חדש לאיפוס הסיסמה.";
    }

    if (password.length < 8) {
      return "הסיסמה החדשה חייבת לכלול לפחות 8 תווים.";
    }

    if (password !== confirmPassword) {
      return "הסיסמאות אינן תואמות.";
    }

    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSubmitted(true);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const apiService = new ApiService(API_URL);
      await apiService.resetPassword({
        token,
        password,
        confirmPassword,
      });
      Cookies.remove("user");
      Cookies.remove(ACCESS_TOKEN_COOKIE);
      Cookies.remove(REFRESH_TOKEN_COOKIE);
      Cookies.remove(TOKEN_TYPE_COOKIE);
      setIsCompleted(true);
      navigate("/login", {
        replace: true,
        state: {
          message: "הסיסמה שלך אופסה בהצלחה. ניתן להתחבר כעת."
        }
      });
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, {
          badRequestMessage: "קישור האיפוס אינו תקין או שפג תוקפו. בקשו אימייל חדש ונסו שוב.",
          defaultMessage: "לא הצלחנו לאפס את הסיסמה שלך. אנא נסו שוב."
        }),
      );
      setIsCompleted(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="reset-password-container">
      <div className="password-recovery-shell">
        <div className="recovery-password-wrapper">
          <p className="reset-password-eyebrow">בחירת סיסמה חדשה</p>
          <h1 className="reset-password-title">יצירת סיסמה חדשה</h1>
          <p className="reset-password-subtitle">
            הזינו סיסמה חדשה לחשבון שלכם. לאחר השמירה, ההתחברויות הקודמות
            שלכם לא יהיו תקפות יותר.
          </p>
          {isCompleted ? (
            <Alert variant="success" className="password-recovery-alert">
              הסיסמה עודכנה בהצלחה. מעבירים אתכם להתחברות.
            </Alert>
          ) : null}
          <Form noValidate onSubmit={handleSubmit} className="reset-password-input-wrapper">
            <div className="reset-password-field">
              <label className="reset-password-label" htmlFor="reset-password">
                סיסמה חדשה
              </label>
              <InputGroup className="reset-password-group">
                <Form.Control
                  id="reset-password"
                  type="password"
                  placeholder="הזינו סיסמה חדשה"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  isInvalid={hasSubmitted && password.length > 0 && password.length < 8}
                />
              </InputGroup>
            </div>

            <div className="reset-password-field">
              <label
                className="reset-password-label"
                htmlFor="reset-password-confirm">
                אימות סיסמה
              </label>
              <InputGroup className="reset-password-group">
                <Form.Control
                  id="reset-password-confirm"
                  type="password"
                  placeholder="הזינו שוב את הסיסמה החדשה"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  isInvalid={
                    hasSubmitted &&
                    confirmPassword.length > 0 &&
                    password !== confirmPassword
                  }
                />
              </InputGroup>
            </div>

            {error ? (
              <ErrorMessage
                message={error}
                compact
                className="password-recovery-error"
              />
            ) : null}

            <Button variant="reset" type="submit" disabled={isLoading}>
              שמירת הסיסמה החדשה
            </Button>
          </Form>

          <Link to="/password-recovery" className="back-to-login-link">
            בקשת קישור איפוס חדש
          </Link>
        </div>

        <aside className="password-recovery-side-panel">
          <p className="password-recovery-side-eyebrow">עדכון אבטחה</p>
          <h2 className="password-recovery-side-title">
            מסיימים את השחזור עם סיסמה חדשה
          </h2>
          <p className="password-recovery-side-subtitle">
            השתמשו בסיסמה שאינכם משתמשים בה באתרים אחרים. לאחר האיפוס, התחברו
            שוב עם הסיסמה החדשה.
          </p>
          <div className="password-recovery-points">
            <div className="password-recovery-point">
              <i className="fa-solid fa-check recovery-check-icon"></i>
              <p className="password-recovery-point-text">
                קישורי איפוס פגים אוטומטית מטעמי אבטחה
              </p>
            </div>
            <div className="password-recovery-point">
              <i className="fa-solid fa-check recovery-check-icon"></i>
              <p className="password-recovery-point-text">
                התחברויות פעילות קודמות מבוטלות לאחר שינוי הסיסמה
              </p>
            </div>
            <div className="password-recovery-point">
              <i className="fa-solid fa-check recovery-check-icon"></i>
              <p className="password-recovery-point-text">
                אם הקישור כבר לא עובד, ניתן לבקש קישור חדש
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
