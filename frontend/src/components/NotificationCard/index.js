import React, {useEffect, useState} from "react";
import styled from "styled-components";
import UserDropDownMenu from "../UserDropDownMenu/UserDropDownMenu";
import {UserAvatarWithText} from "../Avatars";
import CommentAPIService from "../../pages/BACKEND_DEBUG/CommentAPIService";
import {useUserContext} from "../../context/UserContext";
import { useNavigate } from 'react-router-dom';
import JobPostingAPIService from "../../pages/PostAJob/JobPostingAPIService";
import ApplicationAPIService from "../../pages/Apply/ApplicationAPIService";

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
export const CardDate = styled.h4`
`;

export const CardRejectButton = styled.button`
  float: right;
  margin-right: 3.5em;
  font-size: 16px;
  padding: 14px 28px;
  background: none;
  color: red;
  border: 2px solid red;
  border-radius: 5px;
  margin-bottom: 1.5em;
  &:hover{
    background-color: red;
    color:white;
  }
`;

export const CardAcceptButton = styled.button`
  float: right;
  margin-right: 3.5em;
  font-size: 16px;
  padding: 14px 28px;
  background: none;
  color: green;
  border: 2px solid green;
  cursor: pointer;
  border-radius: 5px;
  &:hover{
    background-color: green;
    color:white;
  }
`;



const NotificationCard = ({applicationId, jobPostId, applicantUid, coverLetter, date}) => {

    const {state} = useUserContext();

    const [jobData, setJobData] = useState([{}]);
    const [employerUid, setEmployerUid] = useState('');
    const [applicantUser, setApplicantUser] = useState([{}])

    let [er,setEr] = useState(false);
    let [errorString, setErrorString] = useState("");

    const navigate = useNavigate();


    useEffect(() => {

        fetch("/getjob/" + jobPostId + "/").then(
            response => response.json()
        ).then(
            data => {
                setJobData(data);
                setEmployerUid(jobData.employerUid);
            }
        )
            .catch(function(error){
                console.log("empty db", error.toString());
                setErrorString(error.toString())
                setEr(true);
            })
    },[])

    useEffect(
        ()=> {
            CommentAPIService.GetUserDetails(
                applicantUid
            ).then(
                (data) => {
                    setApplicantUser(data)
                }
            )
        },
        [] //effect hook only called on mount since empty dependencies array
    )

    const HandleAccept = async (event) => {
        await JobPostingAPIService.sendAcceptedNotification({"email": applicantUser.email, "job_title": jobData.title})
            .catch(error => console.log('Following error occurred after fetching from API: ',error))

        await ApplicationAPIService.DeleteApplication(applicationId)
            .then((any)=> window.location.reload())
            .catch(error => console.log('Following error occurred after fetching from API: ',error))
    }

    const HandleReject = async (job_id) => {
        await JobPostingAPIService.sendRejectedNotification({"email": applicantUser.email, "job_title": jobData.title})
            .catch(error => console.log('Following error occurred after fetching from API: ',error))

        await ApplicationAPIService.DeleteApplication(applicationId)
            .then((any)=> window.location.reload())
            .catch(error => console.log('Following error occurred after fetching from API: ',error))
    };

    return (<>
        <CardArticle>
            <CardTitle>A user has applied to {jobData.title}!</CardTitle>

            <div>
                {
                    <UserDropDownMenu
                        triggerMenuMarkup={UserAvatarWithText(applicantUser,0)}
                        triggeredUserUid={applicantUid}
                    />
                }
            </div>


            <CardText></CardText>
            &nbsp;
            <CardGivenTitle>Application Info:</CardGivenTitle>
            &nbsp;
            <CardDate>Date Applied: {date}
            </CardDate>
            <CardText></CardText>
            <CardText>Cover Letter: {coverLetter}</CardText>
            <CardText></CardText>
            <div>
                <CardRejectButton onClick={() => {HandleReject();}}>Reject</CardRejectButton>
                <CardAcceptButton onClick={() => {HandleAccept();}}>Accept</CardAcceptButton>
            </div>


        </CardArticle>

    </>);};

export default NotificationCard;
