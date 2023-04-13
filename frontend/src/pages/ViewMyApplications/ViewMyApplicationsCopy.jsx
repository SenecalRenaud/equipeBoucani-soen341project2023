import {useEffect, useRef, useState} from "react";
import "../PostAJob/JobPostingForm.css";
import CoreUICard from "../../components/CoreUICard";
import JobPostCard from "../../components/JobPostCard";
import SearchBar from "../../components/PostingsSearchBar/SearchBar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import ApplicationCard from "../../components/ApplicationCard";
import ApplicationCardCopy from "../../components/ApplicationCard/indexCopy";

// let loadNum = 1;
function ViewMyApplicationsCopy (props)   {
    // const refCounter = useRef(0);
    const filteredIndicesHashSet = new Set();
    const [data,setData] = useState(
        {
  "applicantUid": [
    "ahSBM7SDQ4VyKGDnZbIdj2MVbCf2"
  ],
  "coverLetter": [
    "HEWWOOOOOOOOO"
  ],
  "date": [
    "2023-04-13T16:35:34"
  ],
  "id": [
    7
  ],
  "jobPostId": [
    "420"
  ]
}
    );
    const [defaultData,setDefaultData] = useState([{}]);
    const [searchBarInput, setSearchBarInput] = useState('');

    let [er,setEr] = useState(false);
    let [errorString, setErrorString] = useState("");


    // useEffect(() => {
    //
    //     fetch("/getapplications?mapAsFields=true").then(
    //         response => response.json()
    //     ).then(
    //         data => {
    //             console.log(window.localStorage.getItem("uid"))
    //             let otherApplicantsToRemove = []; //Must be list, since splice needs to avoid indices shifting
    //             data.applicantUid.forEach(
    //                 (applicantUid, applicationId) => {
    //                     if( applicantUid !== window.localStorage.getItem("uid"))
    //                         otherApplicantsToRemove.push(applicationId)
    //                 }
    //             )
    //
    //             Object.keys(data).forEach(fieldName => {
    //                 const arr = data[fieldName]
    //
    //                 for (let i = otherApplicantsToRemove.length - 1; i >= 0; i--) {
    //                     // Remove the element at the current index
    //                     arr.splice(otherApplicantsToRemove[i], 1);
    //                 }
    //                 data[fieldName] = arr;
    //             })// Mutates obj since arrays of obj are shallow copies
    //
    //             setData(data);
    //             setDefaultData(data)
    //             console.log("HIIIIIIIIIIIIIIIIIIIII")
    //             console.log(data)
    //
    //         }
    //     ).catch(function(error){
    //         console.log("empty db", error.toString());
    //         setErrorString(error.toString())
    //         setEr(true);
    //     })
    //
    // },[])



    if (er || typeof data.id === 'undefined'){ // Json request body not loaded properly if not job post ID
        if (errorString.startsWith("SyntaxError")// || errorString === "SyntaxError: Unexpected token 'P', \"Proxy error\"... is not valid JSON"
        ){
            return (
                <div className="post-comment-container">
                    <h1>My Applications</h1>
                    <div className="job-posts">
                        <p align="center" style={{color: "#FF5733"}}>Your API/backend server is not launched. Please ask an admin to launch the server to use this page.</p>
                    </div>
                </div>
            );
        }
        else{
            return (
                <div className="post-comment-container">
                    <h1>My Applications</h1>
                    <hr/>
                    <h3 align="center" style={{color: "#8B8000"}}>No applications in the job_post table.</h3>
                </div>
            );
        }
    }
    else{
        return (
            <div className="post-comment-container">
                <h1>My Applications</h1>
                <span style={{display: 'inline-block' ,fontSize: '.9em' , marginTop: "-1rem"}}>
                 <b id="searchResultCount"> Found {(data.id ? data.id.length : 0)} results.</b>

            </span>

                <hr  style={{
                    color: '#000000',
                    backgroundColor: '#000000',
                    height: 5.5,
                    borderColor : '#000000'
                }}/>
                <div className="job-posts">
                    { data.id && data.id.map((id, i)  =>

                            <ApplicationCardCopy
                                    applicationId={id}
                                    jobPostId={data.jobPostId[i]}
                                    applicantUid={data.applicantUid[i]}
                                    coverLetter={data.coverLetter[i]}
                                    date={data.date[i]}
                                />)
                    }
                </div>
            </div>
        );
    }
}

export default ViewMyApplicationsCopy;
