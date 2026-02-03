import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import Cookies from "js-cookie";
import type { User, AuthContextType } from "../types";

const defaultAuth: AuthContextType = {
  user: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuth);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (userData: Partial<User>) => {
    const updatedUser = { ...user, ...userData }; // Keep the existing id and other fields
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
