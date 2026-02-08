import { useAuth } from "../../services/AuthContext";

export const Admin = () => {
  const { user } = useAuth();

  if (!user || user.role !== "admin") {
    return <div>Access denied</div>;
  }

  return <div>Welcome, {user?.name}! You are logged in as an admin.</div>;
};
