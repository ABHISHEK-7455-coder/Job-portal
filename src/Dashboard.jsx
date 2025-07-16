import React from "react";
import ApplicationStats from "./ApplicationStats";
import SavedJobs from "./SavedJobs";
import Messages from "./Messages";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      <ApplicationStats />
      <SavedJobs />
      <Messages />
    </div>
  );
};

export default Dashboard;
