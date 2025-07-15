import React from "react";
import "./SearchBar.css";

const SearchBar = () => {
  return (
    <div className="search-bar">
      <input type="text" placeholder="Job Title or Keywords" />
      <input type="text" placeholder="Location" />
      <select>
        <option>All Categories</option>
      </select>
      <button>Find Jobs</button>
    </div>
  );
};

export default SearchBar;
