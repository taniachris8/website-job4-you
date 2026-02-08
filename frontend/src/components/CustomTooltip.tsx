import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import type { OverlayTriggerProps } from "react-bootstrap/OverlayTrigger";

interface CustomTooltipProps {
  message: string;
  placement?: OverlayTriggerProps["placement"];
  children: React.ReactElement;
}

export function CustomTooltip({
  message,
  placement = "bottom",
  children,
}: CustomTooltipProps) {
  return (
    <OverlayTrigger
      placement={placement}
      overlay={<Tooltip id={`tooltip-${placement}`}>{message}</Tooltip>}>
      {children}
    </OverlayTrigger>
  );
}
