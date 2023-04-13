import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import JobPostingAPIService from "../../pages/PostAJob/JobPostingAPIService";
import Modal from "react-modal";
import UserDropDownMenu from "../UserDropDownMenu/UserDropDownMenu";
import {UserAvatarWithText} from "../Avatars";
import CommentAPIService from "../../pages/BACKEND_DEBUG/CommentAPIService";
// import UserRESTAPI from "../../restAPI/UserAPI";
// import Cookies from 'js-cookie'
import {useUserContext} from "../../context/UserContext";
import { useNavigate } from 'react-router-dom';

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


const ApplicationCard = ({applicationId, jobPostId,applicantUid, coverLetter, date}) => {

    const {state} = useUserContext();

    const [jobData, setJobData] = useState([{}]);
    const [employerUid, setEmployerUid] = useState('');

    const [employerUser,setEmployerUser] = useState([{}])
    let [er,setEr] = useState(false);
    let [errorString, setErrorString] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        fetch("/getjob/" + jobPostId + "/").then(
            response => response.json()
        ).then(
            data => {
                console.log("APPLICANT")
                console.log(data)
                setJobData(data);
                setEmployerUid(jobData.employerUid);
                return CommentAPIService.GetUserDetails(data.employerUid);
            }
        ).then(data => {
            console.log("EMPLOYER")
            console.log(data)
            setEmployerUser(data);
        })
            .catch(function(error){
            console.log("empty db", error.toString());
            setErrorString(error.toString())
            setEr(true);
        })
    },[])


    return (<>
        <CardArticle>
            {
                <UserDropDownMenu
                    triggerMenuMarkup={UserAvatarWithText(employerUser,0)}
                    triggeredUserUid={employerUid}
                />
            }

            <CardTitle>Job post ID#{jobPostId} </CardTitle>

            <CardGivenTitle >{jobData.title}</CardGivenTitle>

            <CardText>Type: {jobData.jobtype}</CardText>

            <CardText>Location: {jobData.location}</CardText>

            <CardText>Salary: {jobData.salary}</CardText>

            <CardText>Tags: {jobData.tags}</CardText>

            <CardText>Description: {jobData.description}</CardText>
            <CardText></CardText>
            <CardGivenTitle>Your Application Info:</CardGivenTitle>
            <CardDate>Date Applied: {date}
            </CardDate>
            <CardText></CardText>
            <CardText>Your Cover Letter: {coverLetter}</CardText>
            <CardText></CardText>

        </CardArticle>

    </>);};

export default ApplicationCard;
