// components/SavedJobs.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { applyToJob } from 'src/redux/dashboardSlice.js';
import './SavedJobs.css';

const SavedJobs = () => {
  const dispatch = useDispatch();
  const savedJobs = useSelector((state) => state.savedJobs.savedJobs);

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3>Saved Jobs</h3>
      {savedJobs.length === 0 ? (
        <p>No saved jobs available.</p>
      ) : (
        savedJobs.map((job) => (
          <div key={job.id} className="job-card">
            <div>
              <strong>{job.title}</strong>
              <p>{job.company.name} – {job.location}</p>
            </div>
            <button onClick={() => dispatch(applyToJob(job.id))} className="apply-btn">
              Apply
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default SavedJobs;
