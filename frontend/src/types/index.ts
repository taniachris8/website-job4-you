import React from "react";

export interface Job {
  id?: string | number;
  _id?: string | number;
  jobTitle: string;
  domain?: string;
  profession?: string;
  area?: string;
  scope?: string;
  jobDescription?: string;
  jobNumber?: string | number;
  jobRequirements?: string;
  [key: string]: unknown;
}

export interface User {
  id?: string | number;
  _id?: string | number;
  name?: string;
  familyName?: string;
  email?: string;
  savedJobs?: string[];
  [key: string]: unknown;
}

export interface SelectedFilters {
  area: string[];
  domain: string[];
  profession: string[];
  scope: string[];
}

export interface FilterContextType {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selectedFilters: SelectedFilters;
  setSelectedFilters: React.Dispatch<React.SetStateAction<SelectedFilters>>;
  filteredJobs: Job[];
  applyFilters: () => void;
  setFilteredJobs: React.Dispatch<React.SetStateAction<Job[]>>;
}

export interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (userData: Partial<User>, accessToken?: string) => void;
  logout: () => void;
}
