import { useState, useRef } from "react";
import "./components-css/ContactUsForm.css";
import Alert from "react-bootstrap/Alert";
import { Button } from "./buttons/Button";
import Form from "react-bootstrap/Form";

export function ContactUsForm() {
  const [showAlert, setShowAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [message, setMessage] = useState("");
  const [formErrors] = useState({
    userName: false,
    userEmail: false,
    message: false,
  });
  const [showFieldError, setShowFieldError] = useState(false);
  const [inputNameFocused, setInputNameFocused] = useState(false);
  const [inputPhoneFocused, setInputPhoneFocused] = useState(false);
  const [inputEmailFocused, setInputEmailFocused] = useState(false);
  const [inputMessageFocused, setInputMessageFocused] = useState(false);

  const form = useRef<HTMLFormElement | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const input = e.currentTarget;
    if (input.value.trim() === "") {
      input.setAttribute(
        "placeholder",
        input.getAttribute("data-placeholder") || "",
      );
    } else {
      input.removeAttribute("placeholder");
    }
  };

  return (
    <div className="request-form-container">
      <h1 className="request-form-hdr">צור קשר</h1>
      <p className="request-form-prg">
        כשהשחר פרץ מעל הנוף השלו, קול ציוץ הציפורים הביא את היום החדש
      </p>
      <Form ref={form} className="contact-form-styles">
        <div className="input-group">
          <div className="input-container">
            <Form.Control
              type="text"
              name="user_name"
              id="name"
              className={`input name-input ${
                (formErrors.userName && !userName) ||
                (formErrors.userName &&
                  !inputNameFocused &&
                  !inputEmailFocused &&
                  !inputMessageFocused)
                  ? "error"
                  : ""
              }`}
              placeholder="שם"
              onChange={(e) => {
                handleInputChange(e);
                setUserName(e.target.value);
              }}
              onFocus={() => {
                setInputNameFocused(true);
                setShowFieldError(false);
              }}
              onBlur={() => setInputNameFocused(false)}
              value={userName}
            />
            {formErrors.userName &&
              !userName &&
              !inputNameFocused &&
              !inputEmailFocused &&
              !inputMessageFocused && (
                <p className="error-message">אנא הכנס את שמך</p>
              )}
          </div>
          <div className="input-container">
            <Form.Control
              type="text"
              id="phone"
              name="user_phone"
              placeholder="טלפון"
              value={userPhone}
              onChange={(e) => {
                handleInputChange(e);
                setUserPhone(e.target.value);
              }}
              onFocus={() => {
                setInputPhoneFocused(true);
                setShowFieldError(false);
              }}
              onBlur={() => setInputPhoneFocused(false)}
              className={`input phone-input ${
                (formErrors.userName && !userPhone) ||
                (formErrors.userName &&
                  !inputNameFocused &&
                  !inputPhoneFocused &&
                  !inputEmailFocused &&
                  !inputMessageFocused)
                  ? "error"
                  : ""
              }`}
            />
            {formErrors.userName &&
              !userPhone &&
              !inputNameFocused &&
              !inputPhoneFocused &&
              !inputEmailFocused &&
              !inputMessageFocused && (
                <p className="error-message">אנא הזן את מספר הטלפון שלך</p>
              )}
          </div>
        </div>
        <div className="input-container">
          <Form.Control
            type="email"
            id="email"
            name="email"
            value={userEmail}
            placeholder="כתובת הדואר האלקטרוני שלך"
            onChange={(e) => {
              handleInputChange(e);
              setUserEmail(e.target.value);
            }}
            onFocus={() => {
              setInputEmailFocused(true);
              setShowFieldError(false);
            }}
            onBlur={() => setInputEmailFocused(false)}
            className={`input email-input ${
              (formErrors.userEmail && !userEmail) ||
              (formErrors.userEmail &&
                !inputNameFocused &&
                !inputPhoneFocused &&
                !inputEmailFocused &&
                !inputMessageFocused)
                ? "error"
                : ""
            }
            `}
          />
          {formErrors.userEmail &&
            !userEmail &&
            !inputNameFocused &&
            !inputPhoneFocused &&
            !inputEmailFocused &&
            !inputMessageFocused && (
              <p className="error-message">
                אנא הכנס את כתובת הדוא"ל שלך בפורמט 'name@example.com'
              </p>
            )}
        </div>
        <div className="input-container">
          <Form.Control
            as="textarea"
            rows={3}
            id="name"
            name="message"
            value={message}
            placeholder="הודעה"
            onChange={(e) => {
              handleInputChange(e);
              setMessage(e.target.value);
            }}
            onFocus={() => {
              setInputMessageFocused(true);
              setShowFieldError(false);
            }}
            onBlur={() => setInputMessageFocused(false)}
            className={`input message-input ${
              (formErrors.message && !message) ||
              (formErrors.message &&
                !inputNameFocused &&
                !inputEmailFocused &&
                !inputMessageFocused)
                ? "error"
                : ""
            }
            `}
          />
          {formErrors.message &&
            !message &&
            !inputNameFocused &&
            !inputEmailFocused &&
            !inputMessageFocused && (
              <p className="error-message">בבקשה הכנס את ההודעה שלך</p>
            )}
        </div>
        <Button variant="primary" type="submit" value="Send">
          צור קשר
        </Button>
      </Form>
      <Alert
        variant="success"
        show={showAlert}
        onClose={() => setShowAlert(false)}
        dismissible
        className="success-alert-message">
        <p className="alert-message-prg">
          Ваше сообщение было успешно отправлено! Мы свяжемся с вами в ближайшее
          время.
        </p>
      </Alert>
      <Alert
        variant="danger"
        show={showErrorAlert}
        onClose={() => setShowErrorAlert(false)}
        dismissible
        className="error-alert-message">
        <p className="alert-message-prg">
          Что-то пошло не так... Пожалуйста, заполните форму снова.
        </p>
      </Alert>
      <Alert
        variant="danger"
        show={showFieldError}
        onClose={() => setShowFieldError(false)}
        dismissible
        className="error-alert-message">
        <p className="alert-message-prg">
          Пожалуйста, заполните все поля для отправки формы.
        </p>
      </Alert>
    </div>
  );
}
