import { useRef, useState } from "react";

import {
  type ContactFormErrors,
  type ContactFormField,
  type ContactFormValues,
  trimContactFormValues,
  validateContactField,
  validateContactForm,
} from "../../utils/contactFormValidation";

import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { Button } from "../button/Button";

import "./ApplyForm.css";

export function ApplyForm({
  onHide,
  showApplyForm,
  handleCloseModal,
}: {
  onHide: () => void;
  showApplyForm?: boolean;
  handleCloseModal?: () => void;
}) {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [formValues, setFormValues] = useState<ContactFormValues>({
    userName: "",
    userEmail: "",
    userPhone: "",
    message: "",
    privacyConsent: false,
  });
  const [formErrors, setFormErrors] = useState<ContactFormErrors>({});
  const form = useRef<HTMLFormElement | null>(null);

  void cvFile;
  void handleCloseModal;
  void form;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setCvFile(file ?? null);
  };

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setHasAttemptedSubmit(true);

    const trimmedValues = trimContactFormValues(formValues);
    const validationErrors = validateContactForm(trimmedValues);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormValues(trimmedValues);
    setFormErrors({});
    setHasAttemptedSubmit(false);
    onHide();
  };

  return (
    <Modal
      show={showApplyForm}
      onHide={onHide}
      centered
      dialogClassName="apply-form-modal">
      <Modal.Header closeButton className="apply-form-header">
        <div className="apply-form-header-content">
          <p className="apply-form-badge">הגשת מועמדות</p>
          <Modal.Title>צור קשר</Modal.Title>
          <p className="apply-form-intro">
            מלא את הטופס או שלח דוא&quot;ל ישירות אל: limor@job4you.co.il
          </p>
        </div>
      </Modal.Header>
      <Modal.Body className="apply-form-body">
        <Form ref={form} noValidate onSubmit={handleSubmit} className="apply-form-layout">
          <div className="apply-form-grid">
            <Form.Group className="apply-form-field" controlId="applyFormName">
              <Form.Label>השם</Form.Label>
              <Form.Control
                type="text"
                name="user_name"
                placeholder="השם שלך"
                autoFocus
                value={formValues.userName}
                onFocus={() => handleFieldFocus("userName")}
                onChange={handleFieldChange("userName")}
                isInvalid={hasAttemptedSubmit && Boolean(formErrors.userName)}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.userName}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="apply-form-field" controlId="applyFormPhone">
              <Form.Label>טלפון (אופציונלי)</Form.Label>
              <Form.Control
                type="text"
                name="user_phone"
                placeholder="050 000 00 00 or +1 555 123 4567"
                value={formValues.userPhone}
                onFocus={() => handleFieldFocus("userPhone")}
                onChange={handleFieldChange("userPhone")}
                isInvalid={hasAttemptedSubmit && Boolean(formErrors.userPhone)}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.userPhone}
              </Form.Control.Feedback>
            </Form.Group>
          </div>

          <Form.Group className="apply-form-field" controlId="applyFormEmail">
            <Form.Label>כתובת דוא&quot;ל</Form.Label>
            <Form.Control
              type="email"
              name="user_email"
              placeholder="name@example.com"
              value={formValues.userEmail}
              onFocus={() => handleFieldFocus("userEmail")}
              onChange={handleFieldChange("userEmail")}
              isInvalid={hasAttemptedSubmit && Boolean(formErrors.userEmail)}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.userEmail}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="apply-form-upload" controlId="formCv">
            <Form.Label>קורות חיים</Form.Label>
            <Form.Control
              type="file"
              className="apply-form-file-input"
              onChange={handleFileChange}
              accept=".doc,.docx,.pdf"
            />
          </Form.Group>

          <Form.Group className="apply-form-field" controlId="applyFormMessage">
            <Form.Label>תגובה</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="message"
              value={formValues.message}
              onFocus={() => handleFieldFocus("message")}
              onChange={handleFieldChange("message")}
              isInvalid={hasAttemptedSubmit && Boolean(formErrors.message)}
            />
            <Form.Control.Feedback type="invalid">
              {formErrors.message}
            </Form.Control.Feedback>
          </Form.Group>

          <div className="apply-form-footer">
            <Form.Group className="apply-form-consent" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                checked={formValues.privacyConsent}
                onChange={handleConsentChange}
                label="מאשר/ת את מדיניות הפרטיות כולל קבלת הצעות עבודה ו/או הצעות"
                isInvalid={
                  hasAttemptedSubmit && Boolean(formErrors.privacyConsent)
                }
              />
              {hasAttemptedSubmit && formErrors.privacyConsent ? (
                <p className="apply-form-consent-error">
                  {formErrors.privacyConsent}
                </p>
              ) : null}
            </Form.Group>
            <Button variant="primary" type="submit">
              שליחה
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
