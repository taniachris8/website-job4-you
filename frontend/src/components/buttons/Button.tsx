import "./Button.css";
import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: string;
  children?: ReactNode;
}

export const Button = ({ variant = "", children, ...props }: ButtonProps) => {
  const className = `button ${variant}`;

  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
};
