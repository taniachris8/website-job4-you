import { useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "./AdminLoginForm.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/AuthContext";
import { Button } from "../buttons/Button";
import { ApiService } from "../../services/ApiService";
import { API_URL } from "../../consts/general";

interface AdminLoginFormProps {
  showAdminLoginForm?: boolean;
  handleCloseAdminLoginForm: () => void;
}

export const AdminLoginForm = ({
  showAdminLoginForm,
  handleCloseAdminLoginForm,
}: AdminLoginFormProps) => {
  const ApiUser = new ApiService(API_URL);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await ApiUser.loginUser({ email, password });
      const { user, accessToken } = response.data;
      if (user.role !== "admin") {
        setError("You are not authorized as admin");
        return;
      }
      login(user, accessToken);
      console.log("Admin login successful");
      navigate("/jobs");
      handleCloseAdminLoginForm();
    } catch (error) {
      console.error("Error:", error);
      setError("Invalid email or password");
    }
  };

  return (
    <>
      <Modal show={showAdminLoginForm} onHide={handleCloseAdminLoginForm}>
        <Modal.Header closeButton bsPrefix="login-header">
          <Modal.Title className="login-title">התחבר למנהל</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAdminLogin}>
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
            <Link className="forgot-password-link" to="/password-recovery">
              שכחת סיסמא?
            </Link>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <div className="signup-link">
            <p className="signup-prg">אם עדיין אין לך חשבון</p>
            <Link to="/registration">להירשם</Link>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};
