import Modal from "react-bootstrap/Modal";

import { useAppDispatch } from "../../store/hooks";
import { clearAuthError } from "../../store/slices/authSlice";
import { LoginForm } from "../login-form/LoginForm";

import "./components-css/Login.css";

interface LoginProps {
  onHide: () => void;
  showLoginForm?: boolean;
}

export const Login = ({ onHide, showLoginForm }: LoginProps) => {
  const dispatch = useAppDispatch();

  return (
    <Modal
      show={showLoginForm}
      onHide={() => {
        dispatch(clearAuthError());
        onHide();
      }}>
      <Modal.Header closeButton bsPrefix="login-header">
        <Modal.Title className="login-title">התחברות</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LoginForm onSuccess={onHide} showSignupLink={false} />
      </Modal.Body>
    </Modal>
  );
};
