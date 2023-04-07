import React, {useEffect, useState} from "react";
import './App.css';

import { Navbar} from './components';

import { BrowserRouter as Router, Routes, Route,Navigate}
    from 'react-router-dom';

import Home from './pages/Home/home';
import JobPostingForm from "./pages/PostAJob/JobPostingForm";

import PostCommentForm from "./pages/BACKEND_DEBUG/PostCommentForm";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import SignUp from "./pages/SignUp/SignUpForm";
import SignIn from "./pages/SignIn/SignInForm";
// import SESSION_COOKIES_DEBUG from "./pages/SESSION_COOKIES_DEBUG";
import ViewJobPosts from "./pages/JobPosts/ViewJobPosts";
import CommentAPIService from "./pages/BACKEND_DEBUG/CommentAPIService";
// import Cookies from 'js-cookie';
import UserRESTAPI from "./restAPI/UserAPI";
import MyJobPosts from "./pages/JobPosts/MyJobPosts";
// import JobPostingAPIService from "./pages/PostAJob/JobPostingAPIService";
import {useUserContext} from "./context/UserContext";
import {defaultState} from "./context/UserReducer";
import LoadingScreen from "./pages/LoadingScreen/LoadingScreen";
import PageNotFound from "./pages/Err404Screen/Err404Screen";
// import SESSION_COOKIES_DEBUG from "./pages/SESSION_COOKIES_DEBUG";


//let renderNumber = 1;

function App() {
    const {state,dispatch} = useUserContext();

    const [comments, setComments] = useState([""]);
    const postedComment = (comment) =>{
        let new_comments = [...comments,comment]
        setComments(new_comments)
    }
    const [jobs, setJobs] = useState([""]);
    const postedJob = (job) =>{
        let new_jobs = [...jobs, job]
        setJobs(new_jobs)
    }

    useEffect(
        () => {
            (async function assertFrontendAuthIsSyncedWithBackendSession() {
                /*
                Antoine@ChiefsBestPal
                do not change without review,
                even if possibly subject to necessary changes in near future.
                 */
                //todo renderNumber ^= 0b11;

                const [isInBackendSession, userLoggedInBackendSession] = await UserRESTAPI.isUserLoggedInBackendSession();
                // UserRESTAPI.userLoggedInBackendSession = userLoggedInBackendSession;
                if (isInBackendSession && state === defaultState) {

                    dispatch({type: 'SET_USER', payload: userLoggedInBackendSession})
                } else if (!isInBackendSession && state !== defaultState) {

                    dispatch({type: 'CLEAR_USER'});
                } else if (!isInBackendSession && state === defaultState) {

                    if (UserRESTAPI.areAnyUserCookiesAvailable()) { // MEANS BACKEND IS LOGGED OFF, BUT FRONTEND NOT COMPLETELY

                        await CommentAPIService.UserLogout(dispatch,
                            {frontend_logout_only: true}) //Clean up frontend auth only
                        window.location.replace('http://localhost:3000')
                    }

                    return;
                }

                if (Object.keys(userLoggedInBackendSession).length === 0
                    && !UserRESTAPI.checkIfAllUserFrontendCacheAvailable()
                    && !UserRESTAPI.areAllUserCookiesAvailable()) { // No user logged in backend session
                    console.log("CCCCCCCCCCCCC")
                    CommentAPIService.UserLogout(dispatch,
                        {frontend_logout_only: true}) //Clean up frontend auth only

                    return;
                }
                if (!UserRESTAPI.areAllUserCookiesAvailable()) { // Some authentification / token cookies are missing, frontend unauthorized
                    console.log("BBBBBBBB")
                    console.log(Object.keys(userLoggedInBackendSession).length === 0)

                    alert("BOUCANI SECURITY: Some User Auth / Token Cookies manual alterations were detected. \n\r\tImmediate logout. \n\r\t Status: 401")
                    await CommentAPIService.UserLogout(dispatch) // Completely logout server and client side
                    window.location.replace('http://localhost:3000')
                    return;
                }
                //From this point:
                // Authorized user logged in Backend
                // User Cookies are valid
                let userLoggedInFrontendAuth;
                try {
                    userLoggedInFrontendAuth = UserRESTAPI.parseCurrentUserObjFromFrontendCache()
                    //console.log(UserRESTAPI.parseCurrentUserObjFromFrontendCache())
                    if (Object.keys(userLoggedInFrontendAuth).length === 0)
                        throw new Error("Incomplete (or empty) frontend session cache for logged in user descriptor")
                } catch (frontendCachedUserIncompleteError) {
                    console.log(frontendCachedUserIncompleteError)
                    console.log("AAAAAAAAAAAA")
                    alert("BOUCANI SECURITY: Some Local User Descriptor / Cache  manual alterations were detected. \n\r\tImmediate logout. \n\r\t Status: 401")
                    CommentAPIService.UserLogout(dispatch) // Completely logout server and client side
                    window.location.replace('http://localhost:3000')
                    return;

                }
                console.log("DDDDDDDDDDDDD")
                //TODO LOCALSTORAGE HERE NOW MOSTLY USED FOR DEBUG, REMOVE USAGE IN APIs AND ALL CODE USING IT IF NEED BE !
                if (Object.keys(userLoggedInBackendSession).length !== 0) {
                    await UserRESTAPI.updateCachedFrontendUserFromBackendSession(
                        {userObj: userLoggedInBackendSession}
                    )
                }

            })()
        }
        ,[]
    )
    //NOTE: </UserContextProvider> is wrapped in the App's index.js ...
return (
    <Router>
    <Navbar />

        {console.log("Loaded App.js")}

    <Routes>
        <Route path="*" element={<PageNotFound/>}/>
        <Route exact path='/'  element={<Home />} />
        <Route path='/jobposting' element={<JobPostingForm postedJob={postedJob}/>} />
        <Route path='/BACKEND_DEBUG' element={<PostCommentForm postedComment={postedComment} />}/>
        <Route path='/signup'
           element={
            state.isAuthenticated ? <Navigate to="/profile/current"/> :
                        <SignUp/>
           } />
        <Route path='/signin'
           element={
            state.isAuthenticated ? <Navigate to="/profile/current"/> :
                        <SignIn/>
           } />

        <Route path='/viewjobposts' element={<ViewJobPosts postedJob={postedJob} />} />

        <Route exact path='/profile/:uid' element={<ProfilePage/>} />
        <Route exact path='current/jobpostings' element={<MyJobPosts postedJob={postedJob} />}/>
        {/*TODO: Make path:  /viewjobposts/:uid
           TODO  and use useParams() hook like such: params.uid in useEffect dependencies */}
        {/*<Route path='/SESSION_COOKIES_DEBUG' element={<SESSION_COOKIES_DEBUG/>}/>*/}

        <Route exact path='/loading' element={<LoadingScreen/>} />

    </Routes>
    </Router>

);
}

export default App;

// <img src={logo} className="App-logo" alt="logo" />
// <p>
//   Edit <code>src/App.js</code> and save to reload.
// </p>
// <a
//   className="App-link"
//   href="https://reactjs.org"
//   target="_blank"
//   rel="noopener noreferrer"
// >
//   Learn React
// </a>
