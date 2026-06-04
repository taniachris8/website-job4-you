import "./SocialMediaLinks.css";

export function SocialMediaLinks() {
  return (
    <div>
      <div className="article-social-media">
        <div className="article-social-icon">
          <a
            href="https://www.facebook.com/people/%D7%92%D7%95%D7%91-%D7%A4%D7%95%D7%A8-%D7%99%D7%95-%D7%94%D7%A9%D7%9E%D7%94/100063669032525/"
            target="_blank"
            rel="noopener noreferrer">
            <i className="fa-brands fa-facebook fa-lg"></i>
          </a>
        </div>
        <div className="article-social-icon">
          <a
            href="https://www.instagram.com/_job_4you?igsh=MWt0cTlicGx2dXY4MQ%3D%3D"
            target="_blank"
            rel="noopener noreferrer">
            <i className="fa-brands fa-instagram fa-lg"></i>
          </a>
        </div>
        <div className="article-social-icon">
          <a
            href="https://wa.me/972039080124"
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
