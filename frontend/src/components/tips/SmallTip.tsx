import { Link } from "react-router-dom";
import "./SmallTip.css";

interface SmallTipProps {
  path: string;
  image: string;
  title: string;
  date: string;
}

export function SmallTip({ path, image, title, date }: SmallTipProps) {
  return (
    <article className="small-tip__wrapper">
      <Link className="small-tip__link" to={path}>
        <figure className="small-tip-image-wrapper">
          <img alt="SmallTip" src={image} className="small-tip-image" />
        </figure>

        <div className="small-tip__info">
          <header>
            <h2 className="small-tip-title">{title}</h2>
            <time className="small-tip__date" dateTime={date}>
              {date}
            </time>
          </header>
        </div>
      </Link>
    </article>
  );
}
