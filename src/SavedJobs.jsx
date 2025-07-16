import React from "react";
import "./SavedJobs.css";

const savedJobs = [
  { title: "UI/UX Designer", company: "Google", location: "California" },
  { title: "Frontend Developer", company: "Meta", location: "Remote" },
];

const SavedJobs = () => {
  return (
    <div className="saved-jobs">
      <h2>Saved Jobs</h2>
      {savedJobs.map((job, idx) => (
        <div className="job-card" key={idx}>
          <div>
            <h4>{job.title}</h4>
            <p>{job.company} – {job.location}</p>
          </div>
          <button className="apply-btn">Apply</button>
        </div>
      ))}
    </div>
  );
};

export default SavedJobs;
