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
      return "This reset link is missing a token. Request a new password reset email.";
    }

    if (password.length < 8) {
      return "Your new password must be at least 8 characters long.";
    }

    if (password !== confirmPassword) {
      return "Passwords do not match.";
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
          message: "Your password has been reset. You can now sign in."
        }
      });
    } catch (requestError) {
      setError(
        getApiErrorMessage(requestError, {
          badRequestMessage: "Reset link is invalid or has expired. Request a new email and try again.",
          defaultMessage: "We could not reset your password. Please try again."
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
          <p className="reset-password-eyebrow">Choose a new password</p>
          <h1 className="reset-password-title">Create your new password</h1>
          <p className="reset-password-subtitle">
            Enter a new password for your account. Once saved, your previous
            sessions will no longer be valid.
          </p>
          {isCompleted ? (
            <Alert variant="success" className="password-recovery-alert">
              Your password has been updated. Redirecting you to login.
            </Alert>
          ) : null}
          <Form noValidate onSubmit={handleSubmit} className="reset-password-input-wrapper">
            <div className="reset-password-field">
              <label className="reset-password-label" htmlFor="reset-password">
                New password
              </label>
              <InputGroup className="reset-password-group">
                <Form.Control
                  id="reset-password"
                  type="password"
                  placeholder="Enter a new password"
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
                Confirm password
              </label>
              <InputGroup className="reset-password-group">
                <Form.Control
                  id="reset-password-confirm"
                  type="password"
                  placeholder="Repeat your new password"
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
              Save new password
            </Button>
          </Form>

          <Link to="/password-recovery" className="back-to-login-link">
            Request a new reset link
          </Link>
        </div>

        <aside className="password-recovery-side-panel">
          <p className="password-recovery-side-eyebrow">Security update</p>
          <h2 className="password-recovery-side-title">
            Finish recovery with a fresh password
          </h2>
          <p className="password-recovery-side-subtitle">
            Use a password you do not reuse elsewhere. After the reset, sign in
            again with the new password.
          </p>
          <div className="password-recovery-points">
            <div className="password-recovery-point">
              <i className="fa-solid fa-check recovery-check-icon"></i>
              <p className="password-recovery-point-text">
                Reset links expire automatically for safety
              </p>
            </div>
            <div className="password-recovery-point">
              <i className="fa-solid fa-check recovery-check-icon"></i>
              <p className="password-recovery-point-text">
                Old active sessions are revoked after the password change
              </p>
            </div>
            <div className="password-recovery-point">
              <i className="fa-solid fa-check recovery-check-icon"></i>
              <p className="password-recovery-point-text">
                If the link no longer works, request a new one
              </p>
            </div>
          </div>
        </aside>
      </div>
    </section>
  );
}
