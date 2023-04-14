import React, {useEffect, useState} from "react";
import styled from "styled-components";
import './quickcss.css'
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
import pdf_img from "../../assets/pdf.png";
import cl_img from "../../assets/cover.png";

export const CardTitle = styled.h1`
    font-size: 1.25em;
    text-align: left !important;
   margin-left: 20px;
`;
export const CardGivenTitle = styled.h4`
    font-size: 2em;
  text-align: center;
  margin-top:10px;
`;
export const CardArticle = styled.div`
  border: 1px solid #4d4d4d;
  margin-top: 10px;
  width: 100%;
  align-self: stretch;
  
  

`;
export const CardText = styled.p`
    margin-left: 20px;
`;
export const CardDate = styled.b`
`;




const ApplicationCardCopy = ({applicationId, jobPostId=420,applicantUid, coverLetter ="COVER LETTER", date="SOME date"}) => {

    // const {state} = useUserContext();

    const [jobData, setJobData] = useState(
        {
  "date": "2023-04-03T23:34:48",
  "description": "Attention all aspiring minions! Gru Industries is now hiring for a variety of positions in our world-renowned supervillain organization. If you're looking for a job where you can use your skills in evil engineering, weapons development, or general mischief-making, then we want to hear from you!\n\nJob Title: Minion (multiple positions available)\n\nJob Description:\n\nAs a minion at Gru Industries, you'll be responsible for a wide range of tasks, including but not limited to:\n\n    Assisting in the planning and execution of complex heists and world domination plots\n    Developing and using cutting-edge technology to achieve our evil objectives\n    Managing the day-to-day operations of our supervillain organization, including maintenance of our headquarters and equipment\n    Acting as a loyal and obedient servant to our fearless leader, Felonious Gru\n\nQualifications:\n\nTo be considered for a minion position, you must meet the following qualifications:\n\n    Willingness to engage in acts of evil and villainy\n    Ability to work well in a team environment, including with other minions and with our supervillain clients\n    Familiarity with basic weapons and tools of the supervillain trade (e.g. Freeze Rays, Inflation Guns, Shrink Rays, etc.)\n    Fluent in Minionese or willingness to learn\n\nBenefits:\n\nAt Gru Industries, we take care of our minions. In addition to a competitive salary and the satisfaction of knowing you're helping to take over the world, we offer the following benefits:\n\n    Comprehensive health insurance (including coverage for injuries sustained during heists or battles with law enforcement)\n    Retirement plan (because even minions deserve a comfortable retirement)\n    Access to the latest supervillain technology and gadgets\n    Opportunities for advancement within the organization (subject to successful completion of assigned missions)\n\nTo apply for a minion position, please submit your resume and a cover letter explaining why you would be a valuable addition to our supervillain team. We look forward to hearing from you!\n\nI LOVE MF MINIONS",
  "editDate": "2023-04-10T13:46:32",
  "employerUid": "RJA0ysCVJCfd9mlFrV31zyMXftF3",
  "id": 1,
  "jobtype": "Full-Time",
  "location": "Vector's basement",
  "salary": 100,
  "tags": "Engineering,Travel",
  "title": "Minon Slave Rocket Scientist"
}
    );
    const [employerUid, setEmployerUid] = useState('RJA0ysCVJCfd9mlFrV31zyMXftF3');

    const [employerUser,setEmployerUser] = useState(
        {   "creationEpoch": 1679976475728,   "email": "BaldandBeautiful@grumail.com",   "firstName": "Felonius",   "lastName": "Gru",   "lastSeenEpoch": 1681343764574,   "photo_url": "https://storage.googleapis.com/boucani-webappv2.appspot.com/profilePictures/DespicableMeGru.jpg",   "resume_url": "https://storage.googleapis.com/boucani-webappv2.appspot.com/resumes/GruEpicResume.pdf",   "uid": "RJA0ysCVJCfd9mlFrV31zyMXftF3",   "userType": "EMPLOYER" }
    )
    let [er,setEr] = useState(false);
    let [errorString, setErrorString] = useState("");

    // const navigate = useNavigate();

    // useEffect(() => {
    //
    //     fetch("/getjob/" + jobPostId + "/").then(
    //         response => response.json()
    //     ).then(
    //         data => {
    //             setJobData(data);
    //             console.log("APPLICANT")
    //             console.log(data)
    //             setEmployerUid(jobData.employerUid);
    //             return CommentAPIService.GetUserDetails(data.employerUid);
    //         }
    //     ).then(data => {
    //         console.log("EMPLOYER")
    //         console.log(data)
    //         setEmployerUser(data);
    //     })
    //         .catch(function(error){
    //         console.log("empty db", error.toString());
    //         setErrorString(error.toString())
    //         setEr(true);
    //     })
    // },[])


    return (<>
        <CardArticle>
            {
                // <UserDropDownMenu
                //     triggerMenuMarkup={UserAvatarWithText(employerUser,0)}
                //     triggeredUserUid={employerUid}
                // />
                UserAvatarWithText(employerUser,0)
            }



            <CardGivenTitle >{jobData.title}</CardGivenTitle>

            <CardTitle>Job post ID#{jobPostId} </CardTitle>

            <CardText>Type: {jobData.jobtype}</CardText>

            <CardText>Location: {jobData.location}</CardText>

            <CardText>Salary: {jobData.salary}</CardText>

            <CardText>Tags: {jobData.tags}</CardText>


            <CardText></CardText>
            {/*<CardGivenTitle>Your Application Info:</CardGivenTitle>*/}
            <CardDate>Date Applied: {date}
            </CardDate>
            <CardText></CardText>
            <div className='imgHolder'>
            <img  className='cardimagepdf' src={pdf_img} alt="resume"/>
            <img  className='cardimagecl' src={cl_img} alt="coverletter"/>
            </div>
        </CardArticle>

    </>);};

export default ApplicationCardCopy;
