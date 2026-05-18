import "./Button.css";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  children?: ReactNode;
}

export const Button = ({
  variant = "",
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) => {
  const mergedClassName = ["button", variant, className].filter(Boolean).join(" ");

  return (
    <button className={mergedClassName} type={type} {...props}>
      {children}
    </button>
  );
};
