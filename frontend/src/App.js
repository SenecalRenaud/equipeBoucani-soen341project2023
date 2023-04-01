import React, {useEffect, useState} from "react";
import './App.css';

import { Header, Navbar} from './components';

import { BrowserRouter as Router, Routes, Route}
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
import Cookies from 'js-cookie';
import UserRESTAPI from "./restAPI/UserAPI";
import MyJobPosts from "./pages/JobPosts/MyJobPosts";

function App() {
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
      const userLoggedInBackendSession = await UserRESTAPI.fetchCurrentUserLoggedInBackendSession();
      // UserRESTAPI.userLoggedInBackendSession = userLoggedInBackendSession;
      //    console.log(userLoggedInBackendSession)

      if (Object.keys(userLoggedInBackendSession).length === 0
      && !UserRESTAPI.checkIfAllUserFrontendCacheAvailable()
      && !UserRESTAPI.checkIfAllUserCookiesAvailable()){ // No user logged in backend session
            // console.log("CCCCCCCCCCCCC")
          CommentAPIService.UserLogout({frontend_logout_only : true}) //Clean up frontend auth only

          return;
      }
      if (!UserRESTAPI.checkIfAllUserCookiesAvailable()) { // Some authentification / token cookies are missing, frontend unauthorized
          // console.log("BBBBBBBB")
          alert("BOUCANI SECURITY: Some User Auth / Token Cookies manual alterations were detected. \n\r\tImmediate logout. \n\r\t Status: 401")
          CommentAPIService.UserLogout() // Completely logout server and client side
          window.location.replace('http://localhost:3000')
          return;
      }
      //From this point:
          // Authorized user logged in Backend
          // User Cookies are valid
      let userLoggedInFrontendAuth;
      try {
          userLoggedInFrontendAuth = UserRESTAPI.parseCurrentUserObjFromFrontendCache()
          if(Object.keys(userLoggedInFrontendAuth).length === 0)
              throw new Error("Incomplete (or empty) frontend session cache for logged in user descriptor")
      } catch( frontendCachedUserIncompleteError ) {
          // console.log("AAAAAAAAAAAA")
          alert("BOUCANI SECURITY: Some Local User Descriptor / Cache  manual alterations were detected. \n\r\tImmediate logout. \n\r\t Status: 401")
          CommentAPIService.UserLogout() // Completely logout server and client side
          window.location.replace('http://localhost:3000')
          return;

      }
        // console.log("DDDDDDDDDDDDD")
      if (Object.keys(userLoggedInBackendSession).length !== 0){
            await UserRESTAPI.updateCachedFrontendUserFromBackendSession(
            {userObj: userLoggedInBackendSession}
      )
      }

    })()
        }
        ,[]
    )

return (
    <Router>
    <Navbar />

        {console.log("Loaded App.js")}

    <Routes>
        <Route exact path='/'  element={<Home />} />
        <Route path='/jobposting' element={<JobPostingForm/>} />
        <Route path='/BACKEND_DEBUG' element={<PostCommentForm postedComment={postedComment} />}/>
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/signin' element={<SignIn/>} />
        <Route path='/viewjobposts' element={<ViewJobPosts postedJob={postedJob} />} />

        <Route exact path='/profile/:uid' element={<ProfilePage/>} />
        <Route exact path='current/jobpostings' element={<MyJobPosts postedJob={postedJob} />}/>
        {/*<Route path='/SESSION_COOKIES_DEBUG' element={<SESSION_COOKIES_DEBUG/>}/>*/}

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
