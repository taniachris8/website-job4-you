import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import "./pages-css/LoginPage.css";
import { Button } from "../components/buttons/Button";
import { useAuth } from "../services/AuthContext";
import { AdminLoginForm } from "../components/admin/AdminLoginForm";
// import { ApiService } from "../services/ApiService";
import { API_URL } from "../consts/general";
import axios from "axios";
import Cookies from "js-cookie";

export function LoginPage() {
  const [showAdminLoginForm, setShowAdminLoginForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const handleCloseAdminLoginForm = () => setShowAdminLoginForm(false);
  const handleShowAdminLoginForm = () => setShowAdminLoginForm(true);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      Cookies.set("access-token", response.data.accessToken, {
        secure: true,
        sameSite: "Strict",
      });
      Cookies.set("refresh-token", response.data.refreshToken, {
        secure: true,
        sameSite: "Strict",
      });
      login(response.data.user); // Call the login function from AuthContext
      console.log("Login successful");
      navigate("/jobs");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred. Please try again.");
    }
  };

  const handleRedirect = () => {
    navigate("/registration");
  };

  return (
    <>
      <div className="login-container">
        <div className="form-container">
          <div className="login-form">
            <h1 className="login-title">התחברות</h1>
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
              <Link className="forgot-password-link" to="/password-recovery">
                שכחת סיסמא?
              </Link>
            </Form>
            <Button
              variant="primary"
              className="admin-login-btn"
              onClick={handleShowAdminLoginForm}>
              התחברות של מנהל מערכת
            </Button>
            <AdminLoginForm
              showAdminLoginForm={showAdminLoginForm}
              handleCloseAdminLoginForm={handleCloseAdminLoginForm}
            />
          </div>
        </div>
        <div className="redirect-to-signup-container">
          <h1 className="login-title">אם עדיין אין לך חשבון</h1>
          <div className="prg-wrapper">
            <div className="check">
              <i className="fa-solid fa-check prg-check"></i>
              <p className="prg">נהל את פרטי החשבון שלך</p>
            </div>
            <div className="check">
              <i className="fa-solid fa-check prg-check"></i>
              <p className="prg">הוסף פוסטים לרשימת משאלות</p>
            </div>
            <div className="check">
              <i className="fa-solid fa-check prg-check"></i>
              <p className="prg">שמור איתנו על קשר</p>
            </div>
          </div>
          <Button variant="secondary" onClick={handleRedirect}>
            להירשם
          </Button>
        </div>
      </div>
    </>
  );
}
