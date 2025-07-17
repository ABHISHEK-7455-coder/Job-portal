import React from "react";

const ApplicationOverview = ({ applications }) => {
  const sent = applications.filter(a => a.status === "sent").length;
  const interview = applications.filter(a => a.status === "interview").length;
  const offer = applications.filter(a => a.status === "offer").length;

  return (
    <div style={{ display: "flex", gap: "20px", marginBottom: "30px" }}>
      <StatBox label="Applications Sent" count={sent} />
      <StatBox label="Interviews Scheduled" count={interview} />
      <StatBox label="Offers Received" count={offer} />
    </div>
  );
};

const StatBox = ({ label, count }) => (
  <div style={{ flex: 1, background: "#f8f9fa", padding: "20px", borderRadius: "8px", textAlign: "center" }}>
    <h3 style={{ fontSize: "26px", color: "#007bff", marginBottom: "5px" }}>{count}</h3>
    <p style={{ margin: 0 }}>{label}</p>
  </div>
);

export default ApplicationOverview;
