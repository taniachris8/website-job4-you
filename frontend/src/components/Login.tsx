import { useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "./components-css/Login.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../services/useAuthHook";
import { Button } from "./buttons/Button";
import { ApiService } from "../services/ApiService";
import { API_URL } from "../consts/general";

interface LoginProps {
  onHide: () => void;
  showLoginForm?: boolean;
  handleShowAdminLoginForm?: () => void;
}

export const Login = ({
  onHide,
  showLoginForm,
  handleShowAdminLoginForm,
}: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const ApiUserService = new ApiService(API_URL);

  const handleLinkClick = () => {
    onHide();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await ApiUserService.loginUser({ email, password });
      const { user, accessToken } = response.data;
      login(user, accessToken);
      console.log("Login successful");
      navigate("/");
      setEmail("");
      setPassword("");
      onHide();
    } catch (error) {
      console.error("Error:", error);
      setError("Invalid email or password");
    }
  };

  return (
    <>
      <Modal show={showLoginForm} onHide={onHide}>
        <Modal.Header closeButton bsPrefix="login-header">
          <Modal.Title className="login-title">התחברות</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>כתובת דוא"ל</Form.Label>
              <Form.Control
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>סיסמה</Form.Label>
              <Form.Control
                type="password"
                placeholder="הכנס את הסיסמה שלך"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>

            {error && <p className="text-danger">{error}</p>}

            <Button variant="primary" type="submit">
              להתחבר
            </Button>
            <Link
              className="forgot-password-link"
              to="/password_recovery"
              onClick={handleLinkClick}>
              שכחת סיסמא?
            </Link>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className="signup-link">
            <p className="signup-prg">אם עדיין אין לך חשבון</p>
            <Link to="/registration" onClick={handleLinkClick}>
              להירשם
            </Link>
          </div>

          <button
            className="admin-login-btn"
            onClick={handleShowAdminLoginForm}>
            התחברות של מנהל מערכת
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
