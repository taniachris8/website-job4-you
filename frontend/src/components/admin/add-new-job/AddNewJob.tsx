import { useState } from "react";
import type { FormEvent } from "react";

import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

import { ApiService } from "../../../services/ApiService";
import { API_URL } from "../../../consts/general";

import { domainOptions } from "../../../consts/options/DomainOptions";
import { professionOptions } from "../../../consts/options/ProfessionOptions";
import { areaOptions } from "../../../consts/options/AreaOptions";
import { scopeOptions } from "../../../consts/options/ScopeOptions";

import { Button } from "../../button/Button";
import { ErrorMessage } from "../../error-message/ErrorMessage";
import { getApiErrorMessage } from "../../../utils/apiError";

import "./AddNewJob.css";

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

export function AddNewJob({
  onHide,
  showAddNewJob,
  fetchJobs,
}: {
  onHide: () => void;
  showAddNewJob?: boolean;
  fetchJobs: () => Promise<void>;
}) {
  const ApiJobs = new ApiService(API_URL);
  const [jobTitle, setJobTitle] = useState("");
  const [domain, setDomain] = useState("");
  const [profession, setProfession] = useState("");
  const [area, setArea] = useState("");
  const [scope, setScope] = useState("");
  const [jobNumber, setJobNumber] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobRequirements, setJobRequirements] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<JobFormErrors>({});
  const [hasAttemptedSubmit, setHasAttemptedSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getFormValues = (): JobFormValues => ({
    jobTitle,
    domain,
    profession,
    area,
    scope,
    jobNumber,
    jobDescription,
    jobRequirements,
  });

  const handleFieldChange = (
    field: JobFormField,
    value: string,
    setter: (nextValue: string) => void,
  ) => {
    setter(value);

    if (hasAttemptedSubmit) {
      setFormErrors((currentErrors) => {
        const nextErrors = { ...currentErrors };
        const fieldError = validateJobField(field, value);

        if (fieldError) {
          nextErrors[field] = fieldError;
        } else {
          delete nextErrors[field];
        }

        return nextErrors;
      });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setHasAttemptedSubmit(true);

    const values = getFormValues();
    const validationErrors = validateJobForm(values);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    setFormErrors({});
    setIsSubmitting(true);

    const newJob = Object.fromEntries(
      Object.entries(values).map(([key, value]) => [key, value.trim()]),
    ) as JobFormValues;

    try {
      await ApiJobs.postJob(newJob);
      setJobTitle("");
      setDomain("");
      setProfession("");
      setArea("");
      setScope("");
      setJobNumber("");
      setJobDescription("");
      setJobRequirements("");
      setFormErrors({});
      setHasAttemptedSubmit(false);
      await fetchJobs();
      onHide();
    } catch (error) {
      console.error("Error:", error);
      setSubmitError(
        getApiErrorMessage(error, {
          badRequestMessage: "\u05D9\u05E9 \u05DC\u05DE\u05DC\u05D0 \u05D0\u05EA \u05DB\u05DC \u05E9\u05D3\u05D5\u05EA \u05D4\u05DE\u05E9\u05E8\u05D4 \u05D1\u05D0\u05D5\u05E4\u05DF \u05EA\u05E7\u05D9\u05DF.",
          forbiddenMessage: "\u05D0\u05D9\u05DF \u05DC\u05DA \u05D4\u05E8\u05E9\u05D0\u05D4 \u05DC\u05E4\u05E8\u05E1\u05DD \u05DE\u05E9\u05E8\u05D5\u05EA.",
          defaultMessage: "\u05DC\u05D0 \u05D4\u05E6\u05DC\u05D7\u05E0\u05D5 \u05DC\u05E4\u05E8\u05E1\u05DD \u05D0\u05EA \u05D4\u05DE\u05E9\u05E8\u05D4. \u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1.",
        }),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      show={showAddNewJob}
      onHide={onHide}
      centered
      dialogClassName="add-new-job-modal">
      <Modal.Header closeButton className="add-new-job-header">
        <div className="add-new-job-header-content">
          <p className="add-new-job-badge">פאנל ניהול</p>
          <Modal.Title>הוספת משרה חדשה</Modal.Title>
          <p className="add-new-job-intro">
            מלא את פרטי המשרה כדי לפרסם מודעת דרושים חדשה.
          </p>
        </div>
      </Modal.Header>

      <Modal.Body className="add-new-job-body">
        <Form noValidate onSubmit={handleSubmit} className="add-new-job-form">
          <section className="add-new-job-section">
            <div className="add-new-job-section-heading">
              <h2 className="add-new-job-section-title">מידע בסיסי</h2>
              <p className="add-new-job-section-text">
                הגדר את שם המשרה ואת פרטי הסיווג הראשיים.
              </p>
            </div>

            <div className="add-new-job-grid">
              <Form.Group
                className="add-new-job-field add-new-job-field-full"
                controlId="jobTitle">
                <Form.Label>כותרת המשרה:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="כותרת המשרה"
                  value={jobTitle}
                  onChange={(e) =>
                    handleFieldChange("jobTitle", e.target.value, setJobTitle)
                  }
                  isInvalid={hasAttemptedSubmit && Boolean(formErrors.jobTitle)}
                  autoFocus
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.jobTitle}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="add-new-job-field" controlId="domain">
                <Form.Label>תחום:</Form.Label>
                <Form.Select
                  value={domain}
                  onChange={(e) =>
                    handleFieldChange("domain", e.target.value, setDomain)
                  }
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

              <Form.Group className="add-new-job-field" controlId="profession">
                <Form.Label>מקצוע:</Form.Label>
                <Form.Select
                  value={profession}
                  onChange={(e) =>
                    handleFieldChange("profession", e.target.value, setProfession)
                  }
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

          <section className="add-new-job-section">
            <div className="add-new-job-section-heading">
              <h2 className="add-new-job-section-title">מיקום ותפקיד</h2>
              <p className="add-new-job-section-text">
                הוסף את האזור, הספק, והתייחסות פנימית.
              </p>
            </div>

            <div className="add-new-job-grid">
              <Form.Group className="add-new-job-field" controlId="area">
                <Form.Label>אזור:</Form.Label>
                <Form.Select
                  value={area}
                  onChange={(e) =>
                    handleFieldChange("area", e.target.value, setArea)
                  }
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

              <Form.Group className="add-new-job-field" controlId="scope">
                <Form.Label>היקף משרה:</Form.Label>
                <Form.Select
                  value={scope}
                  onChange={(e) =>
                    handleFieldChange("scope", e.target.value, setScope)
                  }
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
                className="add-new-job-field add-new-job-field-full"
                controlId="jobNumber">
                <Form.Label>מספר משרה:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="מספר משרה"
                  value={jobNumber}
                  onChange={(e) =>
                    handleFieldChange("jobNumber", e.target.value, setJobNumber)
                  }
                  isInvalid={hasAttemptedSubmit && Boolean(formErrors.jobNumber)}
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.jobNumber}
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </section>

          <section className="add-new-job-section">
            <div className="add-new-job-section-heading">
              <h2 className="add-new-job-section-title">תוכן משרה</h2>
              <p className="add-new-job-section-text">
                שמר את התיאור והדרישות מסודרים עבור סקירה קלילה.
              </p>
            </div>

            <div className="add-new-job-stack">
              <Form.Group
                className="add-new-job-field"
                controlId="jobDescription">
                <Form.Label>תיאור משרה:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="הזן כל תיאור בשורה חדשה"
                  value={jobDescription}
                  onChange={(e) =>
                    handleFieldChange(
                      "jobDescription",
                      e.target.value,
                      setJobDescription,
                    )
                  }
                  isInvalid={
                    hasAttemptedSubmit && Boolean(formErrors.jobDescription)
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formErrors.jobDescription}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                className="add-new-job-field"
                controlId="jobRequirements">
                <Form.Label>דרישות משרה:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="הזן כל דרישה בשורה חדשה"
                  value={jobRequirements}
                  onChange={(e) =>
                    handleFieldChange(
                      "jobRequirements",
                      e.target.value,
                      setJobRequirements,
                    )
                  }
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

          {submitError ? (
            <ErrorMessage
              className="add-new-job-error"
              message={submitError}
              compact
            />
          ) : null}

          <div className="add-new-job-actions">
            <Button
              variant="secondary"
              type="button"
              onClick={onHide}
              disabled={isSubmitting}>
              ביטול
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "מפרסם..." : "פרסם משרה"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
