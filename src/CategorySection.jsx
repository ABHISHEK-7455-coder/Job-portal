import React from "react";
import "./CategorySection.css";

const categories = [
  { name: "Accounting & Finance", jobs: 3 },
  { name: "Automotive Jobs", jobs: 2 },
  { name: "Business", jobs: 3 },
  { name: "Education Training", jobs: 4 },
];

const CategorySection = () => {
  return (
    <div className="category-section">
      <h2>Browse By Category</h2>
      <p>More than 7 million JobHuntr turn to our website each month.</p>
      <div className="categories">
        {categories.map((cat, i) => (
          <div key={i} className="category-card">
            <h4>{cat.name}</h4>
            <p>{cat.jobs} Jobs</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategorySection;
