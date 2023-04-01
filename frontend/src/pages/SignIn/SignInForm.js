import React, {useContext, useState} from 'react';
import './SignInForm.css';
import CommentAPIService from "../BACKEND_DEBUG/CommentAPIService";
import {Link} from "react-router-dom";
// import { useCookies } from 'react-cookie';
import {UserContext, useUserContext} from "../../context/UserContext";
const SignInForm = () => {

    // Antoine's single Context x Reducer user stateful information storage ! Efficient!
    // If certain information are accessed often, one could redesign into small contexts
    // for improved relative performance.
    // const { loggedInUser, setLoggedInUser, clearLoggedInUser } = useContext(UserContext)
    const { dispatch } = useUserContext();

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

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);

        CommentAPIService.UserSignIn(dispatch,formData)
            // .then(
            // auth_json => {
            //     auth_json.uid = auth_json.localId
            //     delete auth_json.localId
            //     // setLoggedInUser(auth_json)
            // }
        // )


    }

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