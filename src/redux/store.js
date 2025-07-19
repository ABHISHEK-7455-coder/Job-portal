import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './dashboardSlice';
import profileReducer from './profileSlice';

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    profile: profileReducer
  }
});

export default store;
