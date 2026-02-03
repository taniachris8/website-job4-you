import "./pages-css/AboutCompany.css";
import { AboutCompanySection } from "../components/AboutCompanySection";
import { ServiceCard } from "../components/ServiceCard";

export function AboutCompanyPage() {
  return (
    <>
      <AboutCompanySection />
      <div className="about-company-upper-block">
        <div className="about-company-img-cntnr">
          <img
            alt="Company"
            src="images/image3.jpg"
            className="about-company-img"
          />
        </div>
        <div className="about-company-text">
          <h1 className="text-title">אודותינו</h1>
          <p>
            חברתנו עוסקת בקשת רחבה ומגוונת של פעילויות בתחום משאבי אנוש ובין
            היתר מתמחה באיתור וגיוס מועמדים איכותיים במגוון תחומי תעסוקה במשק
            ובכל הדרגים הכולל: אנשי שיווק ומכירה, כספים וכלכלה, עובדים
            טכנולוגיים, call center אדמיניסטרציה ועוד.
          </p>
          <p>
            עבודתנו מתבססת על הניסיון האישי בגיוס, קליטה וניהול כח אדם בחברות
            גדולות במשק, תוך התאמה מקסימאלית למציאות התעסוקה בשוק התחרותי בו
            רמות כח האדם בתחומי עיסוק רב ומגוון.
          </p>
          <p>
            מניסיוננו הרב אנו מודעים למשאבים הרבים אשר משקיעים הארגונים בגיוס
            עובדים המתאימים לתפקיד החל מתהליך הגיוס, השקעה בקליטה וההכשרה של
            העובד.
          </p>
          <p>
            חברתנו עוזרת למעסיק לצמצם משמעותית את זמן החיפוש אחר מועמדים מתאימים
            ומייעלת את תהליך הקליטה.
          </p>
          <p>
            בתהליך גיוס העובדים מבחינתנו, הדגש הוא על התאמה מרבית בין העובד
            למקום העבודה, ולשם כך כל מועמד לפני שהוא מוצע לתפקיד ונשלח לראיון
            במקום העבודה, עובר בין היתר, ריאיון עומק.
          </p>
          <p>
            ג'וב פור יו מחויבת למצוינות ומקצועיות בשירות הניתן ללקוחותיה, חברות
            ומועמדים גם יחד! נשמח לעמוד לשירותכם בכל עת, צוות ג'וב פור יו
          </p>
        </div>
      </div>
      <div className="our-services-cntr">
        <h3 className="our-services-title">השירותים שלנו</h3>
        <div className="service-cards-wrapper">
          <div className="service-card-cntr">
            <ServiceCard
              image="images/service.jpg"
              title="גיוס והשמה"
              description="גיוס והשמת עובדים עבור חברות מובילות בכל ענפי המשק, ומציאת פתרונות תעסוקה למחפשי עבודה. אנו מתמחים בקשת רחבה של תפקידים בכל הדרגים."
            />
          </div>
          <div className="service-card-cntr">
            <ServiceCard
              image="images/service2.jpg"
              title="מרכזי הכוון תעסוקתי"
              description="גיוס והשמת עובדים עבור חברות מובילות בכל ענפי המשק, ומציאת פתרונות תעסוקה למחפשי עבודה. אנו מתמחים בקשת רחבה של תפקידים בכל הדרגים."
            />
          </div>
          <div className="service-card-cntr">
            <ServiceCard
              image="images/service3.jpg"
              title="תוכניות הכשרה"
              description="גיוס והשמת עובדים עבור חברות מובילות בכל ענפי המשק, ומציאת פתרונות תעסוקה למחפשי עבודה. אנו מתמחים בקשת רחבה של תפקידים בכל הדרגים."
            />
          </div>
          <div className="service-card-cntr">
            <ServiceCard
              image="images/service4.jpg"
              title="אבחון ומיון"
              description="גיוס והשמת עובדים עבור חברות מובילות בכל ענפי המשק, ומציאת פתרונות תעסוקה למחפשי עבודה. אנו מתמחים בקשת רחבה של תפקידים בכל הדרגים."
            />
          </div>
          <div className="service-card-cntr">
            <ServiceCard
              image="images/service5.jpg"
              title="שירותים מנוהלים"
              description="גיוס והשמת עובדים עבור חברות מובילות בכל ענפי המשק, ומציאת פתרונות תעסוקה למחפשי עבודה. אנו מתמחים בקשת רחבה של תפקידים בכל הדרגים."
            />
          </div>
        </div>
      </div>
    </>
  );
}
