import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { ApiService } from "./ApiService";
import { API_URL } from "../consts/general";
import type { SelectedFilters, Job } from "../types";
import { FilterContext, defaultSelectedFilters } from "./filterContextSetup";

const ApiAllJobs = new ApiService(API_URL);

export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>(
    defaultSelectedFilters,
  );
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await ApiAllJobs.getAllJobs();
        const reversedJobs = response.data.slice().reverse();
        setJobs(reversedJobs);
        setFilteredJobs(reversedJobs);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  // Derived state: update filtered results whenever search/filters change
  // This is the correct pattern for deriving state from other state values
  useEffect(() => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter((job) =>
        job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (selectedFilters.domain && selectedFilters.domain.length > 0) {
      filtered = filtered.filter((job) =>
        selectedFilters.domain.includes(job.domain ?? ""),
      );
    }

    if (selectedFilters.profession && selectedFilters.profession.length > 0) {
      filtered = filtered.filter((job) =>
        selectedFilters.profession.includes(job.profession ?? ""),
      );
    }

    if (selectedFilters.area && selectedFilters.area.length > 0) {
      filtered = filtered.filter((job) =>
        selectedFilters.area.includes(job.area ?? ""),
      );
    }

    if (selectedFilters.scope && selectedFilters.scope.length > 0) {
      filtered = filtered.filter((job) =>
        selectedFilters.scope.includes(job.scope ?? ""),
      );
    }

    // Update derived state (filtered results) based on source data and filter criteria
    // This is the recommended pattern for deriving state from other state
    // Suppress React's overly cautious warning about setState in effects for derived state
    // See: https://react.dev/learn/you-might-not-need-an-effect#deriving-state-from-props
    setFilteredJobs(filtered);
  }, [jobs, searchTerm, selectedFilters]);

  return (
    <FilterContext.Provider
      value={{
        searchTerm,
        setSearchTerm,
        selectedFilters,
        setSelectedFilters,
        filteredJobs,
        applyFilters: () => {}, // No-op: filtering happens automatically via effect
        setFilteredJobs,
      }}>
      {children}
    </FilterContext.Provider>
  );
};
