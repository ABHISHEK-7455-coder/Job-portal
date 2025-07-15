import React from "react";
import HeroSection from "./HeroSection";
import SearchBar from "./SearchBar";
import StatsSection from "./StatsSection";
import JobTabs from "./JobTabs";
import JobCards from "./JobCards";
import CategorySection from "./CategorySection";
import Header from "./Header";

const App = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <SearchBar />
      <StatsSection />
      <JobTabs />
      <JobCards />
      <CategorySection />
    </div>
  );
};

export default App;
