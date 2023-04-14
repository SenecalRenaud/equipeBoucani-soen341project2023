import React, {useEffect, useState} from "react";
import styled from "styled-components";
import './applicationCardStyle.css'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import JobPostingAPIService from "../../pages/PostAJob/JobPostingAPIService";
import Modal from "react-modal";
import UserDropDownMenu from "../UserDropDownMenu/UserDropDownMenu";
import {UserAvatarWithText, UserAvatarWithText2} from "../Avatars";
import CommentAPIService from "../../pages/BACKEND_DEBUG/CommentAPIService";

import {useUserContext} from "../../context/UserContext";
import { useNavigate } from 'react-router-dom';
import {CardArticle, CardDate, CardGivenTitle, CardText, CardTitle} from "./indexCopy";

import {Dialog, DialogTitle, DialogContent, Button, DialogActions, Paper} from '@material-ui/core';
// import { Document, Page, pdfjs } from 'react-pdf';
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import pdf_img from "../../assets/pdf.png";
import cl_img from "../../assets/cover.png";
import {DATETIME_OPTIONS} from "../../pages/ProfilePage/ProfilePage";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import PdfDialog from "../JobPostCard/PdfDialog";
import ParagraphDialog from "../JobPostCard/ParagraphDialog";
import ComponentDialog from "../JobPostCard/ComponentDialog";
import JobPostCard from "../JobPostCard";





const ApplicationCard = ({applicationId, jobPostId,applicantUid, coverLetter, date}) => {

    const [jobData, setJobData] = useState({});

    const [employerUser,setEmployerUser] = useState({})
    const [applicantUser,setApplicantUser] = useState({})
    let [er,setEr] = useState(false);
    let [errorString, setErrorString] = useState("");

    const navigate = useNavigate();

    useEffect(() => {

        fetch("/getjob/" + jobPostId + "/").then(
            response => response.json()
        ).then(
            data => {
                // console.log("APPLICANT")
                // console.log(data)
                setJobData(data);

                return Promise.all([CommentAPIService.GetUserDetails(data.employerUid),
                        CommentAPIService.GetUserDetails(applicantUid)
                    ])
            }
        ).then(([employer,applicant]) => {
            // console.log("EMPLOYER")
            // console.log(employer)
            // console.log(applicant)
            setEmployerUser(employer);
            setApplicantUser(applicant)
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
                // <UserDropDownMenu
                //     triggerMenuMarkup={UserAvatarWithText(employerUser,0)}
                //     triggeredUserUid={employerUid}
                // />


            }



            <CardGivenTitle >{jobData.title} </CardGivenTitle>
                <div className='avatarDiv1'>
                {UserAvatarWithText2(employerUser,0)}
                <ComponentDialog button_component={
                    <CardTitle style={{textDecoration: 'underline'}}>View Employer's job post ID #{jobPostId} </CardTitle>
                                    }
                                 content_component={
                                     <JobPostCard {...jobData}/>
                                 }
                />

            </div>


            <CardText>Type: {jobData.jobtype}</CardText>

            <CardText>Location: {jobData.location}</CardText>

            <CardText>Salary: {jobData.salary}</CardText>

            <CardText>Tags: {jobData.tags}</CardText>


            <CardText></CardText>
            {/*<CardGivenTitle>Your Application Info:</CardGivenTitle>*/}
            <CardTitle > Application ID #{applicationId}</CardTitle>
            <CardDate>Date Applied: {new Date(date)
                    .toLocaleString('us-en',DATETIME_OPTIONS)}
            </CardDate>

            <CardText></CardText>
            <div className='imgHolder'>
                <div className='avatarDiv2'>
                {UserAvatarWithText2(applicantUser,1)}
                </div>
                <PdfDialog pdfUrl={applicantUser.resume_url}/>
                 <ParagraphDialog text_body={coverLetter}/>

            </div>
        </CardArticle>

    </>);};

export default ApplicationCard;
