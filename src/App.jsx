import React from "react";
import HeroSection from "./HeroSection";
import SearchBar from "./SearchBar";
import StatsSection from "./StatsSection";
import JobTabs from "./JobTabs";
import JobCards from "./JobCards";
import CategorySection from "./CategorySection";
import Header from "./Header";
import Footer from "./Footer";
import Dashboard from "./Dashboard";

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
      <Dashboard />
      <Footer />
      
    </div>
  );
};

export default App;
