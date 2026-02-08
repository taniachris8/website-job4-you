import { useState } from "react";
import Form from "react-bootstrap/Form";
import "./pages-css/SignUp.css";
import { Button } from "../components/buttons/Button";
import { Login } from "../components/Login";
import { AdminLoginForm } from "../components/admin/AdminLoginForm";
import { Alerts } from "../components/Alerts";
import { Link } from "react-router-dom";
import { ApiService } from "../services/ApiService";
import { API_URL } from "../consts/general";

export function SignUpPage() {
  const [name, setName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmedPassword, setConfirmedPassword] = useState("");
  const [error, setError] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showAdminLoginForm, setShowAdminLoginForm] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const ApiUserService = new ApiService(API_URL);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmedPassword) {
      setError(
        "Passwords do not match. Please make sure the password is matching.",
      );
      return;
    }
    const user = { name, familyName, email, password, role: "user" };

    try {
      // const response = await axios.post("http://localhost:8080/users", user, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      // });
      await ApiUserService.registerUser(user);
      // if (response.status === 201) {
      //   console.log("User registered:", response.data);
      //   setName("");
      //   setFamilyName("");
      //   setEmail("");
      //   setPassword("");
      //   setConfirmedPassword("");
      //   setShowAlert(true);
      // } else {
      //   console.error("Failed to register user");
      // }
      setName("");
      setFamilyName("");
      setEmail("");
      setPassword("");
      setConfirmedPassword("");
      setShowAlert(true);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleShowLoginModal = () => setShowLoginForm(true);
  const handleCloseLoginForm = () => setShowLoginForm(false);
  const handleShowAdminLoginForm = () => {
    setShowAdminLoginForm(true);
    handleCloseLoginForm();
  };
  const handleCloseAdminLoginForm = () => setShowAdminLoginForm(false);

  return (
    <>
      <div className="signup-container">
        <div className="forms-container">
          <div className="sign-up-form">
            <Alerts
              variant="success"
              alertText={
                <>
                  You have successfully created an account. Please{" "}
                  <Link className="login-redirect-link" to="/login">
                    log in
                  </Link>{" "}
                  to start.
                </>
              }
              showAlert={showAlert}
            />
            <h1 className="signup-title">הרשמה לאתר</h1>
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
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>השם שלך*</Form.Label>
                <Form.Control
                  type="name"
                  placeholder=""
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicName">
                <Form.Label>שם משפחה*</Form.Label>
                <Form.Control
                  type="name"
                  placeholder=""
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>כתובת דוא"ל*</Form.Label>
                <Form.Control
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>סיסמה*</Form.Label>
                <Form.Control
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>אשר את הסיסמה*</Form.Label>
                <Form.Control
                  type="password"
                  placeholder=""
                  value={confirmedPassword}
                  onChange={(e) => setConfirmedPassword(e.target.value)}
                />
              </Form.Group>
              <p>נדרש*</p>
              {error && <p className="text-danger">{error}</p>}
              <Button type="submit" variant="primary">
                להירשם
              </Button>
            </Form>
            <div className="existing-user-container">
              <p className="existing-user-prg">משתמש קיים?</p>
              <button
                className="existing-user-btn"
                onClick={handleShowLoginModal}>
                להתחבר
              </button>
            </div>

            <Login
              showLoginForm={showLoginForm}
              onHide={handleCloseLoginForm}
              handleShowAdminLoginForm={handleShowAdminLoginForm}
            />
            <AdminLoginForm
              showAdminLoginForm={showAdminLoginForm}
              handleCloseAdminLoginForm={handleCloseAdminLoginForm}
            />
          </div>
        </div>
      </div>
    </>
  );
}
