import {useEffect,useState} from "react";
import './PostCommentForm.css';
import CoreUICard from "../../components/CoreUICard";
import CommentAPIService from "./CommentAPIService";
            // "Access-Control-Allow-Origin":  "http://localhost:3000/",
            // "Access-Control-Allow-Methods": "POST",
            // "Access-Control-Allow-Headers": "Content-Type, Authorization"
function PostCommentForm  (props)  {
  const [commentTitle, setCommentTitle] = useState("");
  const [commentBody, setCommentBody] = useState("");
  const handleSubmit = (event) => {
    event.preventDefault();

    CommentAPIService.AddCommentPost({"title" : commentTitle, "body" : commentBody})
      .then((response) => props.postedComment(response))
        .then((any)=> window.location.reload())
      .catch(error => console.log('Following error occured after fetching from API: ',error))

    setCommentTitle('')
    setCommentBody('')

  };

    // POLLING_DATABASE_UPDATE_INTERVAL = 5

    let [data,setData] = useState([{}]);
    useEffect(() => {
        fetch("/get?mapAsFields=true").then(
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
                <h1> Flask and React integration </h1>
                <h3>by Antoine Cantin. TEMPORARY PAGE to test requests,routes,etc.. and api feature
                    {/* eslint-disable-next-line react/style-prop-object */}
                    of the backend. <span style={{color: 'red'}}> DO NOT EDIT</span>.</h3>
            </header>
            <h1>Job Posts</h1>
            <div className="job-posts">
                {typeof data.id === 'undefined' ? (
                    <p>Loading... (Don't forget to launch the API/backend server!)</p>
                ) : (
                    data.id.map((id, i) => (
                        <CoreUICard
                            key={i}
                            title={data.title[i]}
                            body={data.body[i]}
                            id={id}
                            date={new Date(Date.parse(data.date[i])).toLocaleString()}
                            editDate={new Date(Date.parse(data.editDate[i])).toLocaleString()}
                        />
                    ))
                )}
            </div>
            <h3>Post a new comment</h3>
            <form onSubmit={handleSubmit} className="comment-form">
                <label htmlFor="comment_title">Title</label>
                <input
                    type="text"
                    id="comment_title"
                    name="comment_title"
                    value={commentTitle}
                    onChange={(e) => setCommentTitle(e.target.value)}
                    required
                />

                <label htmlFor="comment_body">Comment</label>
                <textarea
                    id="comment_body"
                    name="comment_body"
                    rows="4"
                    cols="50"
                    placeholder="What's on your mind?"
                    value={commentBody}
                    onChange={(e) => setCommentBody(e.target.value)}
                    required
                ></textarea>

                <div className="submit-button-wrapper">
                    <button id="submitComment" type="submit">
                        Publish
                    </button>
                </div>
            </form>
        </div>
    );
}

export default PostCommentForm;

