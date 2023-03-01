import React, {useState} from "react";
import './App.css';
import NavbarAntoine from './components/WebsiteNavbar'; //antoines navbar kept here
import { Header, Navbar} from './components'; //jack's part
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import Home from './pages/Home/home';
import JobPosting from "./pages/PostAJob/jobposting";
// import IntTestListAllUsers from "./pages/BACKEND_DEBUG/IntTestListAllUsers";
import Form from "./pages/BACKEND_DEBUG_FORM/Form";

function App() {
    const [comments, setComments] = useState([""]);
    const postedComment = (comment) =>{
    let new_comments = [...comments,comment]
    setComments(new_comments)
  }
return (
    <Router>
    <Navbar />
    <Header />
    <Routes>
        <Route exact path='/' exact element={<Home />} />
        <Route path='/jobposting' element={<JobPosting/>} />
        <Route path='/BACKEND_DEBUG_FORM' element={<Form postedComment={postedComment}/>}/>
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