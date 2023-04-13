import {useEffect, useRef, useState} from "react";
import "../PostAJob/JobPostingForm.css";
import CoreUICard from "../../components/CoreUICard";
import JobPostCard from "../../components/JobPostCard";
import SearchBar from "../../components/PostingsSearchBar/SearchBar";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faFilter} from "@fortawesome/free-solid-svg-icons";
import ApplicationCard from "../../components/ApplicationCard";
import ApplicationCardCopy from "../../components/ApplicationCard/indexCopy";
import {useParams} from "react-router-dom";

// let loadNum = 1;
function ViewMyApplications (props)   {
    // const refCounter = useRef(0);

    const url_params = useParams();

    const filteredIndicesHashSet = new Set();
    const [data,setData] = useState([{}]);
    const [defaultData,setDefaultData] = useState([{}]);
    const [searchBarInput, setSearchBarInput] = useState('');

    let [er,setEr] = useState(false);
    let [errorString, setErrorString] = useState("");


    useEffect(() => {

        fetch("/getapplications?mapAsFields=true").then(
            response => response.json()
        ).then(
            data => {

                let otherApplicantsToRemove = []; //Must be list, since splice needs to avoid indices shifting
                data.applicantUid.forEach(
                    (applicantUid, applicationId) => {
                        if( applicantUid !== url_params.uid)
                            otherApplicantsToRemove.push(applicationId)
                    }
                )

                Object.keys(data).forEach(fieldName => {
                    const arr = data[fieldName]

                    for (let i = otherApplicantsToRemove.length - 1; i >= 0; i--) {
                        // Remove the element at the current index
                        arr.splice(otherApplicantsToRemove[i], 1);
                    }
                    data[fieldName] = arr;
                })// Mutates obj since arrays of obj are shallow copies

                setData(data);
                setDefaultData(data)


            }
        ).catch(function(error){
            console.log("empty db", error.toString());
            setErrorString(error.toString())
            setEr(true);
        })

    },[url_params.uid])



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
                    {

                        return (
                            ((url_params.uid === data.applicantUid[i])) ?

                                <ApplicationCard
                                    applicationId={id}
                                    jobPostId={data.jobPostId[i]}
                                    applicantUid={data.applicantUid[i]}
                                    coverLetter={data.coverLetter[i]}
                                    date={data.date[i]}
                                /> : null
                        )})}
                </div>
            </div>
        );
    }
}

export default ViewMyApplications;
