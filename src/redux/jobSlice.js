// ✅ jobSlice.js (with localStorage for applied jobs)
import { createSlice } from '@reduxjs/toolkit';

const getAppliedFromStorage = () => {
  try {
    const stored = localStorage.getItem('appliedJobIds');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveAppliedToStorage = (appliedJobIds) => {
  try {
    localStorage.setItem('appliedJobIds', JSON.stringify(appliedJobIds));
  } catch {}
};

const initialState = {
  jobs: [],
  categories: [],
  companies: [],
  loading: false,
  error: null,
  appliedJobIds: getAppliedFromStorage(), // ✅ Load from localStorage
  filters: {
    selectedCategory: null,
    selectedCompany: null,
    searchQuery: '',
    selectedExperience: null,
    selectedLocation: null,
    selectedType: null,
    selectedSalary: null,
  },
};

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setJobs(state, action) {
      state.jobs = action.payload;
      state.loading = false;
      state.error = null;
    },
    setCategories(state, action) {
      state.categories = action.payload;
    },
    setCompanies(state, action) {
      state.companies = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.loading = false;
    },
    applyToJob(state, action) {
      const jobId = action.payload;
      if (!state.appliedJobIds.includes(jobId)) {
        state.appliedJobIds.push(jobId);
        saveAppliedToStorage(state.appliedJobIds); // ✅ Save to localStorage
      }
    },
    setSelectedCategory(state, action) {
      state.filters.selectedCategory = action.payload;
    },
    setSelectedCompany(state, action) {
      state.filters.selectedCompany = action.payload;
    },
    setSearchQuery(state, action) {
      state.filters.searchQuery = action.payload;
    },
    setSelectedExperience(state, action) {
      state.filters.selectedExperience = action.payload;
    },
    setSelectedLocation(state, action) {
      state.filters.selectedLocation = action.payload;
    },
    setSelectedType(state, action) {
      state.filters.selectedType = action.payload;
    },
    setSelectedSalary(state, action) {
      state.filters.selectedSalary = action.payload;
    },
    clearFilters(state) {
      state.filters = {
        selectedCategory: null,
        selectedCompany: null,
        searchQuery: '',
        selectedExperience: null,
        selectedLocation: null,
        selectedType: null,
        selectedSalary: null,
      };
    },
  },
});

export const {
  setJobs,
  setCategories,
  setCompanies,
  setLoading,
  setError,
  setSelectedCategory,
  setSelectedCompany,
  setSearchQuery,
  setSelectedExperience,
  setSelectedLocation,
  setSelectedType,
  setSelectedSalary,
  clearFilters,
  applyToJob,
} = jobSlice.actions;

export default jobSlice.reducer;