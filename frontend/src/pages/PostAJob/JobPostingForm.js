import React, { useState } from 'react';
import './JobPostingForm.css';

const JobPostingForm = (props) => {
    const [jobType, setJobType] = useState('');
    const [jobTitle, setJobTitle] = useState('');
    const [location, setLocation] = useState('');
    const [salary, setSalary] = useState(1000);
    const [industryTags, setIndustryTags] = useState([]);
    const [jobDescription, setJobDescription] = useState('');
    const [wordCount, setWordCount] = useState(0);

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

    const handleIndustryTagClick = (tag) => {
        if (industryTags.length < 3) {
            setIndustryTags([...industryTags, tag]);
        }
    };

    const handleRemoveIndustryTag = (index) => {
        setIndustryTags(industryTags.filter((_, i) => i !== index));
    };

    const handleJobDescriptionChange = (event) => {
        const description = event.target.value;
        if (description.length <= 200) {
            setJobDescription(description);
            setWordCount(description.split(/\s+/).length);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const jobPositionData = {
            jobType,
            jobTitle,
            location,
            salary,
            industryTags,
            jobDescription,
        };

        console.log(jobPositionData);
        // TODO: send jobPositionData to backend using a post request method
    };

    return (
        <div className="job-position-container">
            <div className="blur-card">
                <h1>Job Posting</h1>
                <div className="job-type-section">
                    <h3>Job Type</h3>
                    <button
                        className={jobType === 'Full-Time' ? 'active' : ''}
                        onClick={() => handleJobTypeChange('Full-Time')}
                    >
                        Full-Time
                    </button>
                    <button
                        className={jobType === 'Part-Time' ? 'active' : ''}
                        onClick={() => handleJobTypeChange('Part-Time')}
                    >
                        Part-Time
                    </button>
                    <button
                        className={jobType === 'Time-Period' ? 'active' : ''}
                        onClick={() => handleJobTypeChange('Time-Period')}
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
                        <div className="salary-scroll-bar" style={{ width: `${salary / 100}%` }}>
                            <div className="salary-scroll-thumb"></div>
                        </div>
                        <div className="salary-display">$              {salary} CAD
                        </div>
                        <input
                            id="salary-input"
                            type="range"
                            min="10"
                            max="10000"
                            step="10"
                            value={salary}
                            onChange={handleSalaryChange}
                            required
                        />
                    </div>
                    <label htmlFor="industry-tags-input">Industry</label>
                    <div className="industry-tags-section">
                        <div className="industry-tags-example">
                            <span onClick={() => handleIndustryTagClick('IT')}>IT</span>
                            <span onClick={() => handleIndustryTagClick('Tutoring')}>Tutoring</span>
                            <span onClick={() => handleIndustryTagClick('Engineering')}>Engineering</span>
                            <span onClick={() => handleIndustryTagClick('Finance')}>Finance</span>
                            <span onClick={() => handleIndustryTagClick('Marketing')}>Marketing</span>
                            <span onClick={() => handleIndustryTagClick('Design')}>Design</span>
                            <span onClick={() => handleIndustryTagClick('Healthcare')}>Healthcare</span>
                            <span onClick={() => handleIndustryTagClick('Education')}>Education</span>
                            <span onClick={() => handleIndustryTagClick('Food')}>Food</span>
                            <span onClick={() => handleIndustryTagClick('Travel')}>Travel</span>
                        </div>
                        <div className="industry-tags-input-wrapper">
                            {industryTags.map((tag, index) => (
                                <div key={index} className="industry-tag">
                                    {tag}
                                    <button type="button" onClick={() => handleRemoveIndustryTag(index)}> X
                                    </button>
                                </div>
                            ))}
                            <input
                                id="industry-tags-input"
                                type="text"
                                placeholder="Add an industry tag"
                                onKeyPress={(event) => event.key === 'Enter' && handleIndustryTagClick(event)}
                            />
                        </div>
                    </div>
                    <label htmlFor="job-description-input">Job Description</label>
                    <div className="job-description-section">
                        <div className="word-count">{wordCount}/200 words</div>
                        <textarea
                            id="job-description-input"
                            value={jobDescription}
                            onChange={handleJobDescriptionChange}
                            maxLength={200}
                            required
                        />
                    </div>
                    <button type="submit" className={`apply-button ${jobType}`}>
                        Apply
                    </button>
                </form>
            </div>
        </div>
    );
};

export default JobPostingForm;
