import React, { useState } from "react";
import "./applyJob.css";

const ApplyJob = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [resume, setResume] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [additionalInformation, setAdditionalInformation] = useState("");

  const handleFullNameChange = (event) => {
    setFullName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  const handleResumeChange = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.filter(
      (file) => !resumes.some((resume) => resume.name === file.name)
    );
    setResumes((prevResumes) => [...prevResumes, ...newFiles]);
  };

  const removeFile = (indexToRemove) => {
    setResumes((prevResumes) =>
      prevResumes.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleResumeOverlayClick = (event) => {
    event.stopPropagation();
    document.getElementById("resume-input").click();
  };

  const handleAdditionalInformationChange = (event) => {
    setAdditionalInformation(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(resume);
    console.log(additionalInformation);
  };

  const countWords = (text) => {
    if (text.trim() === "") {
      return 0;
    }
    const wordCount = text.trim().split(/\s+/).length;
    return wordCount;
  };

  const wordCount = countWords(additionalInformation);

  return (
    <div className="apply-job-container">
      <div className="apply-job-card">
        <h1>Apply for Job</h1>
        <form onSubmit={handleSubmit}>
          <div className="apply-job-field">
            <label htmlFor="full-name-input">Full Name</label>
            <input
              id="full-name-input"
              className="apply-job-card-input"
              type="text"
              value={fullName}
              onChange={handleFullNameChange}
              required
            />
          </div>
          <div className="apply-job-field">
            <label htmlFor="email-input">Email</label>
            <input
              id="email-input"
              className="apply-job-card-input"
              type="email"
              value={email}
              onChange={handleEmailChange}
              required
            />
          </div>
          <div className="apply-job-field">
            <label htmlFor="phone-number-input">Phone Number</label>
            <input
              id="phone-number-input"
              className="apply-job-card-input"
              type="tel"
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              required
            />
          </div>
          <div className="apply-job-field">
            <label htmlFor="resume-input">Resume</label>
            <div className="resume-input-wrapper">
              <input
                id="resume-input"
                className="resume-input"
                type="file"
                onChange={handleResumeChange}
                accept=".pdf,.doc,.docx"
                multiple
                required
              />
              <div
                className="resume-overlay"
                onClick={handleResumeOverlayClick}
              >
                <div className="resume-overlay-text">
                  {resumes.length === 0 ? (
                    <>
                      No Resume Uploaded
                      <br />
                      Tap Here to Upload
                    </>
                  ) : null}
                </div>
                <div className="resume-files-list">
                  {resumes.map((file, index) => (
                    <div className="resume-file" key={index}>
                      <i className="resume-file-icon"></i>
                      {file.name}
                      <button
                        className="resume-file-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(index);
                        }}
                      >
                        x
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="additional-info-container">
            <div className="apply-job-field">
              <label htmlFor="additional-information-input">
                Additional Information
              </label>
              <div className="additional-information-wrapper">
                <textarea
                  id="additional-information-input"
                  className="apply-job-card-input"
                  rows="5"
                  value={additionalInformation}
                  onChange={handleAdditionalInformationChange}
                  maxLength="200"
                />
                <div className="additional-information-word-count">
                  {wordCount}/200 words
                </div>
              </div>
            </div>
            <div className="apply-button-container">
              <button className="apply-button" type="submit">
                Apply
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyJob;
