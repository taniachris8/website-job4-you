import { useState } from "react";

import { Button } from "../../components/button/Button";
import { RequestCVModal } from "../../components/request-cv-modal/RequestCVModal";

import "./UserCv.css";

export function UserCVPage() {
  const [showRequestCVModal, setShowRequestCVModal] = useState(false);

  const handleCloseModal = () => setShowRequestCVModal(false);
  const handleShowModal = () => setShowRequestCVModal(true);

  return (
    <>
      <section className="user-cv-container">
        <div className="user-cv-shell">
          <div className="user-cv-main">
            <div className="user-cv-hero-card">
              <p className="user-cv-eyebrow">שירות אישי</p>
              <h1 className="user-cv-title">כתיבת קורות חיים בהתאמה אישית בתשלום</h1>
              <div className="user-cv-copy">
                <p className="user-cv-prg">
                  אנו יכולים לסייע בכתיבת קורות חיים בעברית
                </p>
                <p className="user-cv-prg">
                  זה פשוט מאוד: ננהל שיחה אישית כדי להכיר אותך לעומק, נאפיין את
                  הצרכים שלך, נדגיש את היתרונות שלך, נבצע אופטימיזציית מילות
                  מפתח ונתאים את קורות החיים שלך בדיוק בשבילך.
                </p>
                <p className="user-cv-prg">
                  קורות חיים בהתאמה אישית: יזניקו לך את הקריירה יבדלו אותך
                  מהמתחרים ישפרו את סיכויי הקבלה שלך ישפרו את השכר שלך יובילו
                  אותך להצלחה
                </p>
              </div>
              <div className="user-cv-actions">
                <Button variant="primary" onClick={handleShowModal}>
                  Request a CV
                </Button>
              </div>
            </div>

            <div className="cv-how-it-works">
              <div className="cv-how-it-works-header">
                <p className="cv-how-it-works-eyebrow">תהליך עבודה</p>
                <h2 className="how-it-works-title">איך זה עובד ?</h2>
              </div>
              <ul className="how-it-works-list-wrapper">
                <li className="how-it-works-list">
                  <span className="how-it-works-step">1</span>
                  <span>
                    מלא את הטופס ושלח לנו את קורות החיים הישנים שלך (לא חובה)
                  </span>
                </li>
                <li className="how-it-works-list">
                  <span className="how-it-works-step">2</span>
                  <span>מנהלים שיחת רקע ראשונית</span>
                </li>
                <li className="how-it-works-list">
                  <span className="how-it-works-step">3</span>
                  <span>אנשי המקצוע שלנו יבנו לכם קורות חיים של מקצוענים</span>
                </li>
                <li className="how-it-works-list">
                  <span className="how-it-works-step">4</span>
                  <span>קורות החיים המקצועיים שלכם ימתינו לכם בתיבת המייל</span>
                </li>
              </ul>
            </div>
          </div>

          <aside className="user-cv-side-panel">
            <p className="user-cv-side-eyebrow">למה זה עוזר?</p>
            <h2 className="user-cv-side-title">מסמך מקצועי שמציג אתכם טוב יותר</h2>
            <p className="user-cv-side-text">
              קורות חיים מדויקים ומחודדים עוזרים להציג את הניסיון שלכם בצורה
              ברורה, ממוקדת, ומרשימה יותר מול מעסיקים.
            </p>
            <div className="user-cv-benefits">
              <div className="user-cv-benefit">
                <i className="fa-solid fa-check user-cv-benefit-icon"></i>
                <p className="user-cv-benefit-text">התאמה אישית לצרכים שלכם</p>
              </div>
              <div className="user-cv-benefit">
                <i className="fa-solid fa-check user-cv-benefit-icon"></i>
                <p className="user-cv-benefit-text">שפה מקצועית וברורה יותר</p>
              </div>
              <div className="user-cv-benefit">
                <i className="fa-solid fa-check user-cv-benefit-icon"></i>
                <p className="user-cv-benefit-text">תהליך פשוט עם ליווי אישי</p>
              </div>
            </div>
          </aside>
        </div>
        <RequestCVModal
          showRequestCVModal={showRequestCVModal}
          onHide={handleCloseModal}
        />
      </section>
    </>
  );
}
