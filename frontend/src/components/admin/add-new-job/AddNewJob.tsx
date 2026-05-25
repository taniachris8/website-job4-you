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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    const newJob = {
      jobTitle,
      domain,
      profession,
      area,
      scope,
      jobNumber,
      jobDescription,
      jobRequirements,
    };

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
      await fetchJobs();
      onHide();
    } catch (error) {
      console.error("Error:", error);
      setSubmitError(
        getApiErrorMessage(error, {
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
        <Form onSubmit={handleSubmit} className="add-new-job-form">
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
                  onChange={(e) => setJobTitle(e.target.value)}
                  autoFocus
                />
              </Form.Group>

              <Form.Group className="add-new-job-field" controlId="domain">
                <Form.Label>תחום:</Form.Label>
                <Form.Select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}>
                  <option value="">בחר תחום</option>
                  {domainOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="add-new-job-field" controlId="profession">
                <Form.Label>מקצוע:</Form.Label>
                <Form.Select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}>
                  <option value="">בחר מקצוע</option>
                  {professionOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
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
                  onChange={(e) => setArea(e.target.value)}>
                  <option value="">בחר אזור</option>
                  {areaOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="add-new-job-field" controlId="scope">
                <Form.Label>היקף משרה:</Form.Label>
                <Form.Select
                  value={scope}
                  onChange={(e) => setScope(e.target.value)}>
                  <option value="">בחר היקף משרה</option>
                  {scopeOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group
                className="add-new-job-field add-new-job-field-full"
                controlId="jobNumber">
                <Form.Label>מספר משרה:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="מספר משרה"
                  value={jobNumber}
                  onChange={(e) => setJobNumber(e.target.value)}
                />
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
                  onChange={(e) => setJobDescription(e.target.value)}
                />
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
                  onChange={(e) => setJobRequirements(e.target.value)}
                />
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
