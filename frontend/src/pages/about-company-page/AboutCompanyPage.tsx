import { AboutCompanySection } from "../../components/about-company-section/AboutCompanySection";
import { ServiceCard } from "../../components/service-card/ServiceCard";
import { services } from "../../consts/services";

import "./AboutCompany.css";

export function AboutCompanyPage() {
  
  return (
    <>
      <AboutCompanySection />
      <section className="about-company-page-container">
        <div className="about-company-upper-block">
          <div className="about-company-img-cntnr">
            <img
              alt="Company"
              src="/images/about-company-main.png"
              className="about-company-img"
            />
          </div>
          <div className="about-company-text">
            <p className="about-company-eyebrow">החברה שלנו</p>
            <h1 className="text-title">אודותינו</h1>
            <div className="about-company-copy">
              <p>
                חברתנו עוסקת בקשת רחבה ומגוונת של פעילויות בתחום משאבי אנוש ובין
                היתר מתמחה באיתור וגיוס מועמדים איכותיים במגוון תחומי תעסוקה
                במשק ובכל הדרגים הכולל: אנשי שיווק ומכירה, כספים וכלכלה, עובדים
                טכנולוגיים, call center אדמיניסטרציה ועוד.
              </p>
              <p>
                עבודתנו מתבססת על הניסיון האישי בגיוס, קליטה וניהול כח אדם
                בחברות גדולות במשק, תוך התאמה מקסימאלית למציאות התעסוקה בשוק
                התחרותי בו רמות כח האדם בתחומי עיסוק רב ומגוון.
              </p>
              <p>
                מניסיוננו הרב אנו מודעים למשאבים הרבים אשר משקיעים הארגונים
                בגיוס עובדים המתאימים לתפקיד החל מתהליך הגיוס, השקעה בקליטה
                וההכשרה של העובד.
              </p>
              <p>
                חברתנו עוזרת למעסיק לצמצם משמעותית את זמן החיפוש אחר מועמדים
                מתאימים ומייעלת את תהליך הקליטה.
              </p>
              <p>
                בתהליך גיוס העובדים מבחינתנו, הדגש הוא על התאמה מרבית בין העובד
                למקום העבודה, ולשם כך כל מועמד לפני שהוא מוצע לתפקיד ונשלח
                לראיון במקום העבודה, עובר בין היתר, ריאיון עומק.
              </p>
              <p>
                ג'וב פור יו מחויבת למצוינות ומקצועיות בשירות הניתן ללקוחותיה,
                חברות ומועמדים גם יחד! נשמח לעמוד לשירותכם בכל עת, צוות ג'וב פור
                יו
              </p>
            </div>
          </div>
        </div>

        <section
          className="about-company-highlights"
          aria-label="Company highlights">
          <div className="about-company-highlight">
            <span className="about-company-highlight-value">גיוס מדויק</span>
            <p className="about-company-highlight-text">
              התאמה איכותית בין מועמדים, תפקידים ותרבות ארגונית.
            </p>
          </div>
          <div className="about-company-highlight">
            <span className="about-company-highlight-value">ליווי אישי</span>
            <p className="about-company-highlight-text">
              תהליך מקצועי עם ראיית עומק של צרכי החברה והמועמד.
            </p>
          </div>
          <div className="about-company-highlight">
            <span className="about-company-highlight-value">שירות מקצועי</span>
            <p className="about-company-highlight-text">
              ניסיון מעשי בגיוס, קליטה וניהול כח אדם במגוון תחומים.
            </p>
          </div>
        </section>

        <div className="our-services-cntr">
          <div className="our-services-header">
            <p className="our-services-eyebrow">תחומי התמחות</p>
            <h3 className="our-services-title">השירותים שלנו</h3>
            <p className="our-services-prg">
              מעטפת שירותים מקצועית שמחברת בין מועמדים, ארגונים ותהליכי צמיחה
              אמיתיים.
            </p>
          </div>
          <div className="service-cards-wrapper">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                image={service.image}
                title={service.title}
                description={service.description}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
