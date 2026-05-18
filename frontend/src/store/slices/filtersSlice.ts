import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiService } from "../../services/ApiService";
import { API_URL } from "../../consts/general";
import type { Job, SelectedFilters } from "../../types";
import { getApiErrorMessage } from "../../utils/apiError";

type FiltersStatus = "idle" | "loading" | "succeeded" | "failed";
type FilterCategory = keyof SelectedFilters;

interface FiltersState {
  jobs: Job[];
  filteredJobs: Job[];
  searchTerm: string;
  selectedFilters: SelectedFilters;
  status: FiltersStatus;
  error: string | null;
}

const defaultSelectedFilters: SelectedFilters = {
  area: [],
  domain: [],
  profession: [],
  scope: [],
};

const applyJobFilters = (state: FiltersState) => {
  let filtered = state.jobs;

  if (state.searchTerm) {
    filtered = filtered.filter((job) =>
      job.jobTitle.toLowerCase().includes(state.searchTerm.toLowerCase()),
    );
  }

  if (state.selectedFilters.domain.length > 0) {
    filtered = filtered.filter((job) =>
      state.selectedFilters.domain.includes(job.domain ?? ""),
    );
  }

  if (state.selectedFilters.profession.length > 0) {
    filtered = filtered.filter((job) =>
      state.selectedFilters.profession.includes(job.profession ?? ""),
    );
  }

  if (state.selectedFilters.area.length > 0) {
    filtered = filtered.filter((job) =>
      state.selectedFilters.area.includes(job.area ?? ""),
    );
  }

  if (state.selectedFilters.scope.length > 0) {
    filtered = filtered.filter((job) =>
      state.selectedFilters.scope.includes(job.scope ?? ""),
    );
  }

  state.filteredJobs = filtered;
};

export const fetchJobs = createAsyncThunk<Job[], void, { rejectValue: string }>(
  "filters/fetchJobs",
  async (_, { rejectWithValue }) => {
    try {
      const apiService = new ApiService(API_URL);
      const response = await apiService.getAllJobs();
      return response.data.slice();
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return rejectWithValue(getApiErrorMessage(error));
    }
  },
);

const initialState: FiltersState = {
  jobs: [],
  filteredJobs: [],
  searchTerm: "",
  selectedFilters: defaultSelectedFilters,
  status: "idle",
  error: null,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSearchTerm(state, action: { payload: string }) {
      state.searchTerm = action.payload;
      applyJobFilters(state);
    },
    clearSearchTerm(state) {
      state.searchTerm = "";
      applyJobFilters(state);
    },
    setSelectedFilters(state, action: { payload: SelectedFilters }) {
      state.selectedFilters = action.payload;
      applyJobFilters(state);
    },
    toggleFilter(
      state,
      action: { payload: { category: FilterCategory; value: string } },
    ) {
      const { category, value } = action.payload;
      const hasFilter = state.selectedFilters[category].includes(value);

      state.selectedFilters[category] = hasFilter
        ? state.selectedFilters[category].filter((filter) => filter !== value)
        : [...state.selectedFilters[category], value];

      applyJobFilters(state);
    },
    clearAllFilters(state) {
      state.selectedFilters = { ...defaultSelectedFilters };
      applyJobFilters(state);
    },
    setAreaFilters(state, action: { payload: string[] }) {
      state.selectedFilters.area = action.payload;
      applyJobFilters(state);
    },
    applyFilters(state) {
      applyJobFilters(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.jobs = action.payload;
        state.error = null;
        applyJobFilters(state);
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? getApiErrorMessage(null);
      });
  },
});

export const {
  setSearchTerm,
  clearSearchTerm,
  setSelectedFilters,
  toggleFilter,
  clearAllFilters,
  setAreaFilters,
  applyFilters,
} = filtersSlice.actions;

export default filtersSlice.reducer;
