import { Link } from "react-router-dom";
import "./Tip.css";
import { Button } from "../buttons/Button";

interface TipProps {
  path: string;
  image: string;
  title: string;
  date: string;
  articlePreview?: string;
}

export function Tip({ path, image, title, date, articlePreview }: TipProps) {
  return (
    <article className="tip__wrapper">
      <Link className="tip__link" to={path}>
        <figure className="tip-image-wrapper">
          <img alt="Tip" src={image} className="tip-image" />
        </figure>
        <header className="tip__header">
          <h2 className="tip-title">{title}</h2>
          <time className="tip__date" dateTime={date}>
            {date}
          </time>
        </header>
        <div className="tip__info">
          <div className="tip-article">
            <p className="job-article-preview">{articlePreview}</p>
          </div>
        </div>
        <footer className="tip__footer">
          <Button variant="primary">קרא עוד</Button>
        </footer>
      </Link>
    </article>
  );
}
