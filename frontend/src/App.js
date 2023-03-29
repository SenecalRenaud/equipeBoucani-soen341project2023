import React, {useState} from "react";
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
return (
    <Router>
    <Navbar />
        {
            Cookies.get("BACKEND_SESSION_ENDED") != null &&
                CommentAPIService.UserLogout()

        }
        {console.log("Loaded App.js")}
    <Routes>
        <Route exact path='/'  element={<Home />} />
        <Route path='/jobposting' element={<JobPostingForm/>} />
        <Route path='/BACKEND_DEBUG' element={<PostCommentForm postedComment={postedComment} />}/>
        <Route path='/signup' element={<SignUp/>} />
        <Route path='/signin' element={<SignIn/>} />
        <Route path='/viewjobposts' element={<ViewJobPosts postedJob={postedJob} />} />

        <Route exact path='/profile/:uid' element={<ProfilePage/>} />
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
