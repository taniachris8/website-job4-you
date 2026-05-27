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
      setError("Please enter the email address associated with your account.");
      setIsSubmitted(false);
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError("Please enter a valid email address.");
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
          defaultMessage: "We could not start the recovery process. Please try again."
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
            <p className="reset-password-eyebrow">Password recovery</p>
            <h1 className="reset-password-title">Reset your password</h1>
            <p className="reset-password-subtitle">
              Enter the email address associated with your account and we will
              help you continue the recovery process.
            </p>
            {isSubmitted ? (
              <Alert variant="success" className="password-recovery-alert">
                If an account exists for this email address, we sent password
                reset instructions.
              </Alert>
            ) : null}

            <div className="reset-password-input-wrapper">
              <div className="reset-password-field">
                <label className="reset-password-label" htmlFor="recovery-email">
                  Email address
                </label>
                <InputGroup className="reset-password-group">
                  <Form.Control
                    id="recovery-email"
                    type="email"
                    placeholder="Enter your email address"
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
                Reset
              </Button>
            </div>

            <Link to="/login" className="back-to-login-link">
              Back to Login
            </Link>
          </div>

          <aside className="password-recovery-side-panel">
            <p className="password-recovery-side-eyebrow">Need quick access?</p>
            <h2 className="password-recovery-side-title">
              We will help you get back into your account safely
            </h2>
            <p className="password-recovery-side-subtitle">
              Use the same email address you signed up with so the recovery flow
              can continue smoothly and securely.
            </p>
            <div className="password-recovery-points">
              <div className="password-recovery-point">
                <i className="fa-solid fa-check recovery-check-icon"></i>
                <p className="password-recovery-point-text">
                  Quick and simple recovery process
                </p>
              </div>
              <div className="password-recovery-point">
                <i className="fa-solid fa-check recovery-check-icon"></i>
                <p className="password-recovery-point-text">
                  Secure access back to your account
                </p>
              </div>
              <div className="password-recovery-point">
                <i className="fa-solid fa-check recovery-check-icon"></i>
                <p className="password-recovery-point-text">
                  A cleaner path back to your saved jobs and activity
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
