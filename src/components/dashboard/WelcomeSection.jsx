import React from "react";

const WelcomeSection = ({ profile }) => {
  return (
    <div style={{ marginBottom: "30px" }}>
      <h2>Welcome back, {profile.name} 👋</h2>
      <p>Email: {profile.email}</p>
    </div>
  );
};

export default WelcomeSection;














