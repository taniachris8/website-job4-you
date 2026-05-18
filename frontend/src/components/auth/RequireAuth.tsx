import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../../store/hooks";

export function RequireAuth({ children }: { children: ReactNode }) {
  const user = useAppSelector((state) => state.auth.user);
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
