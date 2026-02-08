import "./Tips.css";
import { Tip } from "./Tip";

export function Tips() {
  return (
    <main className="tips-container">
      <h1 className="tips-hdr">בלוג מחפשי עבודה</h1>
      <section className="upper-tips-container" aria-label="Blog posts">
        <article className="tip-wrapper">
          <Tip
            path="/article_1"
            image="images/image3.jpg"
            title="טיפים לראיון עבודה"
            date="01.02.2026"
            articlePreview=" 
            
            לעיתים, ראיון החלומות שלך עומד בפתח, ואתה רק מחכה כדי להיגאל
            מהמרוץ אחר מודעות הדרושים...
            כל מה שעליך לעשות הוא לשים לב לכמה נקודות עיקריות שיעזרו לך
            לעבור ראיון עבודה בשלום:
              1. התאמן והתכונן כראוי רצוי לעבור הכנה לראיון..."
          />
        </article>
        <article className="tip-wrapper">
          <Tip
            path="/article_2"
            image="images/image5.jpg"
            title="כלים לניהול פרוייקט החזרה לשוק העבודה"
            date="28.01.2026"
            articlePreview="
            אחד הטורים האחרונים עסק בחשיבות של ניהול תהליך חיפוש עבודה
            כפרוייקט לכל דבר, עם דגש על אינטנסיביות החיפוש, תוך שימוש בכלי
            ניהול ובקרת פרוייקט כתנאי להצלחה..."
          />
        </article>
        <article className="tip-wrapper">
          <Tip
            path="/article_3"
            image="images/happy2.jpg"
            title="השאלות הכי קשות בראיון עבודה"
            date="10.02.2026"
            articlePreview="
            השאלות הכי קשות שיכולות לעלות בראיון עבודה חיפוש עבודה יכול להיות עסק לא קל. לפעמים מגיעים לראיון עבודה שאנחנו ממש מצפים לו ולא מכינים את עצמנו לסוג של שאלות שאף פעם לא נשאלנו..."
          />
        </article>
      </section>
    </main>
  );
}
