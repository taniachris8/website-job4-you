import { useNavigate } from "react-router-dom";
import { Button } from "../button/Button";

import "../../App.css";
import "./AboutUs.css";

const featureCards = [
  {
    title: "גיוס מהיר ואיכותי",
    description: "תהליך גיוס מדויק שמביא תוצאות בזמן קצר",
    iconClassName: "fa-solid fa-user-group",
    backgroundClassName: "about-us-feature-card-recruiting",
  },
  {
    title: "התאמה אישית",
    description: "מכירים את הצרכים שלכם ומוצאים את האנשים הנכונים",
    iconClassName: "fa-solid fa-bullseye",
    backgroundClassName: "about-us-feature-card-matching",
  },
  {
    title: "מאגר מועמדים רחב",
    description: "גישה למאגר גדול של מועמדים מתאימים ומנוסים",
    iconClassName: "fa-solid fa-users",
    backgroundClassName: "about-us-feature-card-candidates",
  },
];

export function AboutUs() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/about-company");
  };

  return (
    <section className="about-us-section" aria-labelledby="about-us-title">
      <div className="about-us-shell">
        <div className="about-us-grid">
          <div className="about-us-content-column">
            <article className="about-us-content-card about-us-content-card-primary">
              <p className="about-us-label">אודותינו</p>

              <h1 id="about-us-title">
                Job4You- שירותי גיוס,יעוץ והשמת כח אדם
              </h1>

              <p className="about-us-lead">
                חברתנו עוסקת בקשת רחבה ומגוונת של פעילויות בתחום משאבי אנוש ובין
                היתר מתמחה באיתור וגיוס מועמדים איכותיים במגוון תחומי תעסוקה
                במשק ובכל הדרגים הכולל: אנשי שיווק ומכירה, כספים וכלכלה, עובדים
                טכנולוגיים, call center אדמיניסטרציה ועוד.
              </p>

              <div className="about-us-actions">
                <Button onClick={handleRedirect} variant="primary">
                  פרטים נוספים
                </Button>
                <div className="about-us-stat-pill" aria-label="15 שנות ניסיון">
                  <span>שנות ניסיון</span>
                  <strong>15+</strong>
                </div>
              </div>
            </article>

            <article className="about-us-content-card about-us-content-card-secondary">
              <h2>15 שנות ניסיון</h2>
              <p className="about-us-secondary-lead">
                Job4You- שירותי גיוס,יעוץ והשמת כח אדם
              </p>
              <p className="about-us-secondary-text">
                כשהשחר פרץ מעל הנוף השלו, קול ציוץ הציפורים הביא את היום החדש.
                ניחוח הקפה הטרי מילא את האוויר, מתערבב עם זרימת הרוח הרך שנזרקה
                דרך החלון הפתוח. עם נשימה מרוצה, שרה שתה דרך המס וטעמה את שקט
                הרגע לפני שארובת היום החלה.
              </p>
            </article>
          </div>

          <div className="about-us-visual-column">
            <div
              className="about-us-visual-panel"
              role="img"
              aria-label="איור מופשט המתאר חיבור בין אנשים, קריירה וצמיחה"></div>
          </div>
          
          <aside
            className="about-us-features-column"
            aria-label="יתרונות השירות">
            {featureCards.map((card) => (
              <article
                className={`about-us-feature-card ${card.backgroundClassName}`}
                key={card.title}>
                <div className="about-us-feature-icon" aria-hidden="true">
                  <span className="about-us-feature-icon-ring"></span>
                  <i className={card.iconClassName}></i>
                </div>
                <h2>{card.title}</h2>
                <p>{card.description}</p>
              </article>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
