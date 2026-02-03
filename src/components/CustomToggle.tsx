import React from "react";

export const CustomToggle = React.forwardRef<
  HTMLDivElement,
  { children?: React.ReactNode; onClick?: (e: React.MouseEvent) => void }
>(({ children, onClick }, ref) => (
  <div
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick?.(e);
    }}>
    {children}
  </div>
));
