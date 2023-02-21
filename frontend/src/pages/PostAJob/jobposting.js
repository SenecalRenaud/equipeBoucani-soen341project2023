import React, { useState } from 'react';
import './jobposting.css';

function JobPosting() {
  const [salary, setSalary] = useState("");

  const handleSalaryChange = (event) => {
    setSalary(event.target.value);
  };

  return (
    <div className="job-posting-container">
      <h1 className="job-posting-heading">Post a Job</h1>
      <div className="job-posting-card">
        <h2 className="job-posting-card-heading">Job Details</h2>
        <form className="job-posting-form" method='post'>
          <div className="job-posting-form-group">
            <label htmlFor="jobTitle">Job Title:</label>
            <input type="text" id="jobTitle" name="jobTitle" />
          </div>
          <div className="job-posting-form-group">
            <label htmlFor="jobDescription">Job Description:</label>
            <textarea id="jobDescription" name="jobDescription"></textarea>
          </div>
          <div className="job-posting-form-group">
            <label htmlFor="jobLocation">Job Location:</label>
            <input type="text" id="jobLocation" name="jobLocation" />
          </div>
          <div className="job-posting-form-group">
            <label htmlFor="jobSalary">Job Salary:</label>
            <div className="salary-container">
              <input type="number" id="jobSalary" name="jobSalary" value={salary} onChange={handleSalaryChange} />
              <label className="salary-currency"> CAD</label>
            </div>
          </div>
        </form>
      </div>
      <button className="job-posting-button">Post Job</button>
    </div>
  );
}

export default JobPosting;