import React, {useContext, useEffect, useState} from 'react'
import './ProfilePage.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faPhone,faUser} from "@fortawesome/free-solid-svg-icons";
import Cookies from 'js-cookie';
import toTitleCase from '../../utils/strings_and_text_responses'
import {Link, useParams} from "react-router-dom";
import CommentAPIService from "../BACKEND_DEBUG/CommentAPIService";
import UserRESTAPI from "../../restAPI/UserAPI";
import jwtDecode from "jwt-decode";
import {useUserContext} from "../../context/UserContext";

// import {LoggedInUserContext} from "../../context/LoggedInUserContext";

//TODO: useLocation() to do page view count inside a useEffect(,deps:[location])


export const DATETIME_OPTIONS = {hour: '2-digit',minute: '2-digit', weekday: 'short',month: 'long',day: 'numeric', year: 'numeric'};

const ProfilePage = () => {
    const {state} = useUserContext();
    const currentViewerUser = state.userData;

    const [userProfileData,setUserProfileData] = useState({});
    const url_params = useParams(); //Todo CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 123') decode bytes

    //Antoine context load, avoids useless props-based reloads of components
    // const {loggedInUser} = useContext(LoggedInUserContext);

    String.prototype.toTitleCase = (str) => toTitleCase(str)

      useEffect(() => {
          // console.log("GET USER DETAILS FROM SERVER SIDE !")
          CommentAPIService.GetUserDetails(url_params.uid)//Could Slugify for prettier URL ...
        .then(json => setUserProfileData(json));
  }, [url_params.uid]);

    if (!UserRESTAPI.areAllUserCookiesAvailable()) {

        return <div style={{color: 'white',textAlign: 'center',fontSize: '6em',fontFamily: 'Impact'}}>
            <span> Unauthorized access to profile page route: Must log into user account to view this page</span>
            <hr/>
            <img src="https://i.imgflip.com/5132fw.png" alt="sadge cat"/>
        </div>
    }
    let isViewingOwnProfile;
    let hasAdminTokenClaims;
    try {
        let jwtdecoded = jwtDecode(Cookies.get("access_token"));
        isViewingOwnProfile = jwtdecoded.user_id === url_params.uid || url_params.uid  === "current"
        hasAdminTokenClaims = jwtdecoded.hasOwnProperty('admin');

    }catch {
        isViewingOwnProfile = false;
        hasAdminTokenClaims = false;
    }

    function checkIfItemExists(item){
        if(item != null){
            return item;
        }
        return "no user logged in"
    }
    return (

        <container className="daddyContainer">
            <container className="profile_container_1">
                <img className="profile_picture" src={checkIfItemExists(userProfileData.photo_url)} alt="pfp"/>
                <h1 className="profile-content-username"> {checkIfItemExists(userProfileData.firstName)} </h1>
                <h1 className="profile-content-username"> {checkIfItemExists(userProfileData.lastName)} </h1>
                <h1 className="profile-usertype"> <FontAwesomeIcon icon={faUser}/>
                    &nbsp;{toTitleCase(checkIfItemExists(userProfileData.userType))}
                </h1>
                {/*<h1 className="profile-phone"><FontAwesomeIcon icon={faPhone} /> PHONE NUMBER NOT ADDED</h1>*/}
                <h1  className="profile-email"> <FontAwesomeIcon icon={faEnvelope} />
                    &nbsp;{checkIfItemExists(userProfileData.email)}
                </h1>
                <hr className="profile-line-seperator"></hr>

                <h1  className="profile-content-lastSeen_title">
                    Last seen:
                </h1>
                <h1 className="profile-content-lastSeen">
                    {new Date(parseInt(userProfileData.lastSeenEpoch))
                    .toLocaleString('us-en',DATETIME_OPTIONS)}
                </h1>
                <h1  className="profile-content-dateAdded_title">
                    Member since:
                </h1>
                <h1  className="profile-content-dateAdded">
                        {checkIfItemExists(new Date(parseInt(userProfileData.creationEpoch))
                    .toLocaleString('us-en',DATETIME_OPTIONS))}
                </h1>
                {
                    (isViewingOwnProfile || hasAdminTokenClaims)   &&
                <footer>

                    <Link
                        to={{ pathname: `/profile/${url_params.uid}/edit`,
                                search : `?editor=${currentViewerUser.uid}`}}>
                    <button className="update-profile-btn"
                            onClick={()=> {
                                window.caches.open('profileEditing')
                                    .then(cache => {
                                        cache.put('/editedUserProfileData',
                                            new Response(JSON.stringify(userProfileData)))
                                    })
                            }}
                    >Edit my profile</button>
                        </Link>
                </footer>
                }
            </container>

            <container className="profile_container_2">

                <h1 className="profile-content-title"> Bio </h1>
                <h1 className="profile-content-introduction">My name is [insert name] and I am a young aspiring software engineer. From a very young age, I have been fascinated by the world of technology and computers, and I have always been intrigued by how software works. As I grew up, I began exploring different programming languages, experimenting with various coding projects, and expanding my knowledge of computer science.

My passion for software engineering grew stronger as I started to see how it can positively impact people's lives. I believe that software engineering has the potential to solve some of the world's most pressing problems and make a significant difference in society. As a result, I am determined to become a skilled software engineer and contribute to the field in a meaningful way.

I am excited about the endless possibilities that software engineering offers and I look forward to learning more and expanding my skills. I am committed to working hard and pursuing my dreams, and I am confident that with dedication and effort, I can make a meaningful contribution to the world of software engineering.

Thank you for reading and I hope to share more of my journey with you soon.</h1>

            </container>

            <container className="profile_container_3">
            <iframe className="profile_resume" src={userProfileData.resume_url}
                    alt="resume" >
                <iframe className="profile_resume" src={userProfileData.resume_url}
                    alt="resume" style={{width:'100%', height:'800px',overflow: 'hidden'}} >
                </iframe>
            </iframe>
            </container>
        </container>

  )
}

export default ProfilePage