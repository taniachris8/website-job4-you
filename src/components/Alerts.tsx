import Alert from "react-bootstrap/Alert";

interface AlertsProps {
  variant?: string;
  alertText?: React.ReactNode;
  showAlert?: boolean;
}

export function Alerts({ variant, alertText, showAlert }: AlertsProps) {
  return <>{showAlert && <Alert variant={variant}>{alertText}</Alert>}</>;
}
