import { useNavigate } from "react-router-dom";

import { Button } from "../../components/button/Button";

import "./NotFoundPage.css";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <main className="not-found-page">
      <section className="not-found-shell">
        <div className="not-found-card">
          <div className="not-found-badge">404</div>
          <p className="not-found-eyebrow">Navigation error</p>
          <h1 className="not-found-title">Page was not found</h1>
          <p className="not-found-description">
            Oops, this page was not found
          </p>

          <div className="not-found-actions">
            <Button variant="primary" onClick={() => navigate("/")}>
              Back to Home page
            </Button>
            <Button variant="secondary" onClick={() => navigate("/jobs")}>
              See job posts
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
