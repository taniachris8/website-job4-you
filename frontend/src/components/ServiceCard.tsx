import "./components-css/ServiceCard.css";

interface ServiceCardProps {
  image: string;
  title: string;
  description?: string;
}

export function ServiceCard({ image, title, description }: ServiceCardProps) {
  return (
    <article className="service-card-cntr">
      <div className="service-card-img-cntr">
        <img alt="Service-card" src={image} className="service-card-img" />
      </div>
      <div className="service-card-info">
        <h3 className="service-card-title">{title}</h3>
        <p className="service-card-description">{description}</p>
      </div>
    </article>
  );
}
