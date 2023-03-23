import {useEffect,useState} from "react";
import "../PostAJob/JobPostingForm.css";
import CoreUICard from "../../components/CoreUICard";

function ViewJobPosts (props)   {
    let [data,setData] = useState([{}]);
    useEffect(() => {
        fetch("/getjob?mapAsFields=true").then(
            response => response.json()
        ).then(
            data => {
                setData(data);
                console.log(data);
            }
        )
    },[])
    return (
        <div className="post-comment-container">
            <header className="Debug-header">
                <h1> JobPost CRUD test frontend by Ozan </h1>
            </header>
            <h1>Job Posts</h1>
            <div className="job-posts">
                {typeof data.id === 'undefined' ? <p>Loading... (Don't forget to launch the API/backend server!)</p> : data.id.map((id, i) => (
                        <CoreUICard
                            key={i}
                            title={data.title[i]}
                            body={data.body[i]}
                            id={id}
                            date={new Date(Date.parse(data.date[i])).toLocaleString()}
                            editDate={new Date(Date.parse(data.editDate[i])).toLocaleString()}
                        />
                        ))}
            </div>
        </div>
    );
}

export default ViewJobPosts;
