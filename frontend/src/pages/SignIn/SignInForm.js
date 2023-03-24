import React, { useState } from 'react';
import './SignInForm.css';
import CommentAPIService from "../BACKEND_DEBUG/CommentAPIService";
import {Link} from "react-router-dom";
// import { useCookies } from 'react-cookie';
import Cookies from 'js-cookie';
const SignInForm = () => {
    // const [cookies, setCookie, removeCookie] = useCookies(['access_token', 'refresh_token','loggedin_uid']);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // removeCookie('access_token')
        // removeCookie('refresh_token')
        // removeCookie('loggedin_uid') .hasOwnProperty('loggedin_uid') to check if user logged in.
        console.log('Email:', email, 'Password:', password); //TODO REMOVE ASAP WHEN DEBUGGING DONE

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        CommentAPIService.UserSignIn(formData)
            .then(auth_json => {
                let expires = new Date();
                expires.setTime(expires.getTime() + (auth_json.expires_in * 250 ));
                Cookies.set('access_token', auth_json.idToken);
                Cookies.set('refresh_token', auth_json.refresh_token);
                Cookies.set('loggedin_uid', auth_json.localId);
                // setCookie('access_token', auth_json.idToken, { path: '/',  expires})
                // setCookie('refresh_token', auth_json.refresh_token, {path: '/', expires})
                // setCookie('loggedin_uid', auth_json.localId, {path: '/', expires})
                console.log(auth_json)
                window.localStorage.setItem("firstName",auth_json.firstName)
                window.localStorage.setItem("lastName",auth_json.lastName)
                window.localStorage.setItem("email",auth_json.email)
                window.localStorage.setItem("photo_url",auth_json.photo_url)
                window.localStorage.setItem("resume_url",auth_json.resume_url)
                window.localStorage.setItem("lastSeenEpoch",auth_json.lastSeenEpoch)
                window.localStorage.setItem("creationEpoch",auth_json.creationEpoch)
                window.localStorage.setItem("userType",auth_json.userType)
            })
            .then((any)=> window.location.replace('http://localhost:3000/'))
            .catch(error => console.log('Following error occured after fetching from API: ',error))

    };


    return (
        <div className="sign-in-container">
            <div className="sign-in-card">
                <h1>Sign In</h1>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email-input">Email</label>
                    <input
                        id="email-input"
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                    />
                    <label htmlFor="password-input">Password</label>
                    <input
                        id="password-input"
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                    />
                    <p> Forgot your password? <span style={{textDecoration: "underline", color: "grey"}}>
                        <Link to="/forgotpassword"> Click here </Link></span> </p>
                    <button className="sign-in-button" type="submit">
                        Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SignInForm;