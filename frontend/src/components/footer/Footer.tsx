import { Link } from "react-router-dom";

import { useAppSelector } from "../../store/hooks";

import "./Footer.css";

export function Footer() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <footer className="footer-container">
      <div className="footer-shell">
        <div className="footer-columns">
          <section
            className="footer-brand-column"
            aria-label="Job4You company summary">
            <div className="footer-logo-wrapper">
              <img
                src="logo-job1.webp"
                alt="Job4You logo"
                className="footer-logo"
              />
            </div>
            <p className="footer-description">
              Job4You מסייעת למחפשי עבודה ולמעסיקים להתחבר באמצעות חוויית גיוס
              ברורה, מקצועית ויעילה.
            </p>
            <nav
              className="social-media-container"
              aria-label="Social media links">
              <a
                className="social-link"
                href="https://www.facebook.com/people/%D7%92%D7%95%D7%91-%D7%A4%D7%95%D7%A8-%D7%99%D7%95-%D7%94%D7%A9%D7%9E%D7%94/100063669032525/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Facebook page">
                <i className="fa-brands fa-facebook" aria-hidden="true"></i>
              </a>
              <a
                className="social-link"
                href="https://wa.me/972039080124"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp">
                <i className="fa-brands fa-whatsapp" aria-hidden="true"></i>
              </a>
              <a
                className="social-link"
                href="https://www.instagram.com/_job_4you?igsh=MWt0cTlicGx2dXY4MQ%3D%3D"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit our Instagram page">
                <i className="fa-brands fa-instagram" aria-hidden="true"></i>
              </a>
            </nav>
          </section>

          <nav className="footer-column" aria-label="Site navigation">
            <h3 className="footer-title">ניווט באתר</h3>
            <ul className="text-links-container">
              <li>
                <Link className="text-links" to="/">
                  עמוד הבית
                </Link>
              </li>
              {user?.role !== "admin" && (
                <li>
                  <Link className="text-links" to="/users-CV">
                    כתיבת קורות חיים
                  </Link>
                </li>
              )}
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

          <nav className="footer-column" aria-label="Career blog posts">
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

          <address className="footer-column footer-contact-column">
            <h3 className="footer-title">פרטי התקשרות</h3>
            <div className="contact-list">
              <p className="contact">
                <i
                  className="fa-solid fa-phone icon-footer"
                  aria-hidden="true"></i>
                <span className="contact-item">+972-039080124</span>
              </p>
              <p className="contact">
                <i
                  className="fa-solid fa-envelope icon-footer"
                  aria-hidden="true"></i>
                <a className="contact-link" href="mailto:limor@job4you.co.il">
                  limor@job4you.co.il
                </a>
              </p>
              <p className="contact">
                <i
                  className="fa-solid fa-clock icon-footer"
                  aria-hidden="true"></i>
                <span className="contact-item">8-18</span>
              </p>
            </div>
          </address>
        </div>

        <div className="website-rights">
          <small className="year">© 2026 Job4You כל הזכויות שמורות</small>
          <nav className="footer-legal" aria-label="Legal">
            <Link className="conditions" to="/terms-of-use">
              תנאי שימוש
            </Link>
          </nav>
          <div className="author">Produced by TO</div>
        </div>
      </div>
    </footer>
  );
}
