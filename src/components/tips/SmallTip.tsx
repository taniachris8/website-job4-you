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
    <>
      <div className="small-tip__wrapper">
        <Link className="small-tip__link" to={path}>
          <div className="small-tip-image-wrapper">
            <img alt="SmallTip" src={image} className="small-tip-image" />
          </div>

          <div className="small-tip__info">
            <h1 className="small-tip-title">{title}</h1>
            <p className="small-tip__date">{date}</p>
          </div>
        </Link>
      </div>
    </>
  );
}
