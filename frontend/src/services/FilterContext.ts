// Re-export named exports from the implementations to keep existing import paths working.
export { FilterContext, defaultSelectedFilters } from "./filterContextSetup";
export { FilterProvider } from "./FilterContext.tsx";
export type { FilterContextType, SelectedFilters } from "../types";
