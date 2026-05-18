import { useRef, useState } from "react";

import Alert from "react-bootstrap/Alert";
import { Button } from "../button/Button";
import Form from "react-bootstrap/Form";
import {
  getFormSubmissionErrorMessage,
  submitContactForm,
} from "../../api/formsApi";
import {
  type ContactFormErrors,
  type ContactFormField,
  type ContactFormValues,
  trimContactFormValues,
  validateContactField,
  validateContactForm,
} from "../../utils/contactFormValidation";

import "./ContactUsForm.css";

export function ContactUsForm() {
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [formValues, setFormValues] = useState<ContactFormValues>({
    userName: "",
    userPhone: "",
    userEmail: "",
    message: "",
    privacyConsent: false,
  });
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});
  const form = useRef<HTMLFormElement | null>(null);

  const handleFieldChange =
    (field: ContactFormField) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { value } = event.target;

      setFormValues((currentValues) => ({
        ...currentValues,
        [field]: value,
      }));

      if (!hasAttemptedSubmit) {
        return;
      }

      setFormErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        const error = validateContactField(field, value);

        if (error) {
          nextErrors[field] = error;
        } else {
          delete nextErrors[field];
        }

        return nextErrors;
      });
    };

  const handleFieldFocus = (field: ContactFormField) => {
    setFormErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
  };

  const handleConsentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      privacyConsent: checked,
    }));

    if (!hasAttemptedSubmit) {
      return;
    }

    setFormErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };
      const error = validateContactField("privacyConsent", String(checked));

      if (error) {
        nextErrors.privacyConsent = error;
      } else {
        delete nextErrors.privacyConsent;
      }

      return nextErrors;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasAttemptedSubmit(true);
    setShowAlert(false);
    setShowErrorAlert(false);
    setSubmitErrorMessage("");

    const trimmedValues = trimContactFormValues(formValues);
    const validationErrors = validateContactForm(trimmedValues);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setShowErrorAlert(true);
      return;
    }

    setFormValues(trimmedValues);
    setFormErrors({});

    try {
      setIsSubmitting(true);
      await submitContactForm(trimmedValues);
      setFormValues({
        userName: "",
        userPhone: "",
        userEmail: "",
        message: "",
        privacyConsent: false,
      });
      setHasAttemptedSubmit(false);
      setShowAlert(true);
    } catch (error) {
      setSubmitErrorMessage(getFormSubmissionErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="request-form-container">
      <div className="request-form-shell">
        <div className="request-form-header">
          <h1 className="request-form-hdr">צור קשר</h1>
          <p className="request-form-prg">
            נשמח לשמוע ממך ולחזור אליך בהקדם עם מענה מתאים.
          </p>
        </div>
        <Form
          ref={form}
          className="contact-form-styles"
          noValidate
          onSubmit={handleSubmit}>
          <div className="input-group">
            <div className="input-container">
              <Form.Control
                type="text"
                name="user_name"
                id="name"
                className="input name-input"
                placeholder="שם"
                onFocus={() => handleFieldFocus("userName")}
                onChange={handleFieldChange("userName")}
                value={formValues.userName}
                isInvalid={hasAttemptedSubmit && Boolean(formErrors.userName)}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.userName}
              </Form.Control.Feedback>
            </div>
            <div className="input-container">
              <Form.Control
                type="text"
                id="phone"
                name="user_phone"
                placeholder="טלפון (אופציונלי)"
                value={formValues.userPhone}
                onFocus={() => handleFieldFocus("userPhone")}
                onChange={handleFieldChange("userPhone")}
                className="input phone-input"
                isInvalid={hasAttemptedSubmit && Boolean(formErrors.userPhone)}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.userPhone}
              </Form.Control.Feedback>
            </div>
          </div>
          <div className="input-container">
            <Form.Control
              type="email"
              id="email"
              name="email"
              value={formValues.userEmail}
              placeholder='כתובת הדוא"ל שלך'
              onFocus={() => handleFieldFocus("userEmail")}
              onChange={handleFieldChange("userEmail")}
              className="input email-input"
              isInvalid={hasAttemptedSubmit && Boolean(formErrors.userEmail)}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.userEmail}
            </Form.Control.Feedback>
          </div>
          <div className="input-container">
            <Form.Control
              as="textarea"
              rows={3}
              id="message"
              name="message"
              value={formValues.message}
              placeholder="הודעה"
              onFocus={() => handleFieldFocus("message")}
              onChange={handleFieldChange("message")}
              className="input message-input"
              isInvalid={hasAttemptedSubmit && Boolean(formErrors.message)}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.message}
            </Form.Control.Feedback>
          </div>
          <Form.Group
            className="privacy-group"
            controlId="contactFormPrivacyConsent">
            <Form.Check
              type="checkbox"
              checked={formValues.privacyConsent}
              onChange={handleConsentChange}
              label="מאשר/ת את מדיניות הפרטיות כולל קבלת הצעות עבודה ו/או הצעות"
              isInvalid={hasAttemptedSubmit && Boolean(formErrors.privacyConsent)}
            />
            {hasAttemptedSubmit && formErrors.privacyConsent ? (
              <p className="privacy-error">{formErrors.privacyConsent}</p>
            ) : null}
          </Form.Group>
          <div className="contact-form-actions">
            <Button variant="primary" type="submit" value="Send" disabled={isSubmitting}>
              {isSubmitting ? "שולח..." : "צור קשר"}
            </Button>
          </div>
        </Form>
        <Alert
          variant="success"
          show={showAlert}
          onClose={() => setShowAlert(false)}
          dismissible
          className="success-alert-message">
          <p className="alert-message-prg">
            ההודעה נשלחה בהצלחה. נחזור אליך בהקדם.
          </p>
        </Alert>
        <Alert
          variant="danger"
          show={showErrorAlert}
          onClose={() => setShowErrorAlert(false)}
          dismissible
          className="error-alert-message">
          <p className="alert-message-prg">
            יש לתקן את השדות המסומנים לפני שליחת הטופס.
          </p>
        </Alert>
        <Alert
          variant="danger"
          show={Boolean(submitErrorMessage)}
          onClose={() => setSubmitErrorMessage("")}
          dismissible
          className="error-alert-message">
          <p className="alert-message-prg">{submitErrorMessage}</p>
        </Alert>
      </div>
    </div>
  );
}
