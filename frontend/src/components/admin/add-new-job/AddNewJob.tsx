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
          <p className="add-new-job-badge">Admin panel</p>
          <Modal.Title>Add new job</Modal.Title>
          <p className="add-new-job-intro">
            Fill in the role details to publish a new job posting.
          </p>
        </div>
      </Modal.Header>

      <Modal.Body className="add-new-job-body">
        <Form onSubmit={handleSubmit} className="add-new-job-form">
          <section className="add-new-job-section">
            <div className="add-new-job-section-heading">
              <h2 className="add-new-job-section-title">Basic information</h2>
              <p className="add-new-job-section-text">
                Define the role title and the main classification details.
              </p>
            </div>

            <div className="add-new-job-grid">
              <Form.Group className="add-new-job-field add-new-job-field-full" controlId="jobTitle">
                <Form.Label>Job Title:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Job title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  autoFocus
                />
              </Form.Group>

              <Form.Group className="add-new-job-field" controlId="domain">
                <Form.Label>Domain:</Form.Label>
                <Form.Select
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}>
                  <option value="">Select Domain</option>
                  {domainOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="add-new-job-field" controlId="profession">
                <Form.Label>Profession:</Form.Label>
                <Form.Select
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}>
                  <option value="">Select Profession</option>
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
              <h2 className="add-new-job-section-title">Location and employment</h2>
              <p className="add-new-job-section-text">
                Add the area, scope, and internal role reference.
              </p>
            </div>

            <div className="add-new-job-grid">
              <Form.Group className="add-new-job-field" controlId="area">
                <Form.Label>Area:</Form.Label>
                <Form.Select value={area} onChange={(e) => setArea(e.target.value)}>
                  <option value="">Select Area</option>
                  {areaOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="add-new-job-field" controlId="scope">
                <Form.Label>Scope:</Form.Label>
                <Form.Select value={scope} onChange={(e) => setScope(e.target.value)}>
                  <option value="">Select Scope</option>
                  {scopeOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="add-new-job-field add-new-job-field-full" controlId="jobNumber">
                <Form.Label>Job Number:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Job number"
                  value={jobNumber}
                  onChange={(e) => setJobNumber(e.target.value)}
                />
              </Form.Group>
            </div>
          </section>

          <section className="add-new-job-section">
            <div className="add-new-job-section-heading">
              <h2 className="add-new-job-section-title">Job content</h2>
              <p className="add-new-job-section-text">
                Keep the description and requirements organized for easier review.
              </p>
            </div>

            <div className="add-new-job-stack">
              <Form.Group className="add-new-job-field" controlId="jobDescription">
                <Form.Label>Job description:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Enter each description on a new line"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="add-new-job-field" controlId="jobRequirements">
                <Form.Label>Job requirements:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  placeholder="Enter each requirement on a new line"
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
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Job"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
