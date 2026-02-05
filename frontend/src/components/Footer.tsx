import "./components-css/Footer.css";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-columns">
        <div className="logo-column">
          <div className="footer-logo-wrapper">
            <img src="logo-job.webp" alt="logo" className="footer-logo" />
          </div>
          <nav
            className="social-media-container"
            aria-label="Social media links">
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer">
              <i className="fa-brands fa-linkedin" aria-hidden="true"></i>
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer">
              <i className="fa-brands fa-facebook" aria-hidden="true"></i>
            </a>
            <a
              href="https://www.whatsapp.com"
              target="_blank"
              rel="noopener noreferrer">
              <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer">
              <i className="fa-brands fa-instagram" aria-hidden="true"></i>
            </a>
          </nav>
        </div>
        <nav className="first-column" aria-label="Site navigation">
          <h3 className="footer-title">ניווט באתר</h3>
          <ul className="text-links-container">
            <li>
              <Link className="text-links" to="/">
                עמוד הבית
              </Link>
            </li>
            <li>
              <Link className="text-links" to="/users-CV">
                כתיבת קורות חיים
              </Link>
            </li>
            <li>
              <Link className="text-links" to="/jobs">
                דרושים
              </Link>
            </li>
            <li>
              <Link className="text-links" to="/about-company">
                קצת עלינו
              </Link>
            </li>
            <li>
              <Link className="text-links" to="/rights">
                תנאי שימוש
              </Link>
            </li>
          </ul>
        </nav>
        <nav className="second-column" aria-label="Blog posts">
          <h3 className="footer-title">בלוג מחפשי עבודה</h3>
          <ul className="text-links-container">
            <li>
              <Link className="text-links" to="/article_1">
                טיפים לראיון עבודה
              </Link>
            </li>
            <li>
              <Link className="text-links" to="/article_2">
                כלים לניהול פרוייקט החזרה לשוק העבודה
              </Link>
            </li>
            <li>
              <Link className="text-links" to="/article_3">
                השאלות הכי קשות בראיון עבודה
              </Link>
            </li>
            <li>
              <Link className="text-links" to="/article_4">
                חיפוש עבודה - כך תעשו את זה נכון
              </Link>
            </li>
          </ul>
        </nav>

        <address className="forth-column">
          <h3 className="footer-title">פרטי התקשרות</h3>
          <p className="contact">
            <i className="fa-solid fa-phone icon-footer" aria-hidden="true"></i>
            <span className="contact-item">+972-039080124</span>
          </p>
          <p className="contact">
            <a href="mailto:limor@job4you.co.il">
              <i
                className="fa-solid fa-envelope icon-footer"
                aria-hidden="true"></i>
            </a>
            <span className="contact-item">limor@job4you.co.il</span>
          </p>
          <p className="contact">
            <i className="fa-solid fa-clock icon-footer" aria-hidden="true"></i>
            <span className="contact-item"> 8-18</span>
          </p>
        </address>
      </div>
      <div className="website-rights">
        <small className="year">© 2026 Job4You כל הזכויות שמורות</small>
        <nav aria-label="Legal">
          <Link className="conditions" to="/terms-of-use">
            תנאי שימוש
          </Link>
        </nav>
        <div className="author">Produced by TO</div>
      </div>
    </footer>
  );
}
