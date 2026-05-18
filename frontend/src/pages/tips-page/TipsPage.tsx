import { Tip } from "../../components/tips/tip/Tip";
import { tips } from "../../consts/tips";

import "./TipsPage.css";

export function TipsPage() {
  return (
    <main className="tipspage-container">
      <div className="tipspage-shell">
        <header className="tipspage-header">
          <div className="tipspage-header-copy">
            <p className="tipspage-eyebrow">תוכן מקצועי</p>
            <h1 className="tips-hdr">בלוג מחפשי עבודה</h1>
            <p className="tipspage-prg">
              מדריכים, תובנות וכלים פרקטיים שיעזרו לך להתנהל נכון בתהליך חיפוש
              העבודה, להתכונן טוב יותר ולהתקדם בביטחון.
            </p>
          </div>
          <div className="tipspage-summary">
            <span className="tipspage-summary-number">4</span>
            <span className="tipspage-summary-label">מאמרים</span>
          </div>
        </header>

        <section className="tipspage-featured" aria-label="Featured tips">
          <article className="tip-wrapper tip-wrapper-featured">
            <Tip
              path={tips[0].path}
              image={tips[0].image}
              title={tips[0].title}
              date={tips[0].date}
              articlePreview={tips[0].articlePreview}
            />
          </article>
        </section>

        <section className="tipspage-grid" aria-label="Blog posts">
          {tips.slice(1).map((tip) => (
            <article key={tip.path} className="tip-wrapper">
              <Tip
                path={tip.path}
                image={tip.image}
                title={tip.title}
                date={tip.date}
                articlePreview={tip.articlePreview}
              />
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
