import { useState } from "react";
import type { Job } from "../../../types";

import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

import { domainOptions } from "../../../consts/options/DomainOptions";
import { professionOptions } from "../../../consts/options/ProfessionOptions";
import { areaOptions } from "../../../consts/options/AreaOptions";
import { scopeOptions } from "../../../consts/options/ScopeOptions";

import { Button } from "../../button/Button";

import "./EditJobModalForm.css";

type JobFormField =
  | "jobTitle"
  | "domain"
  | "profession"
  | "area"
  | "scope"
  | "jobNumber"
  | "jobDescription"
  | "jobRequirements";

type JobFormValues = Record<JobFormField, string>;
type JobFormErrors = Partial<Record<JobFormField, string>>;

const requiredMessages: Record<JobFormField, string> = {
  jobTitle: "נא להזין כותרת משרה",
  domain: "יש לבחור תחום",
  profession: "יש לבחור מקצוע",
  area: "יש לבחור אזור",
  scope: "יש לבחור היקף משרה",
  jobNumber: "נא להזין מספר משרה",
  jobDescription: "נא להזין תיאור משרה",
  jobRequirements: "נא להזין דרישות משרה",
};

const toFieldValue = (value: unknown) => String(value ?? "");

const validateJobField = (field: JobFormField, value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return requiredMessages[field];
  }

  const optionMap: Partial<Record<JobFormField, string[]>> = {
    domain: domainOptions,
    profession: professionOptions,
    area: areaOptions,
    scope: scopeOptions,
  };
  const allowedOptions = optionMap[field];

  if (allowedOptions && !allowedOptions.includes(trimmedValue)) {
    return "הערך שהוזן אינו תקין";
  }

  return "";
};

const validateJobForm = (values: JobFormValues) =>
  (Object.keys(values) as JobFormField[]).reduce<JobFormErrors>(
    (errors, field) => {
      const error = validateJobField(field, values[field]);
      if (error) {
        errors[field] = error;
      }
      return errors;
    },
    {},
  );

interface EditJobModalFormProps {
  showEditForm?: boolean;
  onHide: () => void;
  handleEditChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => void;
  editedJob: Partial<Job>;
  handleEditSubmit: React.FormEventHandler<HTMLFormElement>;
}

