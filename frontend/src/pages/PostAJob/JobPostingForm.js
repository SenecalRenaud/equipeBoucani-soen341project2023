import React, { useEffect, useState } from "react";
import "./JobPostingForm.css";
import JobPostingAPIService from "./JobPostingAPIService";
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
const JobPostingForm = (props) => {
  const decoded_token_claims = jwtDecode(Cookies.get("access_token"));

  const [jobType, setJobType] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [location, setLocation] = useState("");
  const [salary, setSalary] = useState(1000);
  const [industryTags, setIndustryTags] = useState([]);
  const [jobDescription, setJobDescription] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [jobTypeError, setJobTypeError] = useState("");

  const handleJobTypeChange = (type) => {
    setJobType(type);
  };

  const handleJobTitleChange = (event) => {
    setJobTitle(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleSalaryChange = (event) => {
    setSalary(event.target.value);
  };

  const addIndustryTag = (tag) => {
    if (industryTags.length < 3 && tag) {
      setIndustryTags([...industryTags, tag]);
    }
  };

  const handleIndustryTagClick = (event) => {
    if (event.key === "Enter") {
      const tag = event.target.value.trim();
      addIndustryTag(tag);
      event.target.value = "";
      event.preventDefault();
    }
  };

  const handleExampleTagClick = (tag) => {
    addIndustryTag(tag);
  };

  const handleRemoveIndustryTag = (index) => {
    setIndustryTags(industryTags.filter((_, i) => i !== index));
  };

  const handleJobDescriptionChange = (event) => {
    const description = event.target.value;
    const maxWords = 350;
    const wordCount = description.split(/\s+/).length;
    if (wordCount > maxWords) {
      description.preventDefault();
    } else {
      setJobDescription(description);
      setWordCount(description.split(/\s+/).length);
    }
  };

  const handleStartDateChange = (event) => {
    const date = new Date(event.target.value);
    setStartDate(date.toISOString());
  };

  const handleEndDateChange = (event) => {
    const date = new Date(event.target.value);
    setEndDate(date.toISOString());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!jobType) {
      setJobTypeError("Please select a job type.");
      return;
    } else {
      setJobTypeError("");
    }
    console.log("DECODED TOKEN CLAIMS: ", decoded_token_claims.user_id);
    await JobPostingAPIService.AddJobPosting({
      jobtype: jobType,
      title: jobTitle,
      location,
      salary,
      tags: industryTags.toString(),
      description: jobDescription,
      employerUid: decoded_token_claims.user_id,
      ...(jobType === "Time-Period" && { startDate, endDate }),
    })
      .then((response) => props.postedJob(response))
      .then((any) => window.location.reload())
      .catch((error) =>
        console.log("Following error occurred after fetching from API: ", error)
      );

    setJobType("");
    setJobTitle("");
    setLocation("");
    setSalary(0);
    setIndustryTags([]);
    setJobDescription("");

    window.location.replace("http://localhost:3000/viewjobposts");
  };

  if (!decoded_token_claims.employer) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      alert("Only employers are allowed to post jobs ! Redirecting ... ");
      window.location.replace("http://localhost:3000");
    }, []);
  }

  return (
    <div className="job-position-container">
      <div className="job-posting-card">
        <h1>Job Posting</h1>
        <div className="job-type-section">
          <h3>Job Type</h3>
          <button
            id="Full-Time"
            className={jobType === "Full-Time" ? "active" : ""}
            onClick={() => handleJobTypeChange("Full-Time")}
          >
            Full-Time
          </button>
          <button
            id="Part-Time"
            className={jobType === "Part-Time" ? "active" : ""}
            onClick={() => handleJobTypeChange("Part-Time")}
          >
            Part-Time
          </button>
          <button
            id="Time-Period"
            className={jobType === "Time-Period" ? "active" : ""}
            onClick={() => handleJobTypeChange("Time-Period")}
          >
            Time-Period
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="job-title-input">Job Title</label>
          <input
            id="job-title-input"
            type="text"
            value={jobTitle}
            onChange={handleJobTitleChange}
            required
          />
          {jobType === "Time-Period" && (
            <>
              <label htmlFor="start-date-input">Start Date</label>
              <input
                id="start-date-input"
                type="date"
                value={startDate}
                onChange={handleStartDateChange}
                required
              />
              <label htmlFor="end-date-input">End Date</label>
              <input
                id="end-date-input"
                type="date"
                value={endDate}
                onChange={handleEndDateChange}
                required
              />
            </>
          )}
          <label htmlFor="location-input">Location</label>
          <input
            id="location-input"
            type="text"
            value={location}
            onChange={handleLocationChange}
            required
          />
          <label htmlFor="salary-input">Salary</label>
          <div className="salary-section">
            <input
              id="salary-input"
              type="range"
              min="100"
              max="10000"
              step="100"
              value={salary}
              onChange={handleSalaryChange}
            />
            <span className="salary-display">${salary}</span>
          </div>
          <label htmlFor="industry-tags-input">Industry Tags</label>
          <div className="industry-tags-section">
            <div className="industry-tags-example">
              <span id="IT" onClick={() => handleExampleTagClick("IT")}>
                IT
              </span>
              <span
                id="Tutoring"
                onClick={() => handleExampleTagClick("Tutoring")}
              >
                Tutoring
              </span>
              <span
                id="Engineering"
                onClick={() => handleExampleTagClick("Engineering")}
              >
                Engineering
              </span>
              <span
                id="Finance"
                onClick={() => handleExampleTagClick("Finance")}
              >
                Finance
              </span>
              <span
                id="Marketing"
                onClick={() => handleExampleTagClick("Marketing")}
              >
                Marketing
              </span>
              <span id="Design" onClick={() => handleExampleTagClick("Design")}>
                Design
              </span>
              <span
                id="Healthcare"
                onClick={() => handleExampleTagClick("Healthcare")}
              >
                Healthcare
              </span>
              <span
                id="Education"
                onClick={() => handleExampleTagClick("Education")}
              >
                Education
              </span>
              <span id="Food" onClick={() => handleExampleTagClick("Food")}>
                Food
              </span>
              <span id="Travel" onClick={() => handleExampleTagClick("Travel")}>
                Travel
              </span>
            </div>
            <div className="industry-tags-input-wrapper">
              {industryTags.map((tag, index) => (
                <div key={index} className="industry-tag">
                  {tag}
                  <button onClick={() => handleRemoveIndustryTag(index)}>
                    x
                  </button>
                </div>
              ))}
              <input
                id="industry-tags-input"
                type="text"
                placeholder="Add an industry tag"
                onKeyPress={handleIndustryTagClick}
                disabled={industryTags.length >= 3} // Add the disabled attribute here
              />
            </div>
          </div>
          <label htmlFor="job-description-input">Job Description</label>
          <textarea
            id="job-description-input"
            value={jobDescription}
            onChange={handleJobDescriptionChange}
            required
          />
          <p className="word-count">{wordCount}/350 words</p>
          {jobTypeError && <p className="job-type-error">{jobTypeError}</p>}
          <div className="apply-button-container">
            <button className="apply-button">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPostingForm;
