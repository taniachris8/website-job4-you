import { useNavigate } from "react-router-dom";
import "../App.css";
import "./components-css/AboutUs.css";
import { Button } from "./buttons/Button";

export function AboutUs() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate("/about-company");
  };

  return (
    <div className="about__us-container">
      <div className="about__us-right__block">
        <div className="about__us-right-img-cntnr">
          <img
            alt="Contract"
            src="images/image8.jpg"
            className="about__us-img"
          />
        </div>
        <div className="experience">
          <h1>15 שנות ניסיון</h1>
          <p>Job4You- שירותי גיוס,יעוץ והשמת כח אדם</p>
          <p>
            כשהשחר פרץ מעל הנוף השלו, קול ציוץ הציפורים הביא את היום החדש. ניחוח
            הקפה הטרי מילא את האוויר, מתערבב עם זרימת הרוח הרך שנזרקה דרך החלון
            הפתוח. עם נשימה מרוצה, שרה שתה דרך המס וטעמה את שקט הרגע לפני שארובת
            היום החלה.
          </p>
        </div>
      </div>
      <div className="about__us-middle__block">
        <div className="about__us-middle-img-cntnr">
          <img
            alt="Meeting"
            src="images/image1.jpg"
            className="about__us-img"
          />
        </div>
        <div className="about__us-scd-middle-img-cntnr">
          <img
            alt="Handshake"
            src="images/image2.jpg"
            className="about__us-img"
          />
        </div>
      </div>
      <div className="about__us-left__block">
        <div className="about__us-info-container">
          <p className="label">אודותינו</p>
          <h1 className="info-title">Job4You- שירותי גיוס,יעוץ והשמת כח אדם</h1>
          <p>
            חברתנו עוסקת בקשת רחבה ומגוונת של פעילויות בתחום משאבי אנוש ובין
            היתר מתמחה באיתור וגיוס מועמדים איכותיים במגוון תחומי תעסוקה במשק
            ובכל הדרגים הכולל: אנשי שיווק ומכירה, כספים וכלכלה, עובדים
            טכנולוגיים, call center אדמיניסטרציה ועוד
          </p>
          <Button onClick={handleRedirect} variant="primary">
            פרטים נוספים
          </Button>
        </div>
        <div className="about__us-left-img-cntnr">
          <img
            alt="Handshake"
            src="images/image3.jpg"
            className="about__us-img"
          />
        </div>
      </div>
    </div>
  );
}
