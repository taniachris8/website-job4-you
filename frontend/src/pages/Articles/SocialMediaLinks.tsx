import "./SocialMediaLinks.css";

export function SocialMediaLinks() {
  return (
    <div>
      <div className="article-social-media">
        <div className="article-social-icon">
          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noopener noreferrer">
            <i className="fa-brands fa-facebook fa-lg"></i>
          </a>
        </div>
        <div className="article-social-icon">
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer">
            <i className="fa-brands fa-linkedin fa-lg"></i>
          </a>
        </div>
        <div className="article-social-icon">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer">
            <i className="fa-brands fa-instagram fa-lg"></i>
          </a>
        </div>
        <div className="article-social-icon">
          <a
            href="https://www.whatsapp.com"
            target="_blank"
            rel="noopener noreferrer">
            <i className="fa-brands fa-whatsapp fa-lg"></i>
          </a>
        </div>
        <div
          className="article-social-icon"
          onClick={(e) => {
            e.preventDefault();
            window.print();
          }}>
          <i className="fa-solid fa-print fa-lg"></i>
        </div>
      </div>
    </div>
  );
}
