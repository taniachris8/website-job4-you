import type { ReactNode } from "react";
import { SocialMediaLinks } from "../social-media-links/SocialMediaLinks";
import { Tip } from "../tips/tip/Tip";
import { tips } from "../../consts/tips";
import { yesterdayDate } from "../../consts/date";

import "./Article.css";


type ArticleProps = {
  index: number;
  image: string;
  title: string;
  children: ReactNode;
};

export function Article({ index, image, title, children }: ArticleProps) {
  const filteredTips = tips
    .filter((tip) => tip.path !== `/article_${index}`)
    .slice(0, 2);

  return (
    <main className="article-container">
      <article className="article-shell">
        <header className="article-hero">
          <figure className="article-image-wrapper">
            <img alt="Article" src={image} className="article-image" />
          </figure>
          <div className="article-hero-copy">
            <p className="article-eyebrow">מאמר מקצועי</p>
            <time className="article-date">{yesterdayDate}</time>
            <h1 className="article-title">{title}</h1>
          </div>
        </header>

        <div className="article-body-layout">
          <aside className="article-social-column" aria-label="Share article">
            <SocialMediaLinks />
          </aside>

          <div className="article-content-card">
            <section className="article-paragraphs">{children}</section>
          </div>
        </div>
      </article>

      <aside
        className="more-articles-container"
        aria-labelledby="more-articles-heading">
        <div className="more-articles-header">
          <p className="more-articles-eyebrow">המשך קריאה</p>
          <h2 id="more-articles-heading">מאמרים נוספים שיכולים לעניין אותך</h2>
        </div>
        <div className="more-arts-wrapper">
          {filteredTips.map((tip) => (
            <div key={tip.path} className="more-article-wr">
              <Tip
                path={tip.path}
                image={tip.image}
                title={tip.title}
                articlePreview={tip.articlePreview}
              />
            </div>
          ))}
        </div>
      </aside>
    </main>
  );
}
