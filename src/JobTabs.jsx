import React, { useState } from "react";
import "./JobTabs.css";

const JobTabs = () => {
  const [active, setActive] = useState("recent");

  return (
    <div className="job-tabs">
      <button className={active === "recent" ? "active" : ""} onClick={() => setActive("recent")}>
        Recent Jobs
      </button>
      <button className={active === "featured" ? "active" : ""} onClick={() => setActive("featured")}>
        Featured Jobs
      </button>
    </div>
  );
};

export default JobTabs;
