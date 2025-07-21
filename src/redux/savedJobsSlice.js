// redux/savedJobsSlice.js
import { createSlice } from '@reduxjs/toolkit';

const savedJobsSlice = createSlice({
  name: 'savedJobs',
  initialState: {
    savedJobs: [],
  },
  reducers: {
    saveJob: (state, action) => {
      const job = action.payload;
      const exists = state.savedJobs.find((j) => j.id === job.id);
      if (!exists) {
        state.savedJobs.push(job);
      }
    },
    unsaveJob: (state, action) => {
      state.savedJobs = state.savedJobs.filter((j) => j.id !== action.payload);
    },
  },
});

export const { saveJob, unsaveJob } = savedJobsSlice.actions;
export default savedJobsSlice.reducer;
