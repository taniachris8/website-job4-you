import { createContext } from "react";
import type { AuthContextType } from "../types";

const defaultAuth: AuthContextType = {
  user: null,
  setUser: () => {},
  login: () => {},
  logout: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuth);
