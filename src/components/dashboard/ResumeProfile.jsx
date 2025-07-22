import React, { useState } from "react";

const ResumeProfile = ({ profile }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState("");
  const [uploadedUrl, setUploadedUrl] = useState(profile.resume || "");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    setUploadMessage("");
  };

  const handleMockUpload = async () => {
    if (!resumeFile) {
      setUploadMessage("Please select a resume file first.");
      return;
    }

    const fakeResume = {
      filename: resumeFile.name,
      size: resumeFile.size,
    };

    try {
      const res = await fetch("/api/upload-resume", {
        method: "POST",
        body: JSON.stringify(fakeResume),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      setUploadMessage(data.message);
      setUploadedUrl(data.filePath);
    } catch (err) {
      setUploadMessage("Failed to upload resume.");
      console.error(err);
    }
  };

  return (
    <div style={{ marginBottom: "30px" }}>
      <h3>Resume & Profile</h3>

      {uploadedUrl && (
        <p>
          <strong>Resume:</strong>{" "}
          <a href={uploadedUrl} target="_blank" rel="noopener noreferrer">
            {uploadedUrl}
          </a>
        </p>
      )}

      <div style={{ marginTop: "10px" }}>
        <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
        <button onClick={handleMockUpload} style={{ marginLeft: "10px" }}>
          Upload Resume
        </button>
        {uploadMessage && <p style={{ color: "green" }}>{uploadMessage}</p>}
      </div>

      <p>
        <strong>Skills:</strong> {profile.skills?.join(", ") || "N/A"}
      </p>
    </div>
  );
};

export default ResumeProfile;
