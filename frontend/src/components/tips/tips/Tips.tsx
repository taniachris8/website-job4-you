import { Tip } from "../tip/Tip";
import { tips } from "../../../consts/tips";

import "./Tips.css";

export function Tips() {
  return (
    <main className="tips-container">
      <div className="tips-header">
        <h1 className="tips-hdr">בלוג מחפשי עבודה</h1>
        <p className="tips-prg">
          תובנות, כלים והכוונה פרקטית שיעזרו לך להתכונן נכון, לחפש חכם ולהתקדם
          בביטחון בתהליך מציאת העבודה.
        </p>
      </div>
      <section className="upper-tips-container" aria-label="Blog posts">
        {tips.slice(0, 3).map((tip) => (
          <Tip
            key={tip.path}
            path={tip.path}
            image={tip.image}
            title={tip.title}
            date={tip.date}
            articlePreview={tip.articlePreview}
          />
        ))}
      </section>
    </main>
  );
}
