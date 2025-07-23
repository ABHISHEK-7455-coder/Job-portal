import React, { useEffect, useState } from "react";
import "./ApplicationStats.css";

const ApplicationStats = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch("/api/applications")
      .then((res) => res.json())
      .then((data) => setApplications(data.applications));
  }, []);

  const sent = applications.filter((a) => a.status === "sent").length;
  const interviews = applications.filter((a) => a.status === "interview").length;
  const offers = applications.filter((a) => a.status === "offer").length;

  return (
    <div className="stats-container">
      <StatBox label="Applications Sent" count={sent} />
      <StatBox label="Interviews Scheduled" count={interviews} />
      <StatBox label="Offers Received" count={offers} />
    </div>
  );
};

const StatBox = ({ label, count }) => (
  <div className="stat-card">
    <h3>{count}</h3>
    <p>{label}</p>
  </div>
);

export default ApplicationStats;
