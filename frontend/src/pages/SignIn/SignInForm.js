import React, { useState } from 'react';
import './SignInForm.css';
import CommentAPIService from "../BACKEND_DEBUG/CommentAPIService";
import {Link} from "react-router-dom";

const SignInForm = () => {
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
        console.log('Email:', email, 'Password:', password); //TODO REMOVE ASAP WHEN DEBUGGING DONE

        const formData = new FormData();
        formData.append('email', email);
        formData.append('password', password);
        CommentAPIService.UserSignIn(formData)
            //.then((any)=> window.location.replace('http://localhost:3000/signin'))
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