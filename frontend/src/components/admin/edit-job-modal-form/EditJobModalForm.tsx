import type { Job } from "../../../types";

import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

import { domainOptions } from "../../../consts/options/DomainOptions";
import { professionOptions } from "../../../consts/options/ProfessionOptions";
import { areaOptions } from "../../../consts/options/AreaOptions";
import { scopeOptions } from "../../../consts/options/ScopeOptions";

import { Button } from "../../button/Button";

import "./EditJobModalForm.css";

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
  return (
    <Modal
      show={showEditForm}
      onHide={onHide}
      centered
      dialogClassName="edit-job-modal">
      <Modal.Header closeButton className="edit-job-header">
        <div className="edit-job-header-content">
          <p className="edit-job-badge">Admin panel</p>
          <Modal.Title>Edit Job</Modal.Title>
          <p className="edit-job-intro">
            Update the role details and save the latest version.
          </p>
        </div>
      </Modal.Header>

      <Modal.Body className="edit-job-body">
        <Form onSubmit={handleEditSubmit} className="edit-job-form">
          <section className="edit-job-section">
            <div className="edit-job-section-heading">
              <h2 className="edit-job-section-title">Basic information</h2>
              <p className="edit-job-section-text">
                Review the role title and primary classification details.
              </p>
            </div>

            <div className="edit-job-grid">
              <Form.Group className="edit-job-field edit-job-field-full" controlId="jobTitle">
                <Form.Label>Job Title:</Form.Label>
                <Form.Control
                  type="text"
                  name="jobTitle"
                  value={editedJob.jobTitle}
                  onChange={handleEditChange}
                  autoFocus
                />
              </Form.Group>

              <Form.Group className="edit-job-field" controlId="domain">
                <Form.Label>Domain:</Form.Label>
                <Form.Select
                  name="domain"
                  value={editedJob.domain}
                  onChange={handleEditChange}>
                  <option value="">Select Domain</option>
                  {domainOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="edit-job-field" controlId="profession">
                <Form.Label>Profession:</Form.Label>
                <Form.Select
                  name="profession"
                  value={editedJob.profession}
                  onChange={handleEditChange}>
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

          <section className="edit-job-section">
            <div className="edit-job-section-heading">
              <h2 className="edit-job-section-title">Location and employment</h2>
              <p className="edit-job-section-text">
                Adjust the area, role scope, and internal reference number.
              </p>
            </div>

            <div className="edit-job-grid">
              <Form.Group className="edit-job-field" controlId="area">
                <Form.Label>Area:</Form.Label>
                <Form.Select
                  name="area"
                  value={editedJob.area}
                  onChange={handleEditChange}>
                  <option value="">Select Area</option>
                  {areaOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="edit-job-field" controlId="scope">
                <Form.Label>Scope:</Form.Label>
                <Form.Select
                  name="scope"
                  value={editedJob.scope}
                  onChange={handleEditChange}>
                  <option value="">Select Scope</option>
                  {scopeOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="edit-job-field edit-job-field-full" controlId="jobNumber">
                <Form.Label>Job Number:</Form.Label>
                <Form.Control
                  type="text"
                  name="jobNumber"
                  value={editedJob.jobNumber}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </div>
          </section>

          <section className="edit-job-section">
            <div className="edit-job-section-heading">
              <h2 className="edit-job-section-title">Job content</h2>
              <p className="edit-job-section-text">
                Update the role description and requirements in a clean format.
              </p>
            </div>

            <div className="edit-job-stack">
              <Form.Group className="edit-job-field" controlId="jobDescription">
                <Form.Label>Job description:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="jobDescription"
                  value={editedJob.jobDescription}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group className="edit-job-field" controlId="jobRequirements">
                <Form.Label>Job requirements:</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  name="jobRequirements"
                  value={editedJob.jobRequirements}
                  onChange={handleEditChange}
                />
              </Form.Group>
            </div>
          </section>

          <div className="edit-job-actions">
            <Button variant="secondary" type="button" onClick={onHide}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}
