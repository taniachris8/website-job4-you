import { createContext } from "react";
import type { FilterContextType, SelectedFilters } from "../types";

const defaultSelectedFilters: SelectedFilters = {
  area: [],
  domain: [],
  profession: [],
  scope: [],
};

export const FilterContext = createContext<FilterContextType>({
  searchTerm: "",
  setSearchTerm: () => {},
  selectedFilters: defaultSelectedFilters,
  setSelectedFilters: () => {},
  filteredJobs: [],
  applyFilters: () => {},
  setFilteredJobs: () => {},
});

export { defaultSelectedFilters };
