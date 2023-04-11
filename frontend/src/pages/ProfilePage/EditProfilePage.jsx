import React, { useState, useEffect } from 'react';
import { useNavigate, useParams,useLocation } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

const EditProfilePage = () => {
    const history = useNavigate();

    const location = useLocation();
    const uid = new URLSearchParams(location.search).get('edit');

    if (uid == null) {
        console.log("Invalid profile route query and/or url")
        history('/');
        return <></>

    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [userProfileData,setUserProfileData] = useState(location.state.userProfileData)


    try {
        let jwtdecoded = jwtDecode(Cookies.get("access_token"));
        if(
            !(jwtdecoded.user_id === uid || uid  === "current")
            && !jwtdecoded.hasOwnProperty('admin')
        )
            throw new Error("Unauthorized JWT claim.")

    }catch {
        alert("Not Authorized to edit this profile");
        history(-1);
    }
    console.log("Editing Profile")

    const handleTextInputChange = (event) => {
        const { name, value } = event.target;
        setUserProfileData({ ...userProfileData, [name]: value });
    };

    const handlePfpImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
          setUserProfileData({ ...userProfileData, photo_url: event.target.result });
        };

        reader.readAsDataURL(file);
    };

    const handleResumeFileChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
          setUserProfileData({ ...userProfileData, resume_url: event.target.result });
        };

        reader.readAsDataURL(file);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('firstName', userProfileData.firstName);
        formData.append('lastName', userProfileData.lastName);
        formData.append('email', userProfileData.email);
        formData.append('profilePicture', userProfileData.photo_url);
        formData.append('uploadedResume', userProfileData.resume);
        // formData.append('bio', userProfileData.bio);

        await fetch(`/firebase-api/edit-user/${uid}/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(response => {
          history(`/profile/${uid}`);
        }).catch(error => {
          console.log(error);
        });
    };


    return <>
        <h2>
            HELLO THERE
        </h2>

      </>
    };

export default EditProfilePage;
