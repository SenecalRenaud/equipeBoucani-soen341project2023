import {useEffect,useState} from "react";
import "../PostAJob/JobPostingForm.css";
import CoreUICard from "../../components/CoreUICard";
import JobPostCard from "../../components/JobPostCard";

function ViewJobPosts (props)   {
    let [data,setData] = useState([{}]);
    let [er,setEr] = useState(false);
    let [errorString, setErrorString] = useState("");
    useEffect(() => {

        fetch("/getjob?mapAsFields=true").then(
            response => response.json()
        ).then(
            data => {
                setData(data);
                console.log(data);
            }
        ).catch(function(error){
            console.log("empty db", error.toString());
            setErrorString(error.toString())
            setEr(true);
        })
    },[])
    if (er || typeof data.id === 'undefined'){ // Json request body not loaded properly if not job post ID
        if (errorString.startsWith("SyntaxError")// || errorString === "SyntaxError: Unexpected token 'P', \"Proxy error\"... is not valid JSON"
        ){
            return (
                <div className="post-comment-container">
                    <header className="Debug-header">
                        <h1> JobPost CRUD Debug Ozan Branch Migrating From Antoine CommentPostBranch </h1>
                    </header>
                    <h1>Job Posts</h1>
                    <div className="job-posts">
                        <p align="center" style={{color: "#FF5733"}}>Your API/backend server is not launched. Please ask an admin to launch the server to use this page.</p>
                    </div>
                </div>
            );
        }
        else{
            return (
                <div className="post-comment-container">
                    <header className="Debug-header">
                        <h1> JobPost CRUD Debug Ozan Branch Migrating From Antoine CommentPostBranch </h1>
                    </header>
                    <h1>Job Posts</h1>
                    <hr/>
                    <h3 align="center" style={{color: "#8B8000"}}>No posts in the job_post table.</h3>
                </div>
            );
        }
    }
    else{
        return (
            <div className="post-comment-container">
                <header className="Debug-header">
                    <h1> JobPost CRUD Debug Ozan Branch Migrating From Antoine CommentPostBranch </h1>
                </header>
                <h1>Job Posts</h1>
                <div className="job-posts">
                    { data.id &&
                        data.id.map((id, i) => (
                        <JobPostCard
                            key={i}
                            jobtype={data.jobtype[i]}
                            title={data.title[i]}
                            location={data.location[i]}
                            salary={data.salary[i]}
                            description={data.description[i]}
                            tags={data.tags[i]}
                            id={id}
                            date={new Date(Date.parse(data.date[i])).toLocaleString()}
                            editDate={new Date(Date.parse(data.editDate[i])).toLocaleString()}
                        />
                    ))}
                </div>
            </div>
        );
    }
}

export default ViewJobPosts;
