import { useState } from "react";
import { InputGroup } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Link } from "react-router-dom";

import { Button } from "../../components/button/Button";

import "./PasswordRecoveryPage.css";

export function PasswordRecoveryPage() {
  const [email, setEmail] = useState<string>("");

  const handleResetPassword = () => {};

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
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </InputGroup>
              </div>

              <Button variant="reset" onClick={handleResetPassword}>
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
