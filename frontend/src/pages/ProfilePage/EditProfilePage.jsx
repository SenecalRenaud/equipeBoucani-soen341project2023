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
    return <>
        <h2>
            HELLO THERE
        </h2>

      </>
    };

export default EditProfilePage;