export function EditJobModalForm({
  showEditForm,
  onHide,
  handleEditChange,
  editedJob,
  handleEditSubmit,
}: EditJobModalFormProps) {
  const [formErrors, setFormErrors] = useState<JobFormErrors>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);

  const getFormValues = (): JobFormValues => ({
    jobTitle: toFieldValue(editedJob.jobTitle),
    domain: toFieldValue(editedJob.domain),
    profession: toFieldValue(editedJob.profession),
    area: toFieldValue(editedJob.area),
    scope: toFieldValue(editedJob.scope),
    jobNumber: toFieldValue(editedJob.jobNumber),
    jobDescription: toFieldValue(editedJob.jobDescription),
    jobRequirements: toFieldValue(editedJob.jobRequirements),
  });

  const handleValidatedChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    handleEditChange(e);

    if (hasAttemptedSubmit) {
      const field = e.target.name as JobFormField;
      const fieldError = validateJobField(field, e.target.value);

      setFormErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };

        if (fieldError) {
          nextErrors[field] = fieldError;
        } else {
          delete nextErrors[field];
        }

        return nextErrors;
      });
    }
  };

  const handleValidatedSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    setHasAttemptedSubmit(true);

    const validationErrors = validateJobForm(getFormValues());

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});
    handleEditSubmit(e);
  };

  return (
    <Modal
      show={showEditForm}
      onHide={onHide}
      centered
      dialogClassName="edit-job-modal">
      <Modal.Header closeButton className="edit-job-header">
        <div className="edit-job-header-content">
          <p className="edit-job-badge">פאנל ניהול</p>
          <Modal.Title>עריכת משרה</Modal.Title>
          <p className="edit-job-intro">
            עדכן את פרטי המשרה ושמור את הגרסה העדכנית ביותר.
          </p>
        </div>
      </Modal.Header>

      <Modal.Body className="edit-job-body">
        <Form noValidate onSubmit={handleValidatedSubmit} className="edit-job-form">
          <section className="edit-job-section">
            <div className="edit-job-section-heading">
              <h2 className="edit-job-section-title">מידע בסיסי</h2>
              <p className="edit-job-section-text">
                בדוק את כותרת המשרה ואת פרטי הסיווג הראשיים.
              </p>
            </div>

            <div className="edit-job-grid">
              <Form.Group
                className="edit-job-field edit-job-field-full"
                controlId="jobTitle">
                <Form.Label>כותרת המשרה:</Form.Label>
                <Form.Control
                  type="text"
                  name="jobTitle"
                  value={toFieldValue(editedJob.jobTitle)}
                  onChange={handleValidatedChange}
                  isInvalid={hasAttemptedSubmit && Boolean(formErrors.jobTitle)}
                  autoFocus
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.jobTitle}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="edit-job-field" controlId="domain">
                <Form.Label>תחום:</Form.Label>
                <Form.Select
                  name="domain"
                  value={toFieldValue(editedJob.domain)}
                  onChange={handleValidatedChange}
                  isInvalid={hasAttemptedSubmit && Boolean(formErrors.domain)}>
                  <option value="">בחר תחום</option>
                  {domainOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formErrors.domain}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="edit-job-field" controlId="profession">
                <Form.Label>מקצוע:</Form.Label>
                <Form.Select
                  name="profession"
                  value={toFieldValue(editedJob.profession)}
                  onChange={handleValidatedChange}
                  isInvalid={
                    hasAttemptedSubmit && Boolean(formErrors.profession)
                  }>
                  <option value="">בחר מקצוע</option>
                  {professionOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formErrors.profession}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </section>

          <section className="edit-job-section">
            <div className="edit-job-section-heading">
              <h2 className="edit-job-section-title">
                מיקום ותפקיד
              </h2>
              <p className="edit-job-section-text">
                התאם את האזור, הספק, והתייחסות פנימית.
              </p>
            </div>

            <div className="edit-job-grid">
              <Form.Group className="edit-job-field" controlId="area">
                <Form.Label>אזור:</Form.Label>
                <Form.Select
                  name="area"
                  value={toFieldValue(editedJob.area)}
                  onChange={handleValidatedChange}
                  isInvalid={hasAttemptedSubmit && Boolean(formErrors.area)}>
                  <option value="">בחר אזור</option>
                  {areaOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formErrors.area}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="edit-job-field" controlId="scope">
                <Form.Label>היקף משרה:</Form.Label>
                <Form.Select
                  name="scope"
                  value={toFieldValue(editedJob.scope)}
                  onChange={handleValidatedChange}
                  isInvalid={hasAttemptedSubmit && Boolean(formErrors.scope)}>
                  <option value="">בחר היקף משרה</option>
                  {scopeOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formErrors.scope}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                className="edit-job-field edit-job-field-full"
                controlId="jobNumber">
                <Form.Label>מספר משרה:</Form.Label>
                <Form.Control
                  type="text"
                  name="jobNumber"
                  value={toFieldValue(editedJob.jobNumber)}
                  onChange={handleValidatedChange}
                  isInvalid={hasAttemptedSubmit && Boolean(formErrors.jobNumber)}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.jobNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </section>

          <section className="edit-job-section">
            <div className="edit-job-section-heading">
              <h2 className="edit-job-section-title">תוכן משרה</h2>
              <p className="edit-job-section-text">
                עדכן את תיאור התפקיד והדרישות בתבנית נקייה.
              </p>
            </div>

            <div className="edit-job-stack">
              <Form.Group className="edit-job-field" controlId="jobDescription">
                <Form.Label>תיאור משרה:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="jobDescription"
                  value={toFieldValue(editedJob.jobDescription)}
                  onChange={handleValidatedChange}
                  isInvalid={
                    hasAttemptedSubmit && Boolean(formErrors.jobDescription)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.jobDescription}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                className="edit-job-field"
                controlId="jobRequirements">
                <Form.Label>דרישות משרה:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="jobRequirements"
                  value={toFieldValue(editedJob.jobRequirements)}
                  onChange={handleValidatedChange}
                  isInvalid={
                    hasAttemptedSubmit && Boolean(formErrors.jobRequirements)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.jobRequirements}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </section>

          <div className="edit-job-actions">
            <Button variant="secondary" type="button" onClick={onHide}>
              ביטול
            </Button>
            <Button variant="primary" type="submit">
              שמור שינויים
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
