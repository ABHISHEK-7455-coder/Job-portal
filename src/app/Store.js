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
} from '../redux/jobSlice'; // ✅ Adjust path if needed

import savedJobsReducer, {
  saveJob,
  unsaveJob,
} from '../redux/savedJobsSlice'; // ✅ Make sure this path is correct

const store = configureStore({
  reducer: {
    jobs: jobReducer,
    savedJobs: savedJobsReducer,
  },
});

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
