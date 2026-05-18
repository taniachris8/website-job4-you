import { Button } from "../button/Button";

import "./ErrorMessage.css";

interface ErrorMessageProps {
  title?: string;
  message: string;
  actionLabel?: string;
  onRetry?: () => void;
  className?: string;
  compact?: boolean;
}

export function ErrorMessage({
  title = "\u05DE\u05E9\u05D4\u05D5 \u05D4\u05E9\u05EA\u05D1\u05E9",
  message,
  actionLabel = "\u05E0\u05E1\u05D5 \u05E9\u05D5\u05D1",
  onRetry,
  className = "",
  compact = false,
}: ErrorMessageProps) {
  const classes = ["error-message-card", compact ? "error-message-card--compact" : "", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role="alert" dir="rtl">
      <div className="error-message-card__icon" aria-hidden="true">
        <i className="fa-solid fa-wifi"></i>
      </div>
      <div className="error-message-card__content">
        <h2 className="error-message-card__title">{title}</h2>
        <p className="error-message-card__text">{message}</p>
        {onRetry ? (
          <Button
            className="error-message-card__button"
            variant="secondary"
            onClick={onRetry}>
            {actionLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
