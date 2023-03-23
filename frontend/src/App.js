import React, {useState} from "react";
import './App.css';

import { Header, Navbar} from './components';

import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import Home from './pages/Home/home';
import JobPostingForm from "./pages/PostAJob/JobPostingForm";

import PostCommentForm from "./pages/BACKEND_DEBUG/PostCommentForm";
import ProfilePage from "./pages/ProfilePage/ProfilePage";

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
        <Route path='/ProfilePage' element={<ProfilePage />} />
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