import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ApplyForm } from "../../apply-form/ApplyForm";
import { EditJobModalForm } from "../../admin/edit-job-modal-form/EditJobModalForm";
import { Button } from "../../button/Button";
import type { Job } from "../../../types";
import { ConfirmationModal } from "../../confirmation-modal/ConfirmationModal";
import { useAppSelector } from "../../../store/hooks";

import "./JobItem.css";

interface JobItemProps extends Partial<Job> {
  onDelete?: (id?: string | number) => void;
  onEdit?: (updatedJob: Partial<Job>) => void;
}

export function JobItem({
  jobTitle,
  area,
  domain,
  profession,
  scope,
  id,
  _id,
  jobDescription,
  jobNumber,
  jobRequirements,
  onDelete,
  onEdit,
}: JobItemProps) {
  const [showApplyForm, setShowApplyForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editedJob, setEditedJob] = useState<Partial<Job>>({
    jobTitle,
    area,
    domain,
    profession,
    scope,
    jobNumber,
    jobDescription,
    jobRequirements,
  });
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const user = useAppSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const handleCloseModal = () => setShowApplyForm(false);
  const handleShowModal = () => setShowApplyForm(true);

  const handleInfoClick = () => {
    navigate(`/jobs/${id ?? _id}`);
  };
  const handleEditClick = () => {
    setShowEditForm(true);
  };

  const handleDeleteClick = () => {
    setShowConfirmationModal(true);
  };

  const handleDelete = () => {
    console.log("deleted");
    onDelete?.(id ?? _id);
    setShowConfirmationModal(false);
  };

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const target = e.target as
      | HTMLInputElement
      | HTMLTextAreaElement
      | HTMLSelectElement;
    const { name, value } = target;
    setEditedJob({
      ...editedJob,
      [name]: value,
    });
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit?.(editedJob);
    setShowEditForm(false);
  };

  return (
    <>
      {user && user.role === "admin" && (
        <div className="admin-btns">
          <button
            type="button"
            className="job-action-btn edit-btn"
            aria-label="Edit job"
            onClick={handleEditClick}>
            <i className="fa-solid fa-pen-to-square" aria-hidden="true"></i>
          </button>
          <button
            type="button"
            className="job-action-btn delete-btn"
            aria-label="Delete job"
            onClick={handleDeleteClick}>
            <i className="fa-solid fa-trash" aria-hidden="true"></i>
          </button>
        </div>
      )}
      <Link to={`/jobs/${id ?? _id}`} className="job-item-link">
        <div className="jobs__item">
          <h1 className="jobs-item-title">{jobTitle}</h1>
          <div className="jobs__item__info">
            <div className="jobs__item__location">
              <i className="fa-solid fa-location-dot"></i>
              <p className="jobs-item-city">{area}</p>
            </div>
            <div className="job-item-details">
              <div className="job-item-detail">
                <i className="fa-solid fa-suitcase details-icon"></i>
                <p className="job-item-descr-prg">{domain}</p>
              </div>
              <div className="job-item-detail">
                <i className="fa-regular fa-address-card details-icon"></i>
                <p className="job-item-descr-prg">{profession}</p>
              </div>
              <div className="job-item-detail">
                <i className="fa-solid fa-clock details-icon"></i>
                <p className="job-item-descr-prg">{scope}</p>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <div className="jobs-item-buttons">
        {user?.role === "admin" ? (
          <>
            <Button variant="secondary" onClick={handleInfoClick}>
              מידע נוסף
            </Button>
          </>
        ) : (
          <>
            <Button variant="primary" onClick={handleShowModal}>
              הגשת מועמדות
            </Button>
            <Button variant="secondary" onClick={handleInfoClick}>
              מידע נוסף
            </Button>
          </>
        )}

        <ApplyForm
          showApplyForm={showApplyForm}
          onHide={handleCloseModal}
          handleCloseModal={handleCloseModal}
        />
      </div>
      {showEditForm && (
        <EditJobModalForm
          showEditForm={showEditForm}
          onHide={() => setShowEditForm(false)}
          editedJob={editedJob}
          handleEditChange={handleEditChange}
          handleEditSubmit={handleEditSubmit}
        />
      )}
      {showConfirmationModal && (
        <ConfirmationModal
          message=" Are you sure that you want to delete this post? Click 'Delete' to
            confirm or 'Back' to cancel."
          showConfirmationModal={showConfirmationModal}
          onDelete={handleDelete}
          setShowConfirmationModal={setShowConfirmationModal}
        />
      )}
    </>
  );
}
