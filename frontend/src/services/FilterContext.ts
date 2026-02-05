// Re-export named exports from the TSX implementation to keep existing import paths working.
// This file exists for compatibility; the React implementation lives in FilterContext.tsx.
export { FilterContext, FilterProvider } from "./FilterContext.tsx";
export type { FilterContextType, SelectedFilters } from "../types";
