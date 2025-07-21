// redux/store.js
import { configureStore } from '@reduxjs/toolkit';
import jobReducer, {
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
} from '../redux/jobSlice'; // ✅ Assuming jobSlice is in same directory

import savedJobsReducer, {
  saveJob,
  unsaveJob,
} from '../redux/savedJobsSlice'; // ✅ Assuming savedJobsSlice is in same directory

import profileReducer from '../redux/profileSlice'; // ✅ Assuming profileSlice is in same directory

const store = configureStore({
  reducer: {
    profile: profileReducer,
    jobs: jobReducer,
    savedJobs: savedJobsReducer,
  },
});

// Exporting store and actions
export {
  store,
  // jobSlice actions
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
  // savedJobsSlice actions
  saveJob,
  unsaveJob,
};

export default store;
