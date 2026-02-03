import { Button } from "../buttons/Button";
import Modal from "react-bootstrap/Modal";
import "./DeleteConfirmModal.css";

interface DeleteConfirmModalProps {
  handleDeleteAccount: () => void;
  showDeleteConfirmModal?: boolean;
  handleCloseDeleteModal: () => void;
}

export function DeleteConfirmModal({
  handleDeleteAccount,
  showDeleteConfirmModal,
  handleCloseDeleteModal,
}: DeleteConfirmModalProps) {
  return (
    <>
      <Modal
        show={showDeleteConfirmModal}
        onHide={handleCloseDeleteModal}
        backdrop="static"
        keyboard={false}>
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          You are about to delete your account. If you wish to proceed please
          click Delete button below.
        </Modal.Body>
        <Modal.Footer>
          <div className="delete-modal-btns">
            <Button variant="close-modal-btn" onClick={handleCloseDeleteModal}>
              Close Modal
            </Button>
            <Button variant="confirm-modal-btn" onClick={handleDeleteAccount}>
              Delete Account
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
