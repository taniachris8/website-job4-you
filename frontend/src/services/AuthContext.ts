// Re-export named exports from the TSX implementation to keep existing import paths working.
// This file exists for compatibility; the React implementation lives in AuthContext.tsx.
export { useAuth, AuthProvider } from "./AuthContext.tsx";
export type { User, AuthContextType } from "../types";
