import { createContext, useState, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import Cookies from "js-cookie";
import type { User, AuthContextType } from "../types";
import { ACCESS_TOKEN_COOKIE, TOKEN_TYPE_COOKIE } from "../axios/axiosConfig";

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

  const login = (userData: Partial<User>, accessToken?: string) => {
    const normalizedUser = {
      ...user,
      ...userData,
      _id: userData._id ?? userData.id ?? user?._id ?? user?.id,
      id: userData.id ?? userData._id ?? user?.id ?? user?._id,
    };
    setUser(normalizedUser as User);
    Cookies.set("user", JSON.stringify(normalizedUser), { expires: 7 });
    if (accessToken) {
      Cookies.set(ACCESS_TOKEN_COOKIE, accessToken, {
        secure: window.location.protocol === "https:",
        sameSite: "Strict",
      });
      Cookies.set(TOKEN_TYPE_COOKIE, "Bearer", {
        secure: window.location.protocol === "https:",
        sameSite: "Strict",
      });
    }
  };

  const logout = () => {
    setUser(null);
    Cookies.remove("user");
    Cookies.remove(ACCESS_TOKEN_COOKIE);
    Cookies.remove(TOKEN_TYPE_COOKIE);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
