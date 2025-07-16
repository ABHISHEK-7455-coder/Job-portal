import React from "react";
import "./ApplicationStats.css";

const ApplicationStats = () => {
  return (
    <div className="application-stats">
      <div className="stat-card">
        <h3>12</h3>
        <p>Applications Sent</p>
      </div>
      <div className="stat-card">
        <h3>4</h3>
        <p>Interviews Scheduled</p>
      </div>
      <div className="stat-card">
        <h3>2</h3>
        <p>Offers Received</p>
      </div>
    </div>
  );
};

export default ApplicationStats;
