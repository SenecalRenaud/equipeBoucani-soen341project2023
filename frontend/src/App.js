import React from "react";
import './App.css';
import Navbar from './components/WebsiteNavbar';
import { BrowserRouter as Router, Routes, Route}
    from 'react-router-dom';
import Home from './pages/Home/home';
import JobPosting from "./pages/PostAJob/jobposting";
import AntoineIntegrationTestListAllUsers from "./pages/BACKEND_DEBUG/IntTestListAllUsers";
function App() {
return (
    <Router>
    <Navbar />
    <Routes>
        <Route exact path='/' exact element={<Home />} />
        <Route path='/jobposting' element={<JobPosting/>} />
        <Route path='/DEBUG_BACKEND' element={<AntoineIntegrationTestListAllUsers/>} />

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