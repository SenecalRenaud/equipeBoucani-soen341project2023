import React, {useState} from "react";
import './App.css';

import { Header, Navbar} from './components';

import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import Home from './pages/Home/home';
import JobPostingForm from "./pages/PostAJob/JobPostingForm";

import PostCommentForm from "./pages/BACKEND_DEBUG/PostCommentForm";
// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAbZ9hPnlnzSugzNhNVliudx2-A6Tc1D1g",
  authDomain: "boucani-webapp.firebaseapp.com",
  projectId: "boucani-webapp",
  storageBucket: "boucani-webapp.appspot.com",
  messagingSenderId: "609638546595",
  appId: "1:609638546595:web:2f33d88d2e458defd35316",
  measurementId: "G-N5XFLTXXBS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
function App() {
    const [comments, setComments] = useState([""]);
    const postedComment = (comment) =>{
    let new_comments = [...comments,comment]
    setComments(new_comments)
  }
return (
    <Router>
    <Navbar />

    <Routes>
        <Route exact path='/'  element={<Home />} />
        <Route path='/jobposting' element={<JobPostingForm/>} />
        <Route path='/BACKEND_DEBUG' element={<PostCommentForm postedComment={postedComment} />}/>
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