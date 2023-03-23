import React from 'react'
import './ProfilePage.css';
import {Header} from "../../components";
import ProfilePic from "../../assets/Unknown_person.jpg";

const ProfilePage = () => {
    let Unknown_person;
    return (
        <container className="profile_container_1">
            <img className="profile_picture" src={ProfilePic} alt="pfp"/>

        </container>

  )
}

export default ProfilePage