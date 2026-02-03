import "./components-css/Footer.css";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <div className="footer-container">
      <div className="footer-columns">
        <div className="logo-column">
          <div className="footer-logo-wrapper">
            <img src="logo-job.webp" alt="logo" className="footer-logo" />
          </div>
          <div className="social-media-container">
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-linkedin"></i>
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-facebook"></i>
            </a>
            <a
              href="https://www.whatsapp.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-whatsapp"></i>
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa-brands fa-instagram"></i>
            </a>
          </div>
        </div>
        <div className="first-column">
          <h3 className="footer-title">ניווט באתר</h3>
          <Link className="text-links" to="/">
            עמוד הבית
          </Link>
          <Link className="text-links" to="/users-CV">
            כתיבת קורות חיים
          </Link>
          <Link className="text-links" to="/jobs">
            דרושים
          </Link>
          <Link className="text-links" to="/about-company">
            קצת עלינו
          </Link>
          <Link className="text-links" to="/rights">
            תנאי שימוש
          </Link>
        </div>
        <div className="second-column">
          <h3 className="footer-title">בלוג מחפשי עבודה</h3>
          <Link className="text-links" to="/article_1">
            טיפים לראיון עבודה
          </Link>
          <Link className="text-links" to="/article_2">
            כלים לניהול פרוייקט החזרה לשוק העבודה
          </Link>
          <Link className="text-links" to="/article_3">
            השאלות הכי קשות בראיון עבודה
          </Link>
          <Link className="text-links" to="/article_4">
            חיפוש עבודה - כך תעשו את זה נכון
          </Link>
        </div>

        <div className="forth-column">
          <h3 className="footer-title">פרטי התקשרות</h3>
          <div className="contact">
            <i className="fa-solid fa-phone icon-footer"></i>
            <p className="contact-item">972-039080124+</p>
          </div>
          <div className="contact">
            <a href="mailto:limor@job4you.co.il">
              <i className="fa-solid fa-envelope icon-footer"></i>
            </a>
            <p className="contact-item">limor@job4you.co.il</p>
          </div>
          <div className="contact">
            <i className="fa-solid fa-clock icon-footer"></i>
            <p className="contact-item"> 8-18</p>
          </div>
        </div>
      </div>
      <div className="website-rights">
        <div className="year">© 2024 Job4You כל הזכויות שמורות</div>
        <Link className="conditions" to="/terms-of-use">
          תנאי שימוש
        </Link>
        <div className="author">Produced by TO</div>
      </div>
    </div>
  );
}


