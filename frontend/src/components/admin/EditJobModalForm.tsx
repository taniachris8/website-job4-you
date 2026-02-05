import { Button } from "../buttons/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "./EditJobModalForm.css";
import { domainOptions } from "../options/DomainOptions";
import { professionOptions } from "../options/ProfessionOptions";
import { areaOptions } from "../options/AreaOptions";
import { scopeOptions } from "../options/ScopeOptions";

import type { Job } from "../../types";

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
    <>
      <Modal show={showEditForm} onHide={onHide}>
        <Modal.Header closeButton bsPrefix="edit-form-header">
          <Modal.Title>Edit Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <Form.Group className="mb-3" controlId="jobTitle">
              <Form.Label>Job Title:</Form.Label>
              <Form.Control
                type="text"
                name="jobTitle"
                value={editedJob.jobTitle}
                onChange={handleEditChange}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="domain">
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

            <Form.Group className="mb-3" controlId="profession">
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

            <Form.Group className="mb-3" controlId="area">
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
            <Form.Group className="mb-3" controlId="scope">
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
            <Form.Group className="mb-3" controlId="jobNumber">
              <Form.Label>Job Number:</Form.Label>
              <Form.Control
                type="text"
                name="jobNumber"
                value={editedJob.jobNumber}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="jobDescription">
              <Form.Label>Job description:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="jobDescription"
                value={editedJob.jobDescription}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="jobRequirements">
              <Form.Label>Job requirements:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="jobRequirements"
                value={editedJob.jobRequirements}
                onChange={handleEditChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Save Changes
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
