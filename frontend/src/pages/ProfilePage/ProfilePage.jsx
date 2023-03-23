import React from 'react'
import './ProfilePage.css';
import {Header} from "../../components";
import ProfilePic from "../../assets/Unknown_person.jpg";
import resume from "../../assets/resume.png"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faPhone} from "@fortawesome/free-solid-svg-icons";

const ProfilePage = () => {
    return (

        <container className="daddyContainer">
            <container className="profile_container_1">
                <img className="profile_picture" src={ProfilePic} alt="pfp"/>
                <h1 className="profile-content-username">Unknown User</h1>
                <h1 className="profile-email"><FontAwesomeIcon icon={faPhone} />    +1 999 999 9999</h1>
                <h1  className="profile-phone"><FontAwesomeIcon icon={faEnvelope} />    johndoe@gmail.com</h1>
                <hr className="profile-line-seperator"></hr>
                <h1 className="profile-content-lastSeen">Last Seen : never</h1>
                <h1  className="profile-content-dateAdded">Date Added : never</h1>

            </container>

            <container className="profile_container_2">

                <h1 className="profile-content-title">Information</h1>
                <h1 className="profile-content-introduction">My name is [insert name] and I am a young aspiring software engineer. From a very young age, I have been fascinated by the world of technology and computers, and I have always been intrigued by how software works. As I grew up, I began exploring different programming languages, experimenting with various coding projects, and expanding my knowledge of computer science.

My passion for software engineering grew stronger as I started to see how it can positively impact people's lives. I believe that software engineering has the potential to solve some of the world's most pressing problems and make a significant difference in society. As a result, I am determined to become a skilled software engineer and contribute to the field in a meaningful way.

I am excited about the endless possibilities that software engineering offers and I look forward to learning more and expanding my skills. I am committed to working hard and pursuing my dreams, and I am confident that with dedication and effort, I can make a meaningful contribution to the world of software engineering.

Thank you for reading and I hope to share more of my journey with you soon.</h1>

            </container>

            <container className="profile_container_3">
            <img className="profile_resume" src={resume} alt="pfp"/>
            </container>
        </container>
  )
}

export default ProfilePage