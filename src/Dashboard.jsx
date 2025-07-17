import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    fetchDashboardData,
    applyToJob,
    markMessageRead
} from "./redux/dashboardSlice";

import ApplicationStats from "./ApplicationStats";
import SavedJobs from "./SavedJobs";
import Messages from "./Messages";

const Dashboard = () => {
    const dispatch = useDispatch();
    const { applications, savedJobs, messages, status } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboardData());
    }, [dispatch]);

    if (status === "loading") return <p>Loading...</p>;
    if (status === "failed") return <p>Failed to load dashboard.</p>;

    return (
        <div style={{ padding: "30px", maxWidth: "1200px", margin: "auto" }}>
            <h2>Dashboard</h2>
            <ApplicationStats applications={applications} />
            <SavedJobs savedJobs={savedJobs} onApply={(id) => dispatch(applyToJob(id))} />
            <Messages messages={messages} onRead={(id) => dispatch(markMessageRead(id))} />
        </div>
    );
};

export default Dashboard;
