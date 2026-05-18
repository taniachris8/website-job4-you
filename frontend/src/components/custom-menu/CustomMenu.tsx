import React, { useState } from "react";
import Form from "react-bootstrap/Form";

export const CustomMenu = React.forwardRef<
  HTMLDivElement,
  {
    children?: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    "aria-labelledby"?: string;
  }
>(({ children, style, className, "aria-labelledby": labeledBy }, ref) => {
  const [value, setValue] = useState("");

  return (
    <div
      ref={ref}
      style={style}
      className={className}
      aria-labelledby={labeledBy}>
      <Form.Control
        autoFocus
        className="mx-3 my-2 w-auto"
        placeholder="הקלד כדי לסנן ..."
        onChange={(e) => setValue(e.target.value)}
        value={value}
      />
      <ul className="list-unstyled">
        {React.Children.toArray(children)
          .filter((child) => {
            if (!value) return true;
            if (!React.isValidElement(child)) return false;
            const childText = (
              (child as React.ReactElement<{ children?: React.ReactNode }>)
                ?.props?.children ?? ""
            )
              .toString()
              .toLowerCase();
            return childText.startsWith(value.toLowerCase());
          })
          .map((child) =>
            React.isValidElement(child) ? React.cloneElement(child, {}) : child,
          )}
      </ul>
    </div>
  );
});
