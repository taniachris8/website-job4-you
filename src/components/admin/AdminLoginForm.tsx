import { useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "./AdminLoginForm.css";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../services/useAuthHook";
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
      const response = await ApiUser.getAllUsers();
      console.log(response.data); // Log the fetched users
      const admin = response.data.find(
        (user) =>
          user.email === email &&
          user.password === password &&
          user.role === "admin",
      );

      if (admin) {
        login(admin); // Set the authenticated user
        console.log("Admin login successful");
        navigate("/jobs"); // Redirect to admin dashboard
        handleCloseAdminLoginForm(); // Close the modal on successful login
      } else {
        setError("Invalid email or password");
      }
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
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
