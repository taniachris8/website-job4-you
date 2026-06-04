import { useState } from "react";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";

import {
  validateLoginField,
  validateLoginForm,
  type LoginField,
  type LoginFieldErrors,
} from "../../utils/loginValidation";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { clearAuthError, loginUser } from "../../store/slices/authSlice";

import { Button } from "../button/Button";
import { ErrorMessage } from "../error-message/ErrorMessage";

interface LoginFormProps {
  onSuccess?: () => void;
  redirectTo?: string;
  showSignupLink?: boolean;
  showForgotPasswordLink?: boolean;
  className?: string;
}

export function LoginForm({
  onSuccess,
  redirectTo,
  showSignupLink = true,
  showForgotPasswordLink = true,
  className,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const authError = useAppSelector((state) => state.auth.error);
  const authStatus = useAppSelector((state) => state.auth.status);

  const handleFieldFocus = (field: LoginField) => {
    setFieldErrors((prevErrors) => {
      if (!prevErrors[field]) {
        return prevErrors;
      }

      const nextErrors = { ...prevErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleFieldChange =
    (field: LoginField) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;

      if (field === "email") {
        setEmail(value);
      } else {
        setPassword(value);
      }

      dispatch(clearAuthError());
      if (!hasAttemptedSubmit) {
        return;
      }

      setFieldErrors((prevErrors) => {
        const nextErrors = { ...prevErrors };
        const error = validateLoginField(field, value);

        if (error) {
          nextErrors[field] = error;
        } else {
          delete nextErrors[field];
        }

        return nextErrors;
      });
    };

  const resolveRedirectPath = (role?: "admin" | "user") => {
    if (redirectTo) {
      return redirectTo;
    }

    return role === "admin" ? "/jobs" : "/jobs";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authStatus === "loading") {
      return;
    }

    setHasAttemptedSubmit(true);

    const validationErrors = validateLoginForm({ email, password });
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      dispatch(clearAuthError());
      return;
    }

    try {
      const result = await dispatch(loginUser({ email, password })).unwrap();
      setEmail("");
      setPassword("");
      setFieldErrors({});
      setHasAttemptedSubmit(false);

      navigate(resolveRedirectPath(result.user.role));
      onSuccess?.();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit} className={className}>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>כתובת דוא"ל</Form.Label>
        <Form.Control
          type="email"
          placeholder="name@example.com"
          value={email}
          onFocus={() => handleFieldFocus("email")}
          onChange={handleFieldChange("email")}
          isInvalid={hasAttemptedSubmit && Boolean(fieldErrors.email)}
        />
        <Form.Control.Feedback type="invalid">
          {fieldErrors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>סיסמה</Form.Label>
        <Form.Control
          type="password"
          placeholder="הכנס את הסיסמה שלך"
          value={password}
          onFocus={() => handleFieldFocus("password")}
          onChange={handleFieldChange("password")}
          isInvalid={hasAttemptedSubmit && Boolean(fieldErrors.password)}
        />
        <Form.Control.Feedback type="invalid">
          {fieldErrors.password}
        </Form.Control.Feedback>
      </Form.Group>

      {authError ? (
        <ErrorMessage title={authError} message="" compact />
      ) : null}

      <Button
        variant="primary"
        type="submit"
        disabled={authStatus === "loading"}>
        {authStatus === "loading" ? "מתחבר..." : "להתחבר"}
      </Button>
      {showForgotPasswordLink && (
        <Link className="forgot-password-link" to="/password-recovery">
          שכחת סיסמה?
        </Link>
      )}
      {showSignupLink && (
        <div className="signup-link">
          <p className="signup-prg">אם עדיין אין לך חשבון</p>
          <Link to="/registration">להירשם</Link>
        </div>
      )}
    </Form>
  );
}
