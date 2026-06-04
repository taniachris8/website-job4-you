import { useState } from "react";
import Alert from "react-bootstrap/Alert";
import { InputGroup } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Button } from "../../components/button/Button";
import { ErrorMessage } from "../../components/error-message/ErrorMessage";
import { API_URL } from "../../consts/general";
import { ApiService } from "../../services/ApiService";
import { getApiErrorMessage } from "../../utils/apiError";

import "./PasswordRecoveryPage.css";

export function PasswordRecoveryPage() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  const handleResetPassword = async () => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      setError("יש להזין את כתובת האימייל המשויכת לחשבון שלך.");
      setIsSubmitted(false);
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("יש להזין כתובת אימייל תקינה.");
      setIsSubmitted(false);
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const apiService = new ApiService(API_URL);
      await apiService.forgotPassword(trimmedEmail);
      setIsSubmitted(true);
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, {
          defaultMessage: "לא הצלחנו להתחיל את תהליך שחזור הסיסמה. אנא נסו שוב."
        }),
      );
      setIsSubmitted(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="reset-password-container">
        <div className="password-recovery-shell">
          <div className="recovery-password-wrapper">
            <p className="reset-password-eyebrow">שחזור סיסמה</p>
            <h1 className="reset-password-title">איפוס הסיסמה שלך</h1>
            <p className="reset-password-subtitle">
              הזינו את כתובת האימייל המשויכת לחשבון שלכם ונעזור לכם להמשיך
              בתהליך השחזור.
            </p>
            {isSubmitted ? (
              <Alert variant="success" className="password-recovery-alert">
                אם קיים חשבון עבור כתובת האימייל הזו, שלחנו הנחיות לאיפוס
                הסיסמה.
              </Alert>
            ) : null}

            <div className="reset-password-input-wrapper">
              <div className="reset-password-field">
                <label className="reset-password-label" htmlFor="recovery-email">
                  כתובת אימייל
                </label>
                <InputGroup className="reset-password-group">
                  <Form.Control
                    id="recovery-email"
                    type="email"
                    placeholder="הזינו את כתובת האימייל שלכם"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
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

              <Button
                variant="reset"
                onClick={handleResetPassword}
                disabled={isLoading}>
                איפוס סיסמה
              </Button>
            </div>

            <Link to="/login" className="back-to-login-link">
              חזרה להתחברות
            </Link>
          </div>

          <aside className="password-recovery-side-panel">
            <p className="password-recovery-side-eyebrow">צריכים גישה מהירה?</p>
            <h2 className="password-recovery-side-title">
              נעזור לכם לחזור לחשבון שלכם בצורה בטוחה
            </h2>
            <p className="password-recovery-side-subtitle">
              השתמשו באותה כתובת אימייל שאיתה נרשמתם, כדי שתהליך השחזור ימשיך
              בצורה חלקה ומאובטחת.
            </p>
            <div className="password-recovery-points">
              <div className="password-recovery-point">
                <i className="fa-solid fa-check recovery-check-icon"></i>
                <p className="password-recovery-point-text">
                  תהליך שחזור מהיר ופשוט
                </p>
              </div>
              <div className="password-recovery-point">
                <i className="fa-solid fa-check recovery-check-icon"></i>
                <p className="password-recovery-point-text">
                  חזרה מאובטחת לחשבון שלכם
                </p>
              </div>
              <div className="password-recovery-point">
                <i className="fa-solid fa-check recovery-check-icon"></i>
                <p className="password-recovery-point-text">
                  חזרה נוחה למשרות ששמרתם ולפעילות שלכם באתר
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
