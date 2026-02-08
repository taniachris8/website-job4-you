import { useState } from "react";
import type { ReactNode } from "react";
import Cookies from "js-cookie";
import type { User } from "../types";
import { AuthContext } from "./authContextSetup";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = Cookies.get("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData: Partial<User>) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser as User);
    Cookies.set("user", JSON.stringify(updatedUser), { expires: 7 });
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("user");
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
