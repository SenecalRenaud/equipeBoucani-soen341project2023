import React, { useState, useEffect } from 'react';
import { useNavigate, useParams,useLocation } from 'react-router-dom';
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";

const EditProfilePage = () => {
    const history = useNavigate();
    const {uid} = useParams();
    const location = useLocation();
    const editor_uid = new URLSearchParams(location.search).get('editor');

    const [userProfileData,setUserProfileData] = useState({})



    useEffect( ()=> {
        window.caches.match('/editedUserProfileData')
      .then(response => {
        if (response) {
          return response.json();
        }
      })
      .then(data => {
        setUserProfileData(data);
      });
    }, [])


    // if (location.state == null){
    //     return <></>
    // }
    try {
        let jwtdecoded = jwtDecode(Cookies.get("access_token"));

        if (editor_uid == null || editor_uid !== jwtdecoded.user_id) {
            console.log("Invalid profile route query and/or url")
            history('/');
            return <></>
        }

        if(
            (!(jwtdecoded.user_id === uid || uid  === "current")
            && !jwtdecoded.hasOwnProperty('admin'))
        )
            throw new Error("Unauthorized JWT claim.")

    }catch {
        alert("Not Authorized to edit this profile");
        history(-1);
        return <></>
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
        formData.append('uploadedResume', userProfileData.resume_url);
        // formData.append('bio', userProfileData.bio);

        await fetch(`/firebase-api/edit-user/${uid}/`, {
          method: 'PATCH',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          },
        }).then(response => {
          history(`/profile/${uid}`);
        }).catch(error => {
          console.log(error);
        });
    };


    return (
        <div style={{color: "whitesmoke"}}>
          <h1>Edit Profile</h1>
          <form onSubmit={handleSubmit}>
            <label>
              First Name:
              <input type="text" name="firstName" value={userProfileData.firstName} onChange={handleTextInputChange} />
            </label>
            <label>
              Last Name:
              <input type="text" name="lastName" value={userProfileData.lastName} onChange={handleTextInputChange} />
            </label>
            <label>
              Email:
              <input type="email" name="email" value={userProfileData.email} onChange={handleTextInputChange} />
            </label>
            <label>
              Profile Picture:
              <input type="file" accept="image/*" onChange={handlePfpImageChange} />
            </label>
            {userProfileData.photo_url && <img src={userProfileData.photo_url} alt="pfp" />}
            <label>
              Resume:
              <input type="file" accept="application/pdf" onChange={handleResumeFileChange} />
            </label>
            {userProfileData.resume_url && <a href={userProfileData.resume_url} target="_blank" rel="noopener noreferrer">View Resume</a>}
            {/*<label>*/}
            {/*  Bio:*/}
            {/*  <textarea name="bio" value={userProfileData.bio} onChange={handleInputChange}></textarea>*/}
            {/*</label>*/}
            <button type="submit">Save</button>
          </form>
        </div>
      );
};

export default EditProfilePage;
