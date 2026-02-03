import { useState } from "react";
import "./UserCv.css";
import { Button } from "../buttons/Button";
import { RequestCVModal } from "../RequestCVModal";

export function UserCVPage() {
  const [showRequestCVModal, setShowRequestCVModal] = useState(false);

  const handleCloseModal = () => setShowRequestCVModal(false);
  const handleShowModal = () => setShowRequestCVModal(true);

  return (
    <>
      <div className="user-cv-container">
        <h1 className="user-cv-title">כתיבת קורות חיים בהתאמה אישית בתשלום</h1>
        <p className="user-cv-prg">
          {" "}
          אנו יכולים לסייע בכתיבת קורות חיים בעברית
        </p>
        <p className="user-cv-prg">
          זה פשוט מאוד: ננהל שיחה אישית כדי להכיר אותך לעומק, נאפיין את הצרכים
          שלך, נדגיש את היתרונות שלך, נבצע אופטימיזציית מילות מפתח ונתאים את
          קורות החיים שלך בדיוק בשבילך.
        </p>
        <p className="user-cv-prg">
          קורות חיים בהתאמה אישית: יזניקו לך את הקריירה יבדלו אותך מהמתחרים
          ישפרו את סיכויי הקבלה שלך ישפרו את השכר שלך יובילו אותך להצלחה
        </p>

        <div className="cv-how-it-works">
          <h2 className="how-it-works-title">איך זה עובד ?</h2>
          <ul className="how-it-works-list-wrapper">
            <li className="how-it-works-list">
              1. מלא את הטופס ושלח לנו את קורות החיים הישנים שלך (לא חובה)
            </li>
            <li className="how-it-works-list">2. מנהלים שיחת רקע ראשונית</li>
            <li className="how-it-works-list">
              3. אנשי המקצוע שלנו יבנו לכם קורות חיים של מקצוענים
            </li>
            <li className="how-it-works-list">
              4. קורות החיים המקצועיים שלכם ימתינו לכם בתיבת המייל
            </li>
          </ul>
        </div>
        <Button variant="primary" onClick={handleShowModal}>
          Request a CV
        </Button>
        <RequestCVModal
          showRequestCVModal={showRequestCVModal}
          onHide={handleCloseModal}
        />
      </div>
    </>
  );
}
