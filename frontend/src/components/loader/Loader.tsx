import "./Loader.css";

type LoaderVariant = "page" | "inline" | "compact";

interface LoaderProps {
  className?: string;
  label?: string;
  showLabel?: boolean;
  variant?: LoaderVariant;
}

export function Loader({
  className = "",
  label = "טוען...",
  showLabel = false,
  variant = "page",
}: LoaderProps) {
  const classes = ["loader", `loader--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={classes} role="status" aria-live="polite" aria-label={label}>
      <div className="loader__glass" aria-hidden="true">
        <div className="loader__ring"></div>
        <div className="loader__orb loader__orb--primary"></div>
        <div className="loader__orb loader__orb--secondary"></div>
        <div className="loader__orb loader__orb--tertiary"></div>
      </div>
      <span className={showLabel ? "loader__label" : "loader__label loader__label--sr"}>
        {label}
      </span>
    </div>
  );
}
