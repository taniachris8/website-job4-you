import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../../store/hooks";

export function RequireNonAdmin({ children }: { children: ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (user.role === "admin") {
    return <Navigate to="/jobs" replace />;
  }

  return <>{children}</>;
}
