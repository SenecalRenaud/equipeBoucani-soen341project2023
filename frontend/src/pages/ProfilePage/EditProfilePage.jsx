import React, {useState, useEffect, useCallback, useRef} from 'react';
import {useNavigate, useParams, useLocation, Link} from 'react-router-dom';
import jwtDecode from "jwt-decode";
import Cookies from "js-cookie";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope, faUser} from "@fortawesome/free-solid-svg-icons";
import toTitleCase from "../../utils/strings_and_text_responses";

import './ProfilePage.css';
import {DATETIME_OPTIONS} from "./ProfilePage";


const EditProfilePage = () => {
    const history = useNavigate();
    const {uid} = useParams();
    const location = useLocation();
    const editor_uid = new URLSearchParams(location.search).get('editor');

    const [userProfileData,setUserProfileData] = useState({})
    const [originalProfileData, setOriginalProfileData] = useState({})

    const [firstNameChanged,setFirstNameChanged] = useState(false);
    const [lastNameChanged,setLastNameChanged] = useState(false);
    const [emailChanged,setEmailChanged] = useState(false);
    const [resumeChanged,setResumeChanged] = useState(false);
    const [pfpChanged,setPfpChanged] = useState(false);

    const pfpOutputRef = useRef(null);
    const pfpInputRef = useRef(null);
    const resumeOutputRef = useRef(null);
    const resumeInputRef = useRef(null);

    useEffect( ()=> {
        window.caches.match('/editedUserProfileData')
      .then(response => {
        if (response) {
          return response.json();
        }
      })
      .then(data => {
          console.log("EEEEEEIIIIII")
        setUserProfileData(data);
        setOriginalProfileData(data)
      });
            try {
        let jwtdecoded = jwtDecode(Cookies.get("access_token"));

        if (editor_uid == null || editor_uid !== jwtdecoded.user_id) {
            console.log("Invalid profile route query and/or url")
            return history('/');
        }

        if(
            (!(jwtdecoded.user_id === uid || uid  === "current")
            && !jwtdecoded.hasOwnProperty('admin'))
        )
            throw new Error("Unauthorized JWT claim.")

    }catch {
        alert("Not Authorized to edit this profile");
        return history(-1);
    }
    console.log("Editing Profile")
    }, [])


    // if (location.state == null){
    //     return <></>
    // }
    useEffect(() => {
        setFirstNameChanged(originalProfileData.firstName !== userProfileData.firstName)
        setLastNameChanged(originalProfileData.lastName !== userProfileData.lastName)
        setEmailChanged(originalProfileData.email !== userProfileData.email)
    },[originalProfileData,
        userProfileData])

    const handleTextInputChange = (event) => { //todo useCallback
        const { name, value } = event.target;
        setUserProfileData({ ...userProfileData, [name]: value });
    };

    const handlePfpImageChange = (event) => { //todo useCallback
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
          setUserProfileData({ ...userProfileData, photo_url: event.target.result });
        };

        reader.readAsDataURL(file);

        setPfpChanged(true)

        // let image = document.getElementById('pfpOutput');
	    // image.src = URL.createObjectURL(event.target.files[0]);

    };

    const handleResumeFileChange = (event) => { //todo useCallback
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = (event) => {
          setUserProfileData({ ...userProfileData, resume_url: event.target.result });
        };

        reader.readAsDataURL(file);

        setResumeChanged(true)

        // let iframe_pdf = document.getElementById('resumeOutput');
	    // iframe_pdf.src = URL.createObjectURL(event.target.files[0]);

    };
    /**
     * _@app.route("/firebase-api/edit-user/<_uid>/",methods=['PATCH','POST'])
     * _@authorized(myself=True)
     * _def update_user_details(_uid):
     *
     * Contact ChiefsBestPal @ Antoine Cantin before altering this.
     *
     * @param event
     * @returns {Promise<void>}
     */
    const handleSubmit = async (event) => { //todo useCallback
        event.preventDefault();
        const formData = new FormData();
        if (firstNameChanged)
            formData.append('firstName', userProfileData.firstName);
        if (lastNameChanged)
            formData.append('lastName', userProfileData.lastName);
        if (emailChanged)
            formData.append('email', userProfileData.email);
        if (pfpChanged) {
            // formData.append('profilePicture', userProfileData.photo_url);
            formData.append('profilePicture',pfpInputRef.current.files[0]);
        }
        if (resumeChanged) {
            // formData.append('uploadedResume', userProfileData.resume_url);
            formData.append('uploadedResume',resumeInputRef.current.files[0]);
        }
        // formData.append('bio', userProfileData.bio);
        console.log("FORM DATA")
        // console.log(formData)
        console.log(uid)
        await window.caches.open('profileEditing')
                    .then(cache => {
                        cache.put('/editedUserProfileData',
                            new Response(JSON.stringify(userProfileData)))
                    })
        return await fetch(`/firebase-api/edit-user/${uid}/`, {
          method: 'PATCH',
          body: formData,
          headers: {
            'Authorization': `Bearer ${Cookies.get('access_token')}`,
              // 'Content-Type': 'application/x-www-form-urlencoded'
            //'Content-Type': 'multipart/form-data'
          },
          // files: resumeInputRef.current.files[0]
        }).then(response => {
          console.log("Updated User info !")
          console.log("Response : ",response)
          setOriginalProfileData(userProfileData)

          let curr_url_path = location.pathname + location.search

          history(`/profile/${uid}`)
          history(curr_url_path)
          return history(`/profile/${uid}`)

        }).catch(error => {
          console.log(error);
        });

    };
    function checkIfItemExists(item){
        if(item != null){
            return item;
        }
        return "no user logged in"
    }

    return (<form className="daddyContainer" onSubmit={handleSubmit}
                  encType="multipart/form-data">
        <container className="profile_container_1">
            <label>
              Profile Picture:
              <input type="file" accept="image/*" onChange={handlePfpImageChange}
                        name="profilePicture" ref={pfpInputRef}/>
            </label>
        {userProfileData.photo_url && <img
                                        onClick={document.forms[0].elements}
                                        src={checkIfItemExists(userProfileData.photo_url)} alt="pfp"
                                        className={pfpChanged ? "editChanged" : ""}
                                        ref={pfpOutputRef}/>}
            <label className="profile-content-username">
                <input className={firstNameChanged ? "editChanged" : ""} type='text' value={checkIfItemExists(userProfileData.firstName)}
                onChange={(event) => {handleTextInputChange(event); setFirstNameChanged(originalProfileData.firstName === userProfileData.firstName)}}
                       name="firstName"
            /> </label>
            <label className="profile-content-username">
                <input className={lastNameChanged ? "editChanged" : ""} type='text' value={checkIfItemExists(userProfileData.lastName)}
            onChange={(event) => {handleTextInputChange(event); setLastNameChanged(originalProfileData.lastName === userProfileData.lastName)}}
                       name="lastName"

            />
            </label>
            <h1 className="profile-usertype editDisabled"> <FontAwesomeIcon icon={faUser}/>
                &nbsp;{toTitleCase(checkIfItemExists(userProfileData.userType))}
            </h1>
            {/*<h1 className="profile-phone"><FontAwesomeIcon icon={faPhone} /> PHONE NUMBER NOT ADDED</h1>*/}
            <h1 className="profile-email" style={{float : `left`}}> <FontAwesomeIcon icon={faEnvelope} />
                &nbsp;<input className={emailChanged ? "editChanged" : ""} type='email' value={checkIfItemExists(userProfileData.email)}
                    style={{width: '85%'}}
                    onChange={(event) => {handleTextInputChange(event); setEmailChanged(originalProfileData.email === userProfileData.email)}}
                name='email'/>
            </h1>
            <hr className="profile-line-seperator"></hr>

            <h1  className="profile-content-lastSeen_title editDisabled">
                Last seen:
            </h1>
            <h1 className="profile-content-lastSeen editDisabled">
                {new Date(parseInt(userProfileData.lastSeenEpoch))
                .toLocaleString('us-en',DATETIME_OPTIONS)}
            </h1>
            <h1  className="profile-content-dateAdded_title editDisabled">
                Member since:
            </h1>
            <h1  className="profile-content-dateAdded editDisabled">
                    {checkIfItemExists(new Date(parseInt(userProfileData.creationEpoch))
                .toLocaleString('us-en',DATETIME_OPTIONS))}
            </h1>
        </container>
                        <container className="profile_container_2">

            <h1 className="profile-content-title"> Bio </h1>
            <textarea className="profile-content-introduction" cols="80" rows="20">
                 My name is [insert name] and I am a young aspiring software engineer. From a very young age, I have been fascinated by the world of technology and computers, and I have always been intrigued by how software works. As I grew up, I began exploring different programming languages, experimenting with various coding projects, and expanding my knowledge of computer science.

My passion for software engineering grew stronger as I started to see how it can positively impact people's lives. I believe that software engineering has the potential to solve some of the world's most pressing problems and make a significant difference in society. As a result, I am determined to become a skilled software engineer and contribute to the field in a meaningful way.

I am excited about the endless possibilities that software engineering offers and I look forward to learning more and expanding my skills. I am committed to working hard and pursuing my dreams, and I am confident that with dedication and effort, I can make a meaningful contribution to the world of software engineering.

Thank you for reading and I hope to share more of my journey with you soon.</textarea>

        </container>

        <container className="profile_container_3">
            <label>
          Resume:
          <input type="file" accept="application/pdf" onChange={handleResumeFileChange}
          name="uploadedResume" ref={resumeInputRef}/>
        </label>
        {userProfileData.resume_url && (
            <div>
            <a href={userProfileData.resume_url} target="_blank" rel="noopener noreferrer" style={{color: 'orangered',textDecoration : 'underline'}}>
                View Resume in other tab</a>
                        <iframe className="profile_resume" src={userProfileData.resume_url}
                alt="resume" style={{width:'100%', height:'800px',overflow: 'hidden'}}
            className={resumeChanged ? "editChanged" : ""}
               ref={resumeOutputRef}      >
            </iframe>
            </div>
            )
        }

        </container>
            <container className="profile_container_4">
                <input type='submit' value="Save changes"
                       className='update-profile-btn editSave'
                        />
                <span className='hoverMessage'> Saving all changes and update profile </span>
                <button onClick={(e)=> {history(`/profile/${uid}`)}}
                    className='update-profile-btn editCancel'
                    >Cancel</button>
                <span className='hoverMessage'> Cancel all changes and return to profile </span>
            </container>
         </form>
    );

};

export default EditProfilePage;
