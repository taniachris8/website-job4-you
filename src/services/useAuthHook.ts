import { useContext } from "react";
import { AuthContext } from "./authContextSetup";

export const useAuth = () => useContext(AuthContext);
