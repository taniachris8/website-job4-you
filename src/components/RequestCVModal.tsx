import { useState, useRef } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import "./components-css/RequestCVModal.css";
import { Button } from "./buttons/Button";

interface RequestCVModalProps {
  onHide: () => void;
  showRequestCVModal?: boolean;
}

export function RequestCVModal({
  onHide,
  showRequestCVModal,
}: RequestCVModalProps) {
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [message, setMessage] = useState("");
  const [formErrors, setFormErrors] = useState({
    userName: false,
    userEmail: false,
    userPhone: false,
    message: false,
  });
  const [showFieldError, setShowFieldError] = useState(false);
  const [inputNameFocused, setInputNameFocused] = useState(false);
  const [inputEmailFocused, setInputEmailFocused] = useState(false);
  const [inputMessageFocused, setInputMessageFocused] = useState(false);
  const [inputPhoneFocused, setInputPhoneFocused] = useState(false);

  const form = useRef<HTMLFormElement | null>(null);
  void cvFile;
  void showFieldError;
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setCvFile(file);
  };
  const validateForm = () => {
    let isValid = true;
    const errors = {
      userName: !userName.trim(),
      userEmail: !userEmail.trim() || !isValidEmail(userEmail),
      userPhone: !userPhone.trim(),
      message: !message.trim(),
    };

    setFormErrors(errors);

    if (Object.values(errors).some((error) => error)) {
      isValid = false;
      if (!isValidEmail(userEmail)) {
        setShowFieldError(false); // Don't show the general error message
      } else {
        setShowFieldError(true); // Set showFieldError to true if any field is empty
      }
    } else {
      setShowFieldError(false); // Otherwise, set it to false
    }

    return isValid;
  };
  void validateForm;
  const isValidEmail = (email: string) => {
    // Regular expression for email validation
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  return (
    <>
      <Modal show={showRequestCVModal} onHide={onHide}>
        <Modal.Header closeButton className="modal-header">
          <div className="modal-upper-section">
            <Modal.Title>בקשה לקורות חיים</Modal.Title>
            <p className="modal-prg">
              מלא את הטופס או שלח דוא"ל ישירות אל: limor@job4you.co.il
            </p>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form ref={form}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>השם</Form.Label>
              <Form.Control
                type="text"
                name="user_name"
                placeholder="השם שלך"
                autoFocus
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                onFocus={() => {
                  setInputNameFocused(true);
                  setShowFieldError(false);
                }}
                onBlur={() => setInputNameFocused(false)}
                className={
                  (formErrors.userName && !userName) ||
                  (formErrors.userName &&
                    !inputNameFocused &&
                    !inputEmailFocused &&
                    !inputPhoneFocused &&
                    !inputMessageFocused)
                    ? "error"
                    : ""
                }
              />
              {formErrors.userName &&
                !userName &&
                !inputNameFocused &&
                !inputEmailFocused &&
                !inputPhoneFocused &&
                !inputMessageFocused && (
                  <p className="error-message">אנא הכנס את שמך</p>
                )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>טלפון</Form.Label>
              <Form.Control
                type="text"
                name="user_phone"
                placeholder="050-000-0000"
                autoFocus
                value={userPhone}
                onChange={(e) => setUserPhone(e.target.value)}
                onFocus={() => {
                  setInputPhoneFocused(true);
                  setShowFieldError(false);
                }}
                onBlur={() => setInputPhoneFocused(false)}
                className={
                  (formErrors.userPhone && !userPhone) ||
                  (formErrors.userPhone &&
                    !inputNameFocused &&
                    !inputEmailFocused &&
                    !inputPhoneFocused &&
                    !inputMessageFocused)
                    ? "error"
                    : ""
                }
              />
              {formErrors.userPhone &&
                !userPhone &&
                !inputNameFocused &&
                !inputEmailFocused &&
                !inputPhoneFocused &&
                !inputMessageFocused && (
                  <p className="error-message">אנא הזן את מספר הטלפון שלך</p>
                )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>כתובת דוא"ל</Form.Label>
              <Form.Control
                type="email"
                name="user_email"
                placeholder="name@example.com"
                autoFocus
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                onFocus={() => {
                  setInputEmailFocused(true);
                  setShowFieldError(false);
                }}
                onBlur={() => setInputEmailFocused(false)}
                className={
                  (formErrors.userEmail && !userEmail) ||
                  (formErrors.userEmail &&
                    !inputNameFocused &&
                    !inputEmailFocused &&
                    !inputPhoneFocused &&
                    !inputMessageFocused)
                    ? "error"
                    : ""
                }
              />
              {formErrors.userEmail &&
                !userName &&
                !inputNameFocused &&
                !inputEmailFocused &&
                !inputPhoneFocused &&
                !inputMessageFocused && (
                  <p className="error-message">אנא הכנס את כתובת הדוא"ל שלך</p>
                )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="formCv">
              <Form.Label>קורות חיים ישנים (אם זמינים)</Form.Label>

              <Form.Control
                type="file"
                className="custom-file-input"
                onChange={handleFileChange}
                accept=".doc,.docx,.pdf"
              />
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1">
              <Form.Label>ספר לנו קצת על עצמך</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onFocus={() => {
                  setInputMessageFocused(true);
                  setShowFieldError(false);
                }}
                onBlur={() => setInputMessageFocused(false)}
                className={
                  (formErrors.message && !message) ||
                  (formErrors.message &&
                    !inputNameFocused &&
                    !inputEmailFocused &&
                    !inputPhoneFocused &&
                    !inputMessageFocused)
                    ? "error"
                    : ""
                }
              />
              {formErrors.message &&
                !message &&
                !inputNameFocused &&
                !inputEmailFocused &&
                !inputPhoneFocused &&
                !inputMessageFocused && (
                  <p className="error-message">
                    Пожалуйста, введите Ваше сообщение
                  </p>
                )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Form.Group className="mb-3" controlId="formBasicCheckbox">
            <Form.Check
              type="checkbox"
              label="מאשר/ת את מדיניות הפרטיות כולל קבלת הצעות עבודה ו/או הצעות "
            />
          </Form.Group>
          <Button variant="primary">שליחה</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
