import React from 'react'
import '../ProfilePage/ProfilePage.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faPhone,faUser} from "@fortawesome/free-solid-svg-icons";
import Cookies from 'js-cookie';
import toTitleCase from '../../utils/strings_and_text_responses'

const ProfilePage = () => {
    const DATETIME_OPTIONS = {hour: '2-digit',minute: '2-digit', weekday: 'short',month: 'long',day: 'numeric', year: 'numeric'}
    String.prototype.toTitleCase = (str) => toTitleCase(str)

    // if (Cookies.get("loggedin_uid") == null) {
    //
    //     return <div style={{color: 'white',textAlign: 'center',fontSize: '6em',fontFamily: 'Impact'}}>
    //         <span> Unauthorized access to profile page route: Must log into user account to view this page</span>
    //         <hr/>
    //         <img src="https://i.imgflip.com/5132fw.png" alt="sadge cat"/>
    //     </div>
    // }
    return (

        <container className="daddyContainer">
            <container className="profile_container_1">
                <img className="profile_picture" src="https://storage.googleapis.com/boucani-webappv2.appspot.com/profilePictures/julius-caesar.jpg" alt="pfp"/>
                <h1 className="profile-content-username"> Julius-askjdhaksjhdkjh </h1>
                <h1 className="profile-content-username"> Ceasar </h1>
                <h1 className="profile-usertype">&nbsp; <FontAwesomeIcon icon={faUser}/>
                    ADMIN
                </h1>
                {/*<h1 className="profile-phone"><FontAwesomeIcon icon={faPhone} /> PHONE NUMBER NOT ADDED</h1>*/}
                <h1  className="profile-email">&nbsp; <FontAwesomeIcon icon={faEnvelope} />
                    julius.doesjuuls@hotmail.it
                </h1>
                <hr className="profile-line-seperator"></hr>
                <h1 className="profile-content-lastSeen_title">
                    Last logged in :
                </h1>
                <h1 className="profile-content-lastSeen">
                    {new Date(parseInt(1679678786417))
                    .toLocaleString('us-en',DATETIME_OPTIONS)}
                </h1>
                <h1  className="profile-content-dateAdded_title">
                    Date Added :
                </h1>
                <h1  className="profile-content-dateAdded">
                     {new Date(parseInt(1679604942173))
                    .toLocaleString('us-en',DATETIME_OPTIONS)}
                </h1>

            </container>

            <container className="profile_container_2">

                <h1 className="profile-content-title">Information</h1>
                <h1 className="profile-content-introduction">My name is [insert name] and I am a young aspiring software engineer. From a very young age, I have been fascinated by the world of technology and computers, and I have always been intrigued by how software works. As I grew up, I began exploring different programming languages, experimenting with various coding projects, and expanding my knowledge of computer science.

My passion for software engineering grew stronger as I started to see how it can positively impact people's lives. I believe that software engineering has the potential to solve some of the world's most pressing problems and make a significant difference in society. As a result, I am determined to become a skilled software engineer and contribute to the field in a meaningful way.

I am excited about the endless possibilities that software engineering offers and I look forward to learning more and expanding my skills. I am committed to working hard and pursuing my dreams, and I am confident that with dedication and effort, I can make a meaningful contribution to the world of software engineering.

Thank you for reading and I hope to share more of my journey with you soon.</h1>

            </container>

            <container className="profile_container_3">
            <iframe className="profile_resume" src={"https://storage.googleapis.com/boucani-webappv2.appspot.com/resumes/Doc1.pdf"}
                    alt="resume" style={{width:'100%', height:'800px',overflow: 'hidden'}} >
                </iframe>
            </container>
        </container>
  )
}

export default ProfilePage