// components/WelcomeSection.jsx
import React from 'react';

const WelcomeSection = ({ profile }) => {
  const { name, email } = profile || {};

  return (
    <section style={{ marginBottom: '20px' }}>
      <h2>Welcome{ name ? `, ${name}` : '' }!</h2>
      {email && <p style={{backgroundColor: "white", width: "30%", padding:"8px 20px"}}><strong>Email:</strong> {email}</p>}
    </section>
  );
};

export default WelcomeSection;
