import { Button } from "../button/Button";
import Modal from "react-bootstrap/Modal";

import "./ConfirmationModal.css";

type ConfirmationModalProps = {
  message: string;
  onDelete: () => void;
  setShowConfirmationModal: (show: boolean) => void;
  showConfirmationModal: boolean;
  isProcessing?: boolean;
};

export function ConfirmationModal({
  message,
  onDelete,
  setShowConfirmationModal,
  showConfirmationModal,
  isProcessing = false,
}: ConfirmationModalProps) {
  return (
    <>
      <Modal show={showConfirmationModal} backdrop="static" keyboard={false}>
        <Modal.Body>
          <p>{message}</p>
        </Modal.Body>

        <Modal.Footer>
          <div className="modal-buttons">
            <Button
              disabled={isProcessing}
              onClick={() => setShowConfirmationModal(false)}
              variant="secondary">
              Back
            </Button>
            <Button disabled={isProcessing} onClick={onDelete} variant="delete">
              {isProcessing ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
