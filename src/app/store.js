import { configureStore } from "@reduxjs/toolkit";
import dashboardReducer from "../redux/dashboardSlice";

const store = configureStore({
  reducer: {
    dashboard: dashboardReducer,
  },
});

export default store;
