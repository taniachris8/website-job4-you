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
    <>
      <div className="tip__wrapper">
        <Link className="tip__link" to={path}>
          <div className="tip-image-wrapper">
            <img alt="Tip" src={image} className="tip-image" />
          </div>
          <h1 className="tip-title">{title}</h1>
          <div className="tip__info">
            <p className="tip__date">{date}</p>
            <div className="tip-article">
              <p className="job-article-preview">{articlePreview}</p>
            </div>
          </div>
          <Button variant="primary">קרא עוד</Button>
        </Link>
      </div>
    </>
  );
}
