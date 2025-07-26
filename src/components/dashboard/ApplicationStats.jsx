import React, { useEffect, useState } from "react";
import "./ApplicationStats.css";

const ApplicationStats = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await fetch("/api/applications");
        const data = await res.json();
        console.log("Fetched applications:", data.applications); // debug line
        setApplications(data.applications);
      } catch (err) {
        console.error("Fetch error:", err); // debug line
        setError("Failed to load application stats.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const sent = applications.filter((a) => a.status === "sent").length;
  const interviews = applications.filter((a) => a.status === "interview").length;
  const offers = applications.filter((a) => a.status === "offer").length;

  if (loading) return <div className="loading">Loading stats...</div>;
  if (error) return <div className="error">{error}</div>;

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
