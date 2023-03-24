import React, { useState } from "react";
import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faTrashCan,faPen } from '@fortawesome/free-solid-svg-icons';
import JobPostingAPIService from "../../pages/PostAJob/JobPostingAPIService";
//import React, { useState } from "react";
import Modal from "react-modal";
export const CardTitle = styled.h1`
    font-size: 2em;
`;
export const CardGivenTitle = styled.h4`
    font-size: 1.25em;
`;
export const CardArticle = styled.div`
    border: 1px solid darkblue;
    margin: 10px;
    width: 100%;
    align-self: stretch;
`;
export const CardText = styled.p`
`;
export const CardDate = styled.b`
`;
export const CardDeleteButton = styled.button`
    float: right;
    margin-right: 3.5em;
    font-size: 2ch;
    background: none;
    
    
`;
export const CardEditButton = styled.button`
    float: right;
    margin-right: 3.5em;
    font-size: 2ch;
    background: none;
    color: green;
    
`;

export const SubmitCancelButton = styled.button`
    margin: 1.5em;
    font-size: 2ch;
    text-align: center;
    width: 5em;
    color: black;
`;
const JobPostCard = ({id, jobtype, title, description, location, salary, tags, date, editDate}) => {
    const [editjobType, setJobType] = useState(jobtype);
    const [editjobTitle, setJobTitle] = useState(title);
    const [editlocation, setLocation] = useState(location);
    const [editsalary, setSalary] = useState(salary);
    const [editindustryTags, setIndustryTags] = useState(tags.split(","));
    const [editjobDescription, setJobDescription] = useState(description);
    const [wordCount, setWordCount] = useState(0);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [toBeEditedID, setToBeEditedID] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const handleJobTypeChange = (type) => {
        setJobType(type);
    };

    const handleSalaryChange = (event) => {
        setSalary(event.target.value);
    };

    const addIndustryTag = (tag) => {
        if (editindustryTags.length < 3 && tag) {
            setIndustryTags([...editindustryTags, tag]);
        }
    };

    const handleIndustryTagClick = (event) => {
        if (event.key === 'Enter') {
            const tag = event.target.value.trim();
            addIndustryTag(tag);
            event.target.value = '';
            event.preventDefault();
        }
    };

    const handleExampleTagClick = (tag) => {
        addIndustryTag(tag);
    };

    const handleRemoveIndustryTag = (index) => {
        setIndustryTags(editindustryTags.filter((_, i) => i !== index));
    };

    const handleJobDescriptionChange = (event) => {
        const description = event.target.value;
        if (description.length <= 200) {
            setJobDescription(description);
            setWordCount(description.split(/\s+/).length);
        }
    };

    const toggleModal = () => {
        setIsOpen(!isOpen);
    };

    const handleEdit = (event) => {

        JobPostingAPIService.EditJobPosting(toBeEditedID, {"title" : editjobTitle, "jobtype": editjobType, "location": editlocation, "salary": editsalary, "description": editjobDescription, "tags": editindustryTags.toString()})
            //.then((response) => props.postedComment(response))
            .then((any)=> window.location.reload())
            .catch(error => console.log('Following error occured after fetching from API: ',error))
        setJobType('')
        setJobTitle('')
        setLocation('')
        setSalary(0)
        setIndustryTags([])
        setJobDescription('')
    };
    return (<>
        <CardArticle>



            <CardTitle>Job post ID#{id} </CardTitle>
            <CardDeleteButton onClick={() => handleDelete(id)}><FontAwesomeIcon icon={faTrashCan}/></CardDeleteButton>
            <CardEditButton onClick={() => {setToBeEditedID(id); toggleModal(); setJobTitle(editjobTitle); setJobDescription(editjobDescription)}}><FontAwesomeIcon icon={faPen}/></CardEditButton>

            <CardGivenTitle >{title}</CardGivenTitle>

            <CardText>Type: {jobtype}</CardText>

            <CardText>Location: {location}</CardText>

            <CardText>Salary: {salary}</CardText>

            <CardText>Tags: {tags}</CardText>

            <CardText>Description: {description}</CardText>

            <CardDate>Date Posted: {date}
            </CardDate>
            <CardText></CardText>
            <CardDate>{editDate !== "Invalid Date" ? "Date Edited: " + editDate : ""}
            </CardDate>


        </CardArticle>
        <Modal isOpen={isOpen} onRequestClose={toggleModal} ariaHideApp={false}>
            <form onSubmit={() => {handleEdit(); toggleModal()}}>
                <br/><br/>
                <label>
                    Job Type:
                    <div className="job-type-section">
                        <h3>Job Type</h3>
                        <button type="button"
                            className={editjobType === 'Full-Time' ? 'active' : ''}
                            onClick={() => handleJobTypeChange('Full-Time')}
                        >
                            Full-Time
                        </button>
                        <button type="button"
                            className={editjobType === 'Part-Time' ? 'active' : ''}
                            onClick={() => handleJobTypeChange('Part-Time')}
                        >
                            Part-Time
                        </button>
                        <button type="button"
                            className={editjobType === 'Time-Period' ? 'active' : ''}
                            onClick={() => handleJobTypeChange('Time-Period')}
                        >
                            Time-Period
                        </button>
                    </div>
                </label>
                Job Title:
                <input
                    type="text"
                    name="jobTitle"
                    id="jobTitle"
                    onChange={(e) => setJobTitle(e.target.value)}
                    value={editjobTitle}
                />
                Job Location:
                <input
                    type="text"
                    name="location"
                    id="location"
                    onChange={(e) => setLocation(e.target.value)}
                    value={editlocation}
                />
                <label htmlFor="salary-input">Salary</label>
                <div className="salary-section">
                    <input
                        id="salary-input"
                        type="range"
                        min="100"
                        max="10000"
                        step="100"
                        value={editsalary}
                        onChange={handleSalaryChange}
                    />
                    <span className="salary-display">${editsalary}</span>
                </div>
                <label htmlFor="industry-tags-input">Industry Tags</label>
                <div className="industry-tags-section">
                    <div className="industry-tags-example">
                        <span onClick={() => handleExampleTagClick('IT')}>IT</span>
                        <span onClick={() => handleExampleTagClick('Tutoring')}>Tutoring</span>
                        <span onClick={() => handleExampleTagClick('Engineering')}>Engineering</span>
                        <span onClick={() => handleExampleTagClick('Finance')}>Finance</span>
                        <span onClick={() => handleExampleTagClick('Marketing')}>Marketing</span>
                        <span onClick={() => handleExampleTagClick('Design')}>Design</span>
                        <span onClick={() => handleExampleTagClick('Healthcare')}>Healthcare</span>
                        <span onClick={() => handleExampleTagClick('Education')}>Education</span>
                        <span onClick={() => handleExampleTagClick('Food')}>Food</span>
                        <span onClick={() => handleExampleTagClick('Travel')}>Travel</span>
                    </div>
                    <div className="industry-tags-input-wrapper">
                        {editindustryTags.map((tag, index) => (
                            <div key={index} className="industry-tag">
                                {tag}
                                <button onClick={() => handleRemoveIndustryTag(index)}>x</button>
                            </div>
                        ))}
                        <input
                            id="industry-tags-input"
                            type="text"
                            placeholder="Add an industry tag"
                            onKeyPress={handleIndustryTagClick}
                            disabled={editindustryTags.length >= 3} // Add the disabled attribute here
                        />
                    </div>
                </div>
                <label>
                    Job Description:
                    <textarea
                        id="job-description-input"
                        value={editjobDescription}
                        onChange={handleJobDescriptionChange}
                        maxLength="200"
                        required
                    />
                    <p className="word-count">{wordCount}/200 words</p>
                </label>
                <SubmitCancelButton type="submit">Submit</SubmitCancelButton>
                <SubmitCancelButton onClick={() => toggleModal()}>Cancel</SubmitCancelButton>
            </form>
            <form onClose={toggleModal} />
        </Modal>
    </>);};

const handleDelete = (job_id) => {
    //event.preventDefault();

    JobPostingAPIService.DeleteJobPosting(job_id)
        .then((any)=> window.location.reload())
        .catch(error => console.log('Following error occured after fetching from API: ',error))

    //console.log(window.location.href);

};




export default JobPostCard;
