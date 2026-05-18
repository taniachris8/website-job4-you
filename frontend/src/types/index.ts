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
  role?: "admin" | "user";
  savedJobs?: string[];
  [key: string]: unknown;
}

export interface SelectedFilters {
  area: string[];
  domain: string[];
  profession: string[];
  scope: string[];
}
