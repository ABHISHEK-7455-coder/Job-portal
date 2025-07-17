import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// THUNK
export const fetchDashboardData = createAsyncThunk(
    "dashboard/fetchDashboardData",
    async () => {
        const res = await fetch("/api/dashboard");
        const data = await res.json();
        return data;
    }
);

// SLICE
const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        applications: [],
        savedJobs: [],
        messages: [],
        status: "idle",
        error: null,
    },
    reducers: {
        applyToJob: (state, action) => {
            const jobId = action.payload;
            state.savedJobs = state.savedJobs.filter((job) => job.id !== jobId);
            state.applications.push({ id: Date.now(), status: "sent" });
        },
        markMessageRead: (state, action) => {
            const id = action.payload;
            const msg = state.messages.find((m) => m.id === id);
            if (msg) msg.read = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardData.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchDashboardData.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.applications = action.payload.applications;
                state.savedJobs = action.payload.savedJobs;
                state.messages = action.payload.messages;
            })
            .addCase(fetchDashboardData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
    },
});

export const { applyToJob, markMessageRead } = dashboardSlice.actions;
export default dashboardSlice.reducer;
