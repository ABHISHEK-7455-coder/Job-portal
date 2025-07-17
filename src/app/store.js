import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from '../redux/dashboardSlice';
import profileReducer from '../redux/profileSlice';

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
    profile: profileReducer
  }
});

export default store;
