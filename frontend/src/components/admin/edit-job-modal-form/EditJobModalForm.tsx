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
          <p className="edit-job-badge">פאנל ניהול</p>
          <Modal.Title>עריכת משרה</Modal.Title>
          <p className="edit-job-intro">
            עדכן את פרטי המשרה ושמור את הגרסה העדכנית ביותר.
          </p>
        </div>
      </Modal.Header>

      <Modal.Body className="edit-job-body">
        <Form onSubmit={handleEditSubmit} className="edit-job-form">
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
                  value={editedJob.jobTitle}
                  onChange={handleEditChange}
                  autoFocus
                />
              </Form.Group>

              <Form.Group className="edit-job-field" controlId="domain">
                <Form.Label>תחום:</Form.Label>
                <Form.Select
                  name="domain"
                  value={editedJob.domain}
                  onChange={handleEditChange}>
                  <option value="">בחר תחום</option>
                  {domainOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="edit-job-field" controlId="profession">
                <Form.Label>מקצוע:</Form.Label>
                <Form.Select
                  name="profession"
                  value={editedJob.profession}
                  onChange={handleEditChange}>
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
                  value={editedJob.area}
                  onChange={handleEditChange}>
                  <option value="">בחר אזור</option>
                  {areaOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group className="edit-job-field" controlId="scope">
                <Form.Label>היקף משרה:</Form.Label>
                <Form.Select
                  name="scope"
                  value={editedJob.scope}
                  onChange={handleEditChange}>
                  <option value="">בחר היקף משרה</option>
                  {scopeOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group
                className="edit-job-field edit-job-field-full"
                controlId="jobNumber">
                <Form.Label>מספר משרה:</Form.Label>
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
                  value={editedJob.jobDescription}
                  onChange={handleEditChange}
                />
              </Form.Group>

              <Form.Group
                className="edit-job-field"
                controlId="jobRequirements">
                <Form.Label>דרישות משרה:</Form.Label>
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
