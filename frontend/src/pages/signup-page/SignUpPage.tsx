import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Link, useNavigate } from "react-router-dom";

import type { AxiosError } from "axios";

import { API_URL } from "../../consts/general";
import { ApiService } from "../../services/ApiService";

import { Button } from "../../components/button/Button";
import { Alerts } from "../../components/alerts/Alerts";
import { ErrorMessage } from "../../components/error-message/ErrorMessage";
import { getApiErrorMessage } from "../../utils/apiError";

import "./SignUp.css";

type SignUpField =
  | "name"
  | "familyName"
  | "email"
  | "password"
  | "confirmedPassword";

type SignUpFormData = Record<SignUpField, string>;
type SignUpErrors = Partial<Record<SignUpField, string>>;

interface ApiErrorResponse {
  error?: {
    message?: string;
    code?: string;
  };
}

const initialFormData: SignUpFormData = {
  name: "",
  familyName: "",
  email: "",
  password: "",
  confirmedPassword: "",
};

const namePattern = /^[\p{L}]+(?:[ -][\p{L}]+)*$/u;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function SignUpPage() {
  const [formData, setFormData] = useState<SignUpFormData>(initialFormData);
  const [errors, setErrors] = useState<SignUpErrors>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [showAlert, setShowAlert] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const apiUserService = new ApiService(API_URL);

  useEffect(() => {
    if (showAlert) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showAlert]);

  const validateField = (
    field: SignUpField,
    value: string,
    nextFormData: SignUpFormData,
  ): string => {
    const trimmedValue = value.trim();

    switch (field) {
      case "name":
        if (!trimmedValue) {
          return "יש להזין שם פרטי.";
        }
        if (!namePattern.test(trimmedValue)) {
          return "שם פרטי יכול לכלול אותיות, רווחים ומקפים בלבד.";
        }
        return "";
      case "familyName":
        if (!trimmedValue) {
          return "יש להזין שם משפחה.";
        }
        if (!namePattern.test(trimmedValue)) {
          return "שם משפחה יכול לכלול אותיות, רווחים ומקפים בלבד.";
        }
        return "";
      case "email":
        if (!trimmedValue) {
          return "יש להזין כתובת דוא\"ל.";
        }
        if (!emailPattern.test(trimmedValue)) {
          return "יש להזין כתובת דוא\"ל תקינה.";
        }
        return "";
      case "password":
        if (!value) {
          return "יש להזין סיסמה.";
        }
        return "";
      case "confirmedPassword":
        if (!value) {
          return "יש לאשר את הסיסמה.";
        }
        if (value !== nextFormData.password) {
          return "הסיסמאות אינן תואמות.";
        }
        return "";
      default:
        return "";
    }
  };

  const validateForm = (nextFormData: SignUpFormData): SignUpErrors => {
    const nextErrors: SignUpErrors = {};

    (Object.keys(nextFormData) as SignUpField[]).forEach((field) => {
      const error = validateField(field, nextFormData[field], nextFormData);
      if (error) {
        nextErrors[field] = error;
      }
    });

    return nextErrors;
  };

  const handleFieldChange =
    (field: SignUpField) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const nextFormData = {
        ...formData,
        [field]: value,
      };

      setFormData(nextFormData);
      setSubmitError("");

      if (!hasAttemptedSubmit) {
        return;
      }

      setErrors((prevErrors) => {
        const nextErrors = { ...prevErrors };
        const fieldError = validateField(field, value, nextFormData);

        if (fieldError) {
          nextErrors[field] = fieldError;
        } else {
          delete nextErrors[field];
        }

        if (field === "password" || field === "confirmedPassword") {
          const confirmPasswordError = validateField(
            "confirmedPassword",
            nextFormData.confirmedPassword,
            nextFormData,
          );

          if (confirmPasswordError) {
            nextErrors.confirmedPassword = confirmPasswordError;
          } else {
            delete nextErrors.confirmedPassword;
          }
        }

        return nextErrors;
      });
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) {
      return;
    }

    setHasAttemptedSubmit(true);

    const trimmedFormData: SignUpFormData = {
      ...formData,
      name: formData.name.trim(),
      familyName: formData.familyName.trim(),
      email: formData.email.trim(),
    };

    const validationErrors = validateForm(trimmedFormData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitError("");
      return;
    }

    const user = {
      name: trimmedFormData.name,
      familyName: trimmedFormData.familyName,
      email: trimmedFormData.email,
      password: trimmedFormData.password,
      role: "user" as const,
    };

    try {
      setIsSubmitting(true);
      await apiUserService.registerUser(user);
      setFormData(initialFormData);
      setErrors({});
      setHasAttemptedSubmit(false);
      setSubmitError("");
      setShowAlert(true);
    } catch (error) {
      console.error("Error:", error);
      const apiError = error as AxiosError<ApiErrorResponse>;
      const errorCode = apiError.response?.data?.error?.code;
      const errorMessage = apiError.response?.data?.error?.message;

      if (errorCode === "CONFLICT" && errorMessage === "האימייל כבר קיים") {
        setSubmitError(
          "\u05DB\u05D1\u05E8 \u05E7\u05D9\u05D9\u05DD \u05D7\u05E9\u05D1\u05D5\u05DF \u05E2\u05DD \u05DB\u05EA\u05D5\u05D1\u05EA \u05D4\u05D0\u05D9\u05DE\u05D9\u05D9\u05DC \u05D4\u05D6\u05D5. \u05D4\u05EA\u05D7\u05D1\u05E8\u05D5 \u05D0\u05D5 \u05D4\u05E9\u05EA\u05DE\u05E9\u05D5 \u05D1\u05DB\u05EA\u05D5\u05D1\u05EA \u05D0\u05D7\u05E8\u05EA.",
        );
        return;
      }

      setSubmitError(
        getApiErrorMessage(error, {
          defaultMessage: "\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05E0\u05D5 \u05DC\u05D9\u05E6\u05D5\u05E8 \u05D0\u05EA \u05D4\u05D7\u05E9\u05D1\u05D5\u05DF. \u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1.",
        }),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNavigateToLogin = () => navigate("/login");
  return (
    <>
      <section className="signup-container">
        <div className="signup-page-shell">
          <div className="forms-container">
            <div className="sign-up-form">
              <p className="signup-eyebrow">פתיחת חשבון</p>
              <h1 className="signup-title">הרשמה לאתר</h1>
              <p className="signup-subtitle">
                צרו חשבון אישי כדי לשמור משרות, לנהל את הפרטים שלכם ולעבוד מול
                הפלטפורמה בצורה נוחה ומסודרת.
              </p>
              <div className="signup-benefits">
                <div className="check">
                  <i className="fa-solid fa-check prg-check"></i>
                  <p className="prg">נהל את פרטי החשבון שלך</p>
                </div>
                <div className="check">
                  <i className="fa-solid fa-check prg-check"></i>
                  <p className="prg">הוסף פוסטים לרשימת משאלות</p>
                </div>
                <div className="check">
                  <i className="fa-solid fa-check prg-check"></i>
                  <p className="prg">שמור איתנו על קשר</p>
                </div>
              </div>
              <Alerts
                variant="success"
                alertText={
                  <>
                    הפרופיל נוצר בהצלחה. אנא{" "}
                    <Link className="login-redirect-link" to="/login">
                      התחבר
                    </Link>{" "}
                    כדי להתחיל.
                  </>
                }
                showAlert={showAlert}
              />
              <Form
                noValidate
                onSubmit={handleSubmit}
                className="signup-form-fields">
                <div className="signup-form-grid">
                  <Form.Group className="mb-3" controlId="signUpFirstName">
                    <Form.Label>השם שלך*</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={handleFieldChange("name")}
                      isInvalid={hasAttemptedSubmit && Boolean(errors.name)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="signUpLastName">
                    <Form.Label>שם משפחה*</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.familyName}
                      onChange={handleFieldChange("familyName")}
                      isInvalid={
                        hasAttemptedSubmit && Boolean(errors.familyName)
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.familyName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <Form.Group className="mb-3" controlId="signUpEmail">
                  <Form.Label>כתובת דוא"ל*</Form.Label>
                  <Form.Control
                    type="email"
                    value={formData.email}
                    onChange={handleFieldChange("email")}
                    isInvalid={hasAttemptedSubmit && Boolean(errors.email)}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="signup-form-grid">
                  <Form.Group className="mb-3" controlId="signUpPassword">
                    <Form.Label>סיסמה*</Form.Label>
                    <Form.Control
                      type="password"
                      value={formData.password}
                      onChange={handleFieldChange("password")}
                      isInvalid={hasAttemptedSubmit && Boolean(errors.password)}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group
                    className="mb-3"
                    controlId="signUpConfirmPassword">
                    <Form.Label>אשר את הסיסמה*</Form.Label>
                    <Form.Control
                      type="password"
                      value={formData.confirmedPassword}
                      onChange={handleFieldChange("confirmedPassword")}
                      isInvalid={
                        hasAttemptedSubmit && Boolean(errors.confirmedPassword)
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.confirmedPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <p className="required-note">נדרש*</p>
                {submitError ? (
                  <ErrorMessage message={submitError} compact />
                ) : null}
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                  {isSubmitting ? "יוצר פרופיל..." : "להירשם"}
                </Button>
              </Form>
            </div>
          </div>

          <aside className="signup-support-column">
            <div className="signup-side-panel">
              <p className="signup-side-eyebrow">כבר רשומים?</p>
              <h2 className="signup-side-title">
                אפשר להמשיך ישר לחשבון הקיים
              </h2>
              <p className="signup-side-subtitle">
                אם כבר פתחתם חשבון, התחברו כדי לצפות במשרות ששמרתם, לעקוב אחרי
                הפעילות שלכם ולהמשיך בדיוק מאיפה שעצרתם.
              </p>
              <div className="existing-user-container">
                <p className="existing-user-prg">משתמש קיים?</p>
                <button
                  className="existing-user-btn"
                  onClick={handleNavigateToLogin}>
                  להתחבר
                </button>
              </div>
              <div className="signup-side-note">
                <span className="signup-side-note-title">למה זה משתלם?</span>
                <p className="signup-side-note-text">
                  חשבון אישי עוזר לך לשמור סדר, לחזור למשרות מעניינות ולהישאר
                  מחובר להזדמנויות חדשות.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
